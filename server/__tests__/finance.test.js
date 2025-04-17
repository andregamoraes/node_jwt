const { startApp } = require('../../index');
const request = require('supertest');

jest.mock('../config', () => ({
	secret_key: 'DEV_SECRET',
	enviroment: 'TEST',
	database: {
		name: '',
		user: '',
		password: '',
		options: {
			dialect: 'sqlite',
			storage: ':memory:',
			logging: false,
		},
	}
}));

let server;
let app;
let models;
let token;

beforeAll(async () => {
    const result = await startApp();
    app = result.app;
    server = result.server;
    models = app.get('models');

    await request(app).post('/api/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: '123456'
    });

	const res = await request(app).post('/api/authenticate').send({
		email: 'test@example.com',
		password: '123456'
	});

	token = res.body.data.token;
});

afterAll(async () => {
    if (server) {
    await new Promise(resolve => server.close(resolve));
    }
});

describe('Finance tests', () => {
    let financeId;

    it('should return error if required fields are missing', async () => {
		const data = {
            user_id: 1,
            type: 'income',
            status: 'paid',
            description: 'Test description',
            price: 100
        }

		const res = await request(app)
			.post('/api/finance')
            .set('Authorization', `Bearer ${token}`)
			.send(data);

		expect(res.statusCode).toBe(400);
	});

	it('should create finance with success', async () => {
		const data = {
            user_id: 1,
            type: 'income',
            status: 'paid',
            description: 'Test description',
            price: 100,
            paid_date: '2023-10-01'
        }

		const res = await request(app)
			.post('/api/finance')
            .set('Authorization', `Bearer ${token}`)
			.send(data);

		expect(res.statusCode).toBe(201);

		const finance = await models.Finance.findOne({ where: { user_id: 1, price: 100, type: 'income' } });
		expect(finance).not.toBeNull();
		expect(finance.user_id).toBe(data.user_id);
        expect(finance.type).toBe(data.type);
		expect(finance.status).toBe(data.status);
		expect(finance.description).toBe(data.description);
        expect(finance.price).toBe(data.price);

        financeId = finance.id;
	});

    it('should update finance with success', async () => {
		const data = {
            price: 200
        }

		const res = await request(app)
			.put(`/api/finance/${financeId}`)
            .set('Authorization', `Bearer ${token}`)
			.send(data);

		expect(res.statusCode).toBe(200);

		const finance = await models.Finance.findOne({ where: { id: financeId } });
		expect(finance).not.toBeNull();
		expect(finance.price).toBe(200);
	});

	it('should list finances with success', async () => {
		const res = await request(app)
			.get('/api/finances')
            .set('Authorization', `Bearer ${token}`)
			.send();

		expect(res.statusCode).toBe(200);

		const finance = await models.Finance.findAll({ where: { id: financeId } });

		expect(finance.length).toBe(1);
	});

    it('should remove finances with success', async () => {
		const res = await request(app)
			.delete(`/api/finance/${financeId}`)
            .set('Authorization', `Bearer ${token}`)
			.send();

		expect(res.statusCode).toBe(200);

		const finance = await models.Finance.findAll({ where: { id: financeId } });

        expect(finance.length).toBe(0);
	});
});
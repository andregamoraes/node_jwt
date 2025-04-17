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

beforeAll(async () => {
  const result = await startApp();
  app = result.app;
  server = result.server;
  models = app.get('models');
});

afterAll(async () => {
  if (server) {
    await new Promise(resolve => server.close(resolve));
  }
});

describe('Auth tests', () => {
	it('should register user with success', async () => {
		const email = 'test@test.com';
		const name = 'Test User';

		const res = await request(app)
			.post('/api/register')
			.send({ name: name, email: email, password: '123456' });

		expect(res.statusCode).toBe(201);

		const user = await models.User.findOne({ where: { email } });
		expect(user).not.toBeNull();
		expect(user.email).toBe(email);
	});

	it('should return error if email already exists', async () => {
		const email = 'test@test.com';
		const name = 'Test User';

		const res = await request(app)
			.post('/api/register')
			.send({ name: name, email: email, password: '123456' });

		expect(res.statusCode).toBe(409);

		const user = await models.User.findAll({ where: { email } });

		expect(user.length).toBe(1);
	});

	it('should auth user with success', async () => {
		const res = await request(app)
			.post('/api/authenticate')
			.send({ email: 'test@test.com', password: '123456' });

		expect(res.statusCode).toBe(200);
		expect(res.body.data).toHaveProperty('token');
	});
});
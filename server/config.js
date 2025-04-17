module.exports = {
	secret_key: 'DEV_SECRET',
	enviroment: 'DEV',
	projectHost: 'https://localhost:3000',
	database : {
		name: 'database',
		user: 'admin',
		password: 'password',
		options: {
			host: 'localhost',
			dialect: 'postgres',
			port: 5432,
			logging: false,
			query: {
				raw: true
			},
			pool: {
				max: 10,
				min: 1,
				idle: 10000,
				acquire: 30000
			}
		},
	}
};


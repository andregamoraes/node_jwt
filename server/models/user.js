module.exports = (app) => {
	const async = require('async');
	const Auth = require('../auth/auth')(app);

	const authenticate = (user, callback) => {
		const User = app.get('models').User;

		const filter = {
			active: true,
			email: user.email
		};

		async.auto({
			user: done => {
				User.findOne({
					where: filter,
					attributes: ['id', 'email', 'password']
				}).then(results => done(null, results), error => done(error));
			},
			check: ['user', (results, done) => {
				if (!results.user) {
					done('NOT_EXIST');
					return;
				}

				if (!Auth.isValidPassword(user.password, results.user.password)) {
					done('WRONG_PASSWORD');
					return;
				}

				done();
			}],
			data: ['check', (results, done) => {
				const data = {
					id: results.user.id,
					name: results.user.name,
					token: Auth.getToken(results.user.id)
				};

				done(null, data);
			}]
		}, (err, results) => {
			if (err) {
				callback({
					status: 'error',
					code: err
				});
				return;
			}

			callback({
				status: 'success',
				data: results.data
			});
		});
	};

	const create = (data, callback) => {
		const User = app.get('models').User;

		data.password = Auth.encryptPassword(data.password);

		if (data.email) {
			data.email = data.email.toLowerCase();
		}

		async.auto({
			existEmail: done => {
				if (!data.email) {
					done(null, false);
					return;
				}

				User.findOne({
					where: {
						email: data.email
					},
					attributes: ['id']
				}).then(results => done(null, results), error => done(error));
			},
			addUser: ['existEmail', (results, done) => {
				if (results.existEmail) {
					done('EXIST_EMAIL');
					return;
				}

				User.create(data).then(results => done(null, results), error => done(error));
			}]
		}, (err) => {
			if (err) {
				callback({
					status: 'error',
					code: err
				});
				return;
			}

			callback({
				status: 'success'
			});
		});
	};

	return {
		create,
		authenticate
	};
};

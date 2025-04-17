module.exports = (app) => {
	const UserModel = require('../models/user')(app);

	const authenticateAction = (req, res) => {
		const user = {
			email: req.body.email.toLowerCase(),
			password: req.body.password
		};

		UserModel.authenticate(user, (resp) => {
			res.json(resp);
		});
	};

	const registerAction = (req, res) => {
		const data = {
			active: true,
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
		};

		if (!data.name || !data.email || !data.password) {
			return res.status(400).json({
				error: 'Missing required fields: name, email, and password are mandatory'
			});
		}

		UserModel.create(data, (result) => {
			if (result.status === 'error') {
				if (result.code === 'EXIST_EMAIL') {
					return res.status(409).json({ error: 'Email already exists' });
				} else {
					return res.status(500).json({ error: 'Internal Server Error' });
				}
			}

			return res.status(201).json({ message: 'User created successfully' });
		});
	};

	return {
		registerAction,
		authenticateAction
	};
};

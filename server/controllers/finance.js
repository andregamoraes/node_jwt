module.exports = (app) => {
	const Auth = require('../auth/auth')();
	const FinanceModel = require('../models/finance')(app);

	const listAction = (req, res) => {
		const filter = {
            user_id: Auth.getUserId(app, req)
        };

		if (req.params.id) {
			filter.id = req.params.id;

			FinanceModel.find(filter, (resp) => {
				res.json(resp);
			});
			return;
		}

		FinanceModel.listAll(filter, (resp) => {
			res.json(resp);
		});
	};

	const addAction = (req, res) => {
		const data = {
            user_id: Auth.getUserId(app, req),
            type: req.body.type,
            description: req.body.description,
			status: req.body.status,
            price: req.body.price,
            paid_date: req.body.paid_date
        };

        if (!data.type || !data.price || !data.paid_date || !data.status) {
			return res.status(400).json({
				error: 'Missing required fields: type, price, status and paid_date are mandatory'
			});
		}

		FinanceModel.add(data, (result) => {
			if (result.status === 'error') {
				return res.status(500).json({ error: 'Internal Server Error' });
			}

			return res.status(201).json({ message: 'Finance created successfully' });
		});
	};

	const updateAction = (req, res) => {
		const changes = {
			type: req.body.type,
            description: req.body.description,
            price: req.body.price,
            paid_date: req.body.paid_date
        }

		const filter = {
			id: req.params.id,
			user_id: Auth.getUserId(app, req)
		};

		FinanceModel.update(changes, filter, (resp) => {
			res.json(resp);
		});
	};

	const removeAction = (req, res) => {
		const filter = {
			id: req.params.id,
			user_id: Auth.getUserId(app, req)
		};

		FinanceModel.remove(filter, (resp) => {
			res.json(resp);
		});
	};

	return {
        listAction,
		updateAction,
		addAction,
		removeAction
	};
};

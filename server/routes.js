module.exports = (app) => {
    const userController = require('./controllers/user')(app);
	const financeController = require('./controllers/finance')(app);
	const Auth = require('./auth/auth')(app);

	const allowCORS = (req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		res.header('Access-Control-Allow-Headers', 'content-type, Authorization, Content-Length, X-Requested-With, Origin, Accept, x-access-token');

		if ('OPTIONS' === req.method) {
			res.status(200).end();
		} else {
			next();
		}
	};

    const catch404Action = (req, res, next) => {
		res.status(404).send({
			message: 'Route ' + req.url + ' not found.'
		});
	};

	const catch500Action = (err, req, res, next) => {
		res.status(500).send({ error: err });
	};

	return {
		setup: () => {
			app.use(allowCORS);
			app.use(Auth.authRequest);

			//Public endpoints
            app.post('/api/register', userController.registerAction);
            app.post('/api/authenticate', userController.authenticateAction);
			//End of public endpoints

			app.post('/api/finance', financeController.addAction);
			app.get('/api/finances', financeController.listAction);
            app.get('/api/finances/:id', financeController.listAction);
			app.put('/api/finance/:id', financeController.updateAction);
			app.delete('/api/finance/:id', financeController.removeAction);

			app.use(catch404Action);
			app.use(catch500Action);

		}
	};
};

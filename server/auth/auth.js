module.exports = (app) => {
	const jwt = require('jwt-simple');
	const bcrypt = require('bcryptjs');
    const moment = require('moment');

	function encryptPassword(password) {
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(password, salt);

		return hash;
	}

	function isValidPassword(password, hash) {
		return bcrypt.compareSync(password, hash);
	}

	function getToken(id) {
		return jwt.encode({
			user: {
				id: id,
                date: moment().format('YYYY-MM-DD'),
			}
		}, app.get('SecretKey'));
	};

	function getTokenInfo(app, req) {
		let token;
		let decoded;

		try {
			token = req.headers.authorization.replace('Bearer ', '');
			decoded = jwt.decode(token, app.get('SecretKey'));
		} catch (err) {
			return {};
		}

		if (!decoded.user) {
			return {};
		}

		return decoded.user;
	}

	function authRequest(req, res, next) {
		const publicEndpoints = [];

		publicEndpoints.push('/api/register');
        publicEndpoints.push('/api/authenticate');

		if (publicEndpoints.includes(req.path)) {
			next();
			return;
		}

		let userInfo = getTokenInfo(app, req);

		//Add date verification

		if (!userInfo || !userInfo.id || !userInfo.date) {
			res.status(401).send('Authentication required');
			return;
		}

		next();
	}

	function getUserId(app, req) {
		return getTokenInfo(app, req).id || 0;
	}

	return {
		encryptPassword,
		isValidPassword,
		getToken,
		getUserId,
		authRequest
	};
};

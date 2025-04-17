module.exports = (app) => {
    let sequelize;
	const Sequelize = require('sequelize');
	const config = require('../config');
	const paranoidOptions = {
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
		deletedAt: 'deleted_at',
		paranoid: true
	};

    const init = async () => {
		try {
			sequelize = new Sequelize(config.database.name, config.database.user, config.database.password, config.database.options);
			app.set('sequelize', sequelize);

			await sequelize.authenticate();

			defineTables();

			await sequelize.sync();

			console.log('Database connected');
		} catch (error) {
			console.error('DATABASE ERROR:', error);
			throw error;
		}
	};

    const defineTables = () => {
		let User;
        let Finance;

		User = sequelize.define('user', {
			name: Sequelize.STRING,
            email: Sequelize.STRING,
            password: Sequelize.STRING,
			active: Sequelize.BOOLEAN
		}, paranoidOptions);

		Finance = sequelize.define('finance', {
			user_id: Sequelize.INTEGER,
			type: Sequelize.STRING(15),
			status: Sequelize.STRING(15),
			description: Sequelize.STRING,
			price: Sequelize.FLOAT,
			paid_date: Sequelize.DATE,
		}, paranoidOptions);

		Finance.belongsTo(User, {
			foreignKey: 'user_id'
		});

		const transaction = (...args) => {
			return sequelize.transaction(...args);
		};

		app.set('database', {
			transaction: transaction
		});

		app.set('models', {
            User: User,
            Finance: Finance,
			Sequelize: Sequelize,
			SequelizeInstance: sequelize
		});
	};

    return {
		init: init
	};
}
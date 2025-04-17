module.exports = (app) => {
	const listAll = (filter, callback) => {
        const Finance = app.get('models').Finance;

        Finance.findAll({
            where: filter,
            order: [['paid_date', 'ASC']]
        })
        .then(results => {
            callback({
                status: 'success',
                data: results
            });
        }, (error) => {
            callback({
                status: 'error',
                code: error
            });
        });
    };

	const add = (data, callback) => {
		const Finance = app.get('models').Finance;

		Finance.create(data).then((data) => {
			callback({
				status: 'success',
				data: data
			});
		}, (err) => {
			callback({
				status: 'error',
				code: err
			});
		});
	};

    const update = (changes, filter, callback) => {
		const Finance = app.get('models').Finance;

		Finance.update(changes, {
			where: filter
		}).then(() => {
			callback({
				status: 'success'
			});
		}, (err) => {
			callback({
				status: 'error',
				code: err
			});
		});
	};

    const remove = (filter, callback) => {
		const Finance = app.get('models').Finance;

		Finance.update({
            deleted_at: new Date()
        }, {
			where: filter
		}).then(() => {
			callback({
				status: 'success'
			});
		}, (err) => {
			callback({
				status: 'error',
				code: err
			});
		});
	};

	return {
        listAll,
		add,
        update,
        remove
	};
};

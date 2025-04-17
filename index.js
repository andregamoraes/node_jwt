let app;
let http;
let config;
let Routes;
let express;
let Database;
let bodyParser;

http = require('http');
express = require('express');
bodyParser = require('body-parser');
Routes = require('./server/routes');
config = require('./server/config');
Database = require('./server/models/database');

app = express();

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.set('SecretKey', config['secret_key']);
app.set('projectHost', config.projectHost);


app.get('/', (req, res) => {
  res.send('API is running 🎉');
});

async function startApp() {
	await Database(app).init();
	Routes(app).setup();
	app.use((err, req, res) => {
		console.error(err.stack);
		res.status(500).send('Something broke!');
	});

	const server = http.createServer(app);
	return { app, server };
}

if (config.enviroment !== 'TEST') {
	startApp().then(({ server }) => {
	server.listen(3000, () => {
		console.log('Server running on port 3000');
		});
	});
}

module.exports = { startApp };

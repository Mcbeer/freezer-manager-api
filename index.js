const express = require('express');
const cors = require('cors');
const { database } = require('./src/db/db.connection');
const { logger } = require('./src/utils/logger');
const { container } = require('./src/routes/container');
const { product } = require('./src/routes/product');
const { unit } = require('./src/routes/unit');

const app = express();
app.use(express.json());
app.use(
	cors({
		origin: (origin, callback) => {
			callback(null, true);
		},
	})
);

//Root
app.get('/', (req, res) => {
	res.json({ Hello: 'world!' });
});
app.use('/container', container);
app.use('/product', product);
app.use('/unit', unit);

//DONT WRITE BELOW THIS
app.listen(process.env.PORT, () => {
	database.migrate
		.latest()
		.then(() => {
			logger.info(`Now listening on ${8000}`);
		})
		.catch((error) => {
			logger.error(error);
		});
});

const express = require('express');
const cors = require('cors');
const { database } = require('./src/db/db.connection');
const { logger } = require('./src/utils/logger');
const { errorHandler } = require('./src/middleware/errorHandler');

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

//Get all containers
app.get('/container/all', (req, res) => {
	database
		.select('*')
		.from('container')
		.orderBy('updated_at', 'desc')
		.then((containers) => {
			res.json(containers);
		});
});

//Post container
app.post('/container/post', (req, res) => {
	const containerToPost = {
		name: req.body.name,
		description: req.body.description,
	};

	return database('container')
		.insert(containerToPost)
		.returning('*')
		.then((newContainer) => {
			res.json(newContainer);
		})
		.catch((err) => {
			res.send('Der skete en fejl. Noget mangler');
		});
});

//Get products for container
app.get('/product/:containerId', (req, res) => {
	return database('product')
		.select('*')
		.where({
			container_id: req.params.containerId,
		})
		.then((products) => {
			res.json(products);
		});
});
app.post('/product/post', (req, res) => {
	const productToPost = {
		container_id: req.body.container_id,
		name: req.body.name,
		amount: req.body.amount,
		unit: req.body.unit,
		expiration_date: req.body.expiration_date,
	};

	database('product')
		.insert(productToPost)
		.returning('*')
		.then((newProduct) => {
			res.json(newProduct);
		})
		.catch((err) => {
			res.send('Der skete en fejl. Noget mangler');
		});
});

app.use(errorHandler);

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

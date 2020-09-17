const express = require('express');
const cors = require('cors');
const { database } = require('./src/db/db.connection');
const { logger } = require('./src/utils/logger');

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
		.orderBy('last_used', 'desc')
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
			res.json(newContainer[0]);
		})
		.catch((err) => {
			res.send('Der skete en fejl. Noget mangler');
		});
});

//Update container
app.put('/container/update/:containerId', (req, res) => {
	const containerToPut = {
		name: req.body.name,
		description: req.body.description,
		updated_at: new Date().toISOString(),
		last_used: new Date().toISOString(),
	};

	return database('container')
		.update(containerToPut)
		.returning('*')
		.where({
			id: req.params.containerId,
		})
		.then((container) => {
			res.json(container[0]);
		});
});

//Get products for container
app.get('/product/:containerId', (req, res) => {
	return database('product')
		.select('*')
		.where({
			container_id: req.params.containerId,
		})
		.orderBy('created_at', 'desc')
		.then((products) => {
			res.json(products);
		});
});

//Post product
app.post('/product/post', (req, res) => {
	const productToPost = {
		container_id: req.body.container_id,
		name: req.body.name,
		amount: req.body.amount,
		unit_id: req.body.unit_id,
		expiration_date: req.body.expiration_date,
	};
	console.log(productToPost);

	database('product')
		.insert(productToPost)
		.returning('*')
		.then((newProduct) => {
			database('container')
				.update({
					last_used: new Date().toISOString(),
				})
				.returning('*')
				.where({
					id: productToPost.container_id,
				})
				.then((container) => {
					res.json({ newProduct, container });
				});
		})
		.catch((err) => {
			res.send('Der skete en fejl. Noget mangler');
		});
});

//Get all available units
app.get('/units/all', (req, res) => {
	return database('unit')
		.select('*')
		.then((units) => {
			return res.json(units);
		});
});

//Get unit from id
app.get('/units/:unitId', (req, res) => {
	return database('unit')
		.select('*')
		.where({ unit_id: req.params.unitId })
		.then((unit) => {
			res.json({ unit });
		})
		.catch((err) => {
			res.send("Error fetching unit from the database");
		});
});


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

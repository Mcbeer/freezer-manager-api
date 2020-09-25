const { Router } = require('express');
const { database } = require('../db/db.connection');

const router = Router();

//Get products for container
router.get('/:containerId', (req, res) => {
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
router.post('/post', (req, res) => {
	const productToPost = {
		container_id: req.body.container_id,
		name: req.body.name,
		amount: req.body.amount,
		unit_id: req.body.unit_id,
		expiration_date: req.body.expiration_date,
	};

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
					console.log({ newProduct, container });
					res.json(newProduct[0]);
				});
		})
		.catch(() => {
			res.send('Der skete en fejl. Noget mangler');
		});
});

//Delete product
router.delete('/delete/:productId', (req, res) => {
	database('product')
		.delete()
		.where({ id: req.params.productId })
		.returning('*')
		.then((deletedProduct) => {
			res.json(deletedProduct[0]);
		})
		.catch(() => {
			res.send('Der skete en fejl.');
		});
});

module.exports.product = router;

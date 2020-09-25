const { Router } = require('express');
const { database } = require('../db/db.connection');

const router = Router();

//Get all containers
router.get('/all', (req, res) => {
	database
		.select('*')
		.from('container')
		.orderBy('last_used', 'desc')
		.then((containers) => {
			res.json(containers);
		});
});

//Post container
router.post('/post', (req, res) => {
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
		.catch(() => {
			res.send('Der skete en fejl. Noget mangler');
		});
});

//Update container
router.put('/update/:containerId', (req, res) => {
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

router.delete('/delete/:containerId', (req, res) => {
	const containerId = req.params.containerId;
	database('product')
		.delete()
		.where({ container_id: containerId })
		.then(() => {
			database('container')
				.delete()
				.where({ id: containerId })
				.returning(['id', 'name', 'description'])
				.then((deletedContainer) => {
					res.json(deletedContainer[0]);
				});
		});
});

module.exports.container = router;

const { Router } = require('express');
const { database } = require('../db/db.connection');

const router = Router();

//Get all available units
router.get('/all', (req, res) => {
	return database('unit')
		.select('*')
		.then((units) => {
			return res.json(units);
		});
});

//Get unit from id
router.get('/:unitId', (req, res) => {
	const id = req.params.unitId;
	return database('unit')
		.select('*')
		.where({ id: id })
		.then((unit) => {
			res.json(unit[0]);
		})
		.catch(() => {
			res.send('Error fetching unit from the database');
		});
});

module.exports.unit = router;

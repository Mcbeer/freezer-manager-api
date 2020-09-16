exports.seed = function (knex) {
	console.log(knex);
	// Deletes ALL existing entries
	return knex('unit')
		.truncate()
		.then(function () {
			// Inserts seed entries
			return knex('unit').insert([
				{
					id: 1,
					name: 'kg',
				},
				{
					id: 2,
					name: 'g',
				},
				{
					id: 3,
					name: 'l',
				},
				{
					id: 4,
					name: 'dl',
				},
				{
					id: 5,
					name: 'ml',
				},
			]);
		});
};

exports.up = function (knex) {
	return knex.schema.table('container', (table) => {
		table.datetime('last_used').defaultTo(knex.fn.now(6));
	});
};

exports.down = function (knex) {
	return knex.schema.table('container', (table) => {
		table.dropColumn('last_used');
	});
};

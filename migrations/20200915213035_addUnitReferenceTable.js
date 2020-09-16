exports.up = function (knex) {
	return Promise.all([
		knex.schema.alterTable('product', (table) => {
			table.dropColumn('unit');
		}),
		knex.schema.createTable('unit', (table) => {
			table.increments('id').primary();
			table.string('name', 255).notNullable();
		}),
		knex.schema.alterTable('product', (table) => {
			table.integer('unit_id').references('id').inTable('unit');
		}),
	]);
};

exports.down = function (knex) {
	return Promie.all([
		knex.schema.alterTable('product', (table) => {
			table
				.enu('unit', ['kg', 'g', 'l', 'dl', 'ml'])
				.notNullable()
				.defaultTo('g');
		}),
		knex.schema.alterTable('product', (table) => {
			table.dropColumn('unit_id');
		}),
		knex.schema.dropTableIfExists('unit'),
	]);
};

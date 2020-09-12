
exports.up = function(knex) {
  return Promise.all([
      //container table
      knex.schema.createTable('container', (table) => {
          table.increments("id").primary();
          table.string('name', 50).notNullable();
          table.text('description');
          
          table.datetime('created_at').defaultTo(knex.fn.now(6));
          table.datetime('updated_at');
      }),   

      //product table
      knex.schema.createTable('product', (table) => {
          table.increments("id").primary();
          table.integer('container_id').references('id').inTable('container');      
          table.string('name', 100).notNullable();
          table.float('amount').notNullable();
          table.enu('unit', ['kg', 'g', 'l', 'dl','ml']).notNullable();
          table.datetime('expiration_date');
          
          table.datetime('created_at').defaultTo(knex.fn.now(6));
          table.datetime('updated_at');
      })
  ]);
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('product')
        .dropTableIfExists('container');
};

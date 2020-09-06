const config = require('../../knexfile.js');

const database = require('knex')(config);

module.exports.database = database;

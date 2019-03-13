const pkg = require('../../package.json'); // For db name

const Sequelize = require('sequelize');

const dbName = pkg.name;

const dbOptions = process.env.DATABASE_OPTIONS || {
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  database: dbName,
};
dbOptions.logging = false;

const db = new Sequelize(dbOptions);

module.exports = db;

// This is a global Mocha hook used for resource cleanup.
// Otherwise, Mocha v4+ does not exit after tests.
if (process.env.NODE_ENV === 'test') {
  after('close database connection', () => db.close());
}

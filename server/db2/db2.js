const Sequelize = require('sequelize')

const databaseName = 'tutorial-sql'

//Might have to change something here for heroku
const db2 = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/${databaseName}`,
  {
    logging: false
  }
)
console.log('Seeding database: ', databaseName)
module.exports = db2

if (process.env.NODE_ENV === 'test') {
  after('close database connection', () => db2.close())
}

// const pkg = require('../../package.json'); // For db name

// const Sequelize = require('sequelize');

// const dbName = pkg.name;

// const dbOptions = process.env.DATABASE_OPTIONS || {
//   dialect: 'postgres',
//   host: 'localhost',
//   port: 5432,
//   database: dbName,
// };
// dbOptions.logging = false;

// const db = new Sequelize(dbOptions);

// module.exports = db;

// // This is a global Mocha hook used for resource cleanup.
// // Otherwise, Mocha v4+ does not exit after tests.
// if (process.env.NODE_ENV === 'test') {
//   after('close database connection', () => db.close());
// }

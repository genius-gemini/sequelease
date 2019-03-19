const Sequelize = require('sequelize');
const db2 = require('../db2');

const Ratings = db2.define('rating', {
    year: {
        type: Sequelize.INTEGER
    },
    rating: {
        type: Sequelize.DECIMAL
    }
})

module.exports = Ratings;


// foreignKeys: [{ columnName: 'employeeId', targetTable: 'employees' }],


// const ratings = {
//     name: 'ratings',
//     fields: [
//       {
//         name: 'id',
//         type: 'INTEGER',
//         default: "'history_seq_id'",
//         constraint: 'PRIMARY KEY',
//         nullable: false,
//       },
//       {
//         name: 'employeeId',
//         type: 'INTEGER',
//         default: null,
//         constraint: 'FOREIGN KEY',
//         nullable: false,
//       },
//       {
//         name: 'year',
//         type: 'INTEGER',
//         default: null,
//         constraint: null,
//         nullable: false,
//       },
//       {
//         name: 'rating',
//         type: 'DECIMAL(18,1)',
//         default: null,
//         constraint: null,
//         nullable: false,
//       },
//     ],
//     foreignKeys: [{ columnName: 'employeeId', targetTable: 'employees' }],
//   }

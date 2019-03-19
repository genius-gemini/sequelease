const Sequelize = require('sequelize');
const db2 = require('../db2');

const TimeOff = db2.define('timeoff', {
    startDate: {
        type: Sequelize.DATE,
        default: null
    },
    endDate: {
        type: Sequelize.DATE,
        default: null
    }
})

module.exports = TimeOff;


// foreignKeys: [{ columnName: 'employeeId', targetTable: 'employees' }],

// const timeOff = {
//     name: 'timeOff',
//     fields: [
//       {
//         name: 'id',
//         type: 'INTEGER',
//         default: "'timeOff_id_seq'",
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
//         name: 'startDate',
//         type: 'DATETIME',
//         default: null,
//         constraint: null,
//         nullable: false,
//       },
//       {
//         name: 'endDate',
//         type: 'DATETIME',
//         default: null,
//         constraint: null,
//         nullable: false,
//       },
//     ],
//     foreignKeys: [{ columnName: 'employeeId', targetTable: 'employees' }],
//   }
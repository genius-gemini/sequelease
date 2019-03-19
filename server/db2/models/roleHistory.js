const Sequelize = require('sequelize');
const db2 = require('../db2');
 
// NEED TO ADD ASSOCIATIONS
const RoleHistory = db2.define('roleHistory', {
    employeeId: {
        type: Sequelize.INTEGER
    },
    roleId: {
        type: Sequelize.INTEGER
    },
    departmentId: {
        type: Sequelize.INTEGER
    },
    startDate: {
        type: Sequelize.DATE,
        default: null
    },
    endDate: {
        type: Sequelize.DATE,
        default: null
    }
})

module.exports = RoleHistory;

// foreignKeys: [
//     { columnName: 'roleId', targetTable: 'roles' },
//     { columnName: 'departmentId', targetTable: 'departments' },
//     { columnName: 'employeeId', targetTable: 'employees' },
//   ],

// const rolesHistory = {
//     name: 'rolesHistory',
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
//         name: 'roleId',
//         type: 'INTEGER',
//         default: null,
//         constraint: 'FOREIGN KEY',
//         nullable: false,
//       },
//       {
//         name: 'departmentId',
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
//         nullable: true,
//       },
//     ],
//     foreignKeys: [
//       { columnName: 'roleId', targetTable: 'roles' },
//       { columnName: 'departmentId', targetTable: 'departments' },
//       { columnName: 'employeeId', targetTable: 'employees' },
//     ],
//   }
const Sequelize = require('sequelize');
const db2 = require('../db2');

const Employee = db2.define('employee', {
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    },
    gender: {
        type: Sequelize.ENUM('M', 'F', 'O')
    },
    birthDate: {
        type: Sequelize.DATE,
        default: null
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

module.exports = Employee;

// const employees = {
//     name: 'employees',
//     fields: [
//       {
//         name: 'id',
//         type: 'INTEGER',
//         default: "'employee_id_seq'",
//         constraint: 'PRIMARY KEY',
//         nullable: false,
//       },
//       {
//         name: 'firstName',
//         type: 'VARCHAR(100)',
//         default: null,
//         constraint: null,
//         nullable: false,
//       },
//       {
//         name: 'lastName',
//         type: 'VARCHAR(100)',
//         default: null,
//         constraint: null,
//         nullable: false,
//       },
//       {
//         name: 'gender',
//         type: "ENUM['M','F','O']",
//         default: null,
//         constraint: null,
//         nullable: false,
//       },

//       {
//         name: 'birthDate',
//         type: 'DATETIME',
//         default: null,
//         constraint: null,
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
//         name: 'managerId',
//         type: 'INTEGER',
//         default: null,
//         constraint: 'FOREIGN KEY',
//       },
//     ],
//     foreignKeys: [
//       { columnName: 'roleId', targetTable: 'roles' },
//       { columnName: 'departmentId', targetTable: 'departments' },
//       { columnName: 'managerId', targetTable: 'employees' },
//     ],
//   }
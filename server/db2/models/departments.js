const Sequelize = require('sequelize');
const db2 = require('../db2');

const Departments = db2.define('departments', {
    name: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.TEXT
    }
})

module.exports = Departments;


// const departments = {
//     name: 'departments',
//     fields: [
//       {
//         name: 'id',
//         type: 'INTEGER',
//         default: "'department_id_seq'",
//         constraint: 'PRIMARY KEY',
//         nullable: false,
//       },
//       {
//         name: 'name',
//         type: 'VARCHAR(100)',
//         default: null,
//         constraint: null,
//         nullable: false,
//       },
//       {
//         name: 'description',
//         type: 'VARCHAR(100)',
//         default: null,
//         constraint: null,
//         nullable: true,
//       },
//     ],
//     foreignKeys: [],
//   }
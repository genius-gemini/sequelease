const Sequelize = require('sequelize');
const db2 = require('../db2');

const Roles = db2.define('roles', {
    title: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    }
})

module.exports = Roles;


// foreignKeys: [{ columnName: 'departmentId', targetTable: 'departments' }],

// const roles = {
//     name: 'roles',
//     fields: [
//       {
//         name: 'id',
//         type: 'INTEGER',
//         default: "'role_id_seq'",
//         constraint: 'PRIMARY KEY',
//         nullable: false,
//       },
//       {
//         name: 'title',
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
//       {
//         name: 'departmentId',
//         type: 'INTEGER',
//         default: null,
//         constraint: 'FOREIGN KEY',
//         nullable: false,
//       },
//     ],
//     foreignKeys: [{ columnName: 'departmentId', targetTable: 'departments' }],
//   }
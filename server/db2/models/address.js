const Sequelize = require('sequelize');
const db2 = require('../db2');

const Address = db2.define('address', {
    sequence: {
        type: Sequelize.INTEGER
    },
    streetAddress1: {
        type: Sequelize.STRING
    },
    streetAddress2: {
        type: Sequelize.STRING
    },
    apartmentNo: {
        type: Sequelize.STRING
    },
    city: {
        type: Sequelize.STRING
    },
    state: {
        type: Sequelize.STRING
    },
    postalCode: {
        type: Sequelize.STRING
    },
    isoCountryCode: {
        type: Sequelize.STRING,
        default: 'US'
    }
})

module.exports = Address;


// foreignKeys: [{ columnName: 'employeeId', targetTable: 'employees' }]


// const address = {
//     name: 'address',
//     fields: [
//       {
//         name: 'id',
//         type: 'INTEGER',
//         default: "'address_id_seq'",
//         constraint: 'PRIMARY KEY',
//         nullable: false,
//       },
//       {
//         name: 'employeeId',
//         type: 'INTEGER',
//         default: null,
//         constraint: null,
//         nullable: false,
//       },
//       {
//         name: 'sequence',
//         type: 'INTEGER',
//         default: null,
//         constraint: null,
//         nullable: false,
//       },
//       {
//         name: 'streetAddress1',
//         type: 'VARCHAR(100)',
//         default: null,
//         constraint: null,
//         nullable: false,
//       },
//       {
//         name: 'streetAddress2',
//         type: 'VARCHAR(100)',
//         default: null,
//         constraint: null,
//         nullable: true,
//       },
//       {
//         name: 'apartmentNo',
//         type: 'VARCHAR(10)',
//         default: null,
//         constraint: null,
//         nullable: true,
//       },
//       {
//         name: 'city',
//         type: 'VARCHAR(100)',
//         default: null,
//         constraint: null,
//         nullable: false,
//       },
//       {
//         name: 'state',
//         type: 'CHAR(2)',
//         default: null,
//         constraint: null,
//         nullable: false,
//       },
//       {
//         name: 'postalCode',
//         type: 'CHAR(5)',
//         default: null,
//         constraint: null,
//         nullable: true,
//       },
//       {
//         name: 'isoCountryCode',
//         type: 'CHAR(2)',
//         default: 'US',
//         constraint: null,
//         nullable: false,
//       },
//     ],
//     foreignKeys: [{ columnName: 'employeeId', targetTable: 'employees' }],
//   }
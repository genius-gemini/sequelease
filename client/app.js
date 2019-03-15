import React, { Component } from 'react';
import ConsoleTable from './components/ConsoleTable';
import Navbar from './components/navBar';
import StepSQL from './components/stepSQL';
import Routes from './routes';
import FromDetail from './components/FromDetail';
import SelectDetail from './components/SelectDetail';

const hrDb = {
  tables: [
    {
      name: 'employees',
      fields: [
        {
          name: 'id',
          type: 'INTEGER',
          default: "'employee_id_seq'",
          constraint: 'PRIMARY KEY',
          nullable: false,
        },
        {
          name: 'firstName',
          type: 'VARCHAR(100)',
          default: null,
          constraint: null,
          nullable: false,
        },
        {
          name: 'lastName',
          type: 'VARCHAR(100)',
          default: null,
          constraint: null,
          nullable: false,
        },
        {
          name: 'gender',
          type: "ENUM['M','F','O']",
          default: null,
          constraint: null,
          nullable: false,
        },

        {
          name: 'birthDate',
          type: 'DATETIME',
          default: null,
          constraint: null,
          nullable: false,
        },
        {
          name: 'startDate',
          type: 'DATETIME',
          default: null,
          constraint: null,
          nullable: false,
        },
        {
          name: 'endDate',
          type: 'DATETIME',
          default: null,
          constraint: null,
          nullable: true,
        },
        {
          name: 'roleId',
          type: 'INTEGER',
          default: null,
          constraint: 'FOREIGN KEY',
          nullable: false,
        },
        {
          name: 'departmentId',
          type: 'INTEGER',
          default: null,
          constraint: 'FOREIGN KEY',
          nullable: false,
        },
        {
          name: 'managerId',
          type: 'INTEGER',
          default: null,
          constraint: 'FOREIGN KEY',
        },
      ],
      foreignKeys: [
        { columnName: 'roleId', targetTable: 'roles' },
        { columnName: 'departmentId', targetTable: 'departments' },
        { columnName: 'managerId', targetTable: 'employees' },
      ],
    },
    {
      name: 'address',
      fields: [
        {
          name: 'id',
          type: 'INTEGER',
          default: "'address_id_seq'",
          constraint: 'PRIMARY KEY',
          nullable: false,
        },
        {
          name: 'employeeId',
          type: 'INTEGER',
          default: null,
          constraint: null,
          nullable: false,
        },
        {
          name: 'sequence',
          type: 'INTEGER',
          default: null,
          constraint: null,
          nullable: false,
        },
        {
          name: 'streetAddress1',
          type: 'VARCHAR(100)',
          default: null,
          constraint: null,
          nullable: false,
        },
        {
          name: 'streetAddress2',
          type: 'VARCHAR(100)',
          default: null,
          constraint: null,
          nullable: true,
        },
        {
          name: 'apartmentNo',
          type: 'VARCHAR(10)',
          default: null,
          constraint: null,
          nullable: true,
        },
        {
          name: 'city',
          type: 'VARCHAR(100)',
          default: null,
          constraint: null,
          nullable: false,
        },
        {
          name: 'state',
          type: 'CHAR(2)',
          default: null,
          constraint: null,
          nullable: false,
        },
        {
          name: 'postalCode',
          type: 'CHAR(5)',
          default: null,
          constraint: null,
          nullable: true,
        },
        {
          name: 'isoCountryCode',
          type: 'CHAR(2)',
          default: 'US',
          constraint: null,
          nullable: false,
        },
      ],
      foreignKeys: [{ columnName: 'employeeId', targetTable: 'employees' }],
    },
    {
      name: 'departments',
      fields: [
        {
          name: 'id',
          type: 'INTEGER',
          default: "'department_id_seq'",
          constraint: 'PRIMARY KEY',
          nullable: false,
        },
        {
          name: 'name',
          type: 'VARCHAR(100)',
          default: null,
          constraint: null,
          nullable: false,
        },
        {
          name: 'description',
          type: 'VARCHAR(100)',
          default: null,
          constraint: null,
          nullable: true,
        },
      ],
      foreignKeys: [],
    },
    {
      name: 'timeOff',
      fields: [
        {
          name: 'id',
          type: 'INTEGER',
          default: "'timeOff_id_seq'",
          constraint: 'PRIMARY KEY',
          nullable: false,
        },
        {
          name: 'employeeId',
          type: 'INTEGER',
          default: null,
          constraint: 'FOREIGN KEY',
          nullable: false,
        },
        {
          name: 'startDate',
          type: 'DATETIME',
          default: null,
          constraint: null,
          nullable: false,
        },
        {
          name: 'endDate',
          type: 'DATETIME',
          default: null,
          constraint: null,
          nullable: false,
        },
      ],
      foreignKeys: [{ columnName: 'employeeId', targetTable: 'employees' }],
    },
    {
      name: 'roles',
      fields: [
        {
          name: 'id',
          type: 'INTEGER',
          default: "'role_id_seq'",
          constraint: 'PRIMARY KEY',
          nullable: false,
        },
        {
          name: 'title',
          type: 'VARCHAR(100)',
          default: null,
          constraint: null,
          nullable: false,
        },
        {
          name: 'description',
          type: 'VARCHAR(100)',
          default: null,
          constraint: null,
          nullable: true,
        },
        {
          name: 'departmentId',
          type: 'INTEGER',
          default: null,
          constraint: 'FOREIGN KEY',
          nullable: false,
        },
      ],
      foreignKeys: [{ columnName: 'departmentId', targetTable: 'departments' }],
    },
    {
      name: 'rolesHistory',
      fields: [
        {
          name: 'id',
          type: 'INTEGER',
          default: "'history_seq_id'",
          constraint: 'PRIMARY KEY',
          nullable: false,
        },
        {
          name: 'employeeId',
          type: 'INTEGER',
          default: null,
          constraint: 'FOREIGN KEY',
          nullable: false,
        },
        {
          name: 'roleId',
          type: 'INTEGER',
          default: null,
          constraint: 'FOREIGN KEY',
          nullable: false,
        },
        {
          name: 'departmentId',
          type: 'INTEGER',
          default: null,
          constraint: 'FOREIGN KEY',
          nullable: false,
        },
        {
          name: 'startDate',
          type: 'DATETIME',
          default: null,
          constraint: null,
          nullable: false,
        },
        {
          name: 'endDate',
          type: 'DATETIME',
          default: null,
          constraint: null,
          nullable: true,
        },
      ],
      foreignKeys: [
        { columnName: 'roleId', targetTable: 'roles' },
        { columnName: 'departmentId', targetTable: 'departments' },
        { columnName: 'employeeId', targetTable: 'employees' },
      ],
    },
    {
      name: 'ratings',
      fields: [
        {
          name: 'id',
          type: 'INTEGER',
          default: "'history_seq_id'",
          constraint: 'PRIMARY KEY',
          nullable: false,
        },
        {
          name: 'employeeId',
          type: 'INTEGER',
          default: null,
          constraint: 'FOREIGN KEY',
          nullable: false,
        },
        {
          name: 'year',
          type: 'INTEGER',
          default: null,
          constraint: null,
          nullable: false,
        },
        {
          name: 'rating',
          type: 'DECIMAL(18,1)',
          default: null,
          constraint: null,
          nullable: false,
        },
      ],
      foreignKeys: [{ columnName: 'employeeId', targetTable: 'employees' }],
    },
  ],
};

const selectFieldDefault = {
  text: '',
  tables: [],
};

const fromJoinDefault = {
  joinCondition: 'INNER JOIN',
  table: {},
  tableText: '',
  sourceJoinColumn: '',
  targetJoinColumns: [],
  targetJoinColumn: '',
};

const query = {
  select: {
    tables: [],
    selectedColumns: [''],
  },
  where: {},
  from: {
    tablesToSelect: hrDb.tables.map(table => table.name),
    selectedTables: [
      {
        joinCondition: null,
        table: {},
        tableText: '',
        sourceJoinColumn: '',
        targetJoinColumns: [],
        targetJoinColumn: '',
      },
    ],
  },
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { query };
  }

  updateQueryState = () => {
    this.setState({ query });
  };

  render() {
    return (
      <div>
        <div>
          <Navbar />
          <Routes />
          <StepSQL />
          <FromDetail
            hrDb={hrDb}
            query={query}
            queryState={this.state.query}
            fromJoinDefault={fromJoinDefault}
            updateQueryState={this.updateQueryState}
          />
          <SelectDetail
            query={query}
            updateQueryState={this.updateQueryState}
            queryState={this.state.query}
            selectFieldDefault={selectFieldDefault}
          />
        </div>
        <div id="consoleBox">
          <ConsoleTable />
        </div>
      </div>
    );
  }
}

export default App;

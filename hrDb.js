const HRDb = {
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

// employees -> addresses: 1 -> M
// employees -> rolesHistory: 1 -> M
// employees -> departments: 1 -> M
// employees -> addresses: 1 -> M
// employees -> timeOff: 1 -> M
// employees -> ratings: 1 -> M

// employees (managerId) -> employees: 1 -> M

// roles -> employees: 1 -> M
// departments -> roles: 1 -> M

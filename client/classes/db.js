const axios = require('axios');

class Field {
  constructor(name, type, defaultValue, constraint, fkTargetTables, nullable) {
    this.name = name;
    this.type = type;
    this.default = defaultValue;
    this.constraint = constraint;
    this.fkTargetTables = fkTargetTables;
    this.nullable = nullable;
  }
}

class Table {
  constructor(name, fields) {
    this.name = name;
    this.fields = fields;
  }

  toString() {
    return this.name;
  }
}

export default class Db {
  constructor(tables) {
    this.tables = tables;
  }

  getTableNames = () => {
    return this.tables.map(table => table.toString());
  };

  isTableInDb = tableName => {
    return this.getTableNames().includes(tableName);
  };

  getTable = tableName => {
    return this.tables.find(table => table.toString() === tableName);
  };

  static async build(host, user, password, port, database) {
    const res = await axios.post('/api/queries/getDbMetadata', {
      host,
      user,
      password,
      port,
      database,
    });
    const db = res.data;

    const tables = db.tables.map(table => {
      const fields = table.fields.map(
        field =>
          new Field(
            field.name,
            field.type,
            field.default,
            field.constraint,
            field.fkTargetTables,
            field.nullable
          )
      );
      return new Table(table.name, fields);
    });

    return new Db(tables);
  }
}

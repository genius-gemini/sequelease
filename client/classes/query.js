// eslint-disable-next-line complexity
const modifySelectOrWhereColumn = (row, fullResults, alias, value) => {
  const tableAliasAndColumn = value.split('.');
  const tableAlias = alias || tableAliasAndColumn[0];
  const columnName = tableAliasAndColumn[1] || value;

  let validTable =
    alias || fullResults.tableAliasExistsInFullResults(tableAlias);

  let foundTable = null;
  let foundColumn = null;
  if (validTable) {
    foundTable = fullResults.getTableInFullResults(tableAlias);

    foundColumn = foundTable.getField(columnName);
    if (foundColumn) {
      row.name = tableAlias + '.' + columnName;
      row.type = foundColumn && foundColumn.type;
    }
  }
  if (!validTable || !foundColumn) {
    row.name = value;
    row.type = null;
  }
};

const handleSelectOrWhereDraggableDrop = (
  rows,
  sourceIndex,
  destinationIndex
) => {
  let sourceRow = rows.splice(sourceIndex, 1)[0];
  rows.splice(destinationIndex, 0, sourceRow);
};

class FromJoinRow {
  constructor() {
    this.joinType = FromJoinRow.templateJoinFromRow.joinType;
    this.tableMetadata = FromJoinRow.templateJoinFromRow.tableMetadata;
    this.tableAlias = FromJoinRow.TableAliases.shift();
    this.tableText = FromJoinRow.templateJoinFromRow.tableText;
    this.previousTablesJoinColumns = [];
    this.joinColumns = [
      {
        previousTableJoinColumn: {
          ...FromJoinRow.templateJoinFromRow.joinColumns[0]
            .previousTableJoinColumn,
        },
        rowTableJoinColumn: {
          ...FromJoinRow.templateJoinFromRow.joinColumns[0].rowTableJoinColumn,
        },
      },
    ];
  }

  hasTableMetadata = () => {
    return !!Object.keys(this.tableMetadata).length;
  };

  toSql = index => {
    const joinColumnString = this.joinColumns
      .filter(
        joinColumn =>
          joinColumn.rowTableJoinColumn.name.trim() &&
          joinColumn.previousTableJoinColumn.name.trim()
      )
      .map(joinColumn => {
        const [
          rowTableJoinAlias,
          rowTableJoinValue,
        ] = joinColumn.rowTableJoinColumn.name.trim().split('.');

        const [
          previousTableJoinAlias,
          previousTableJoinValue,
        ] = joinColumn.previousTableJoinColumn.name.trim().split('.');

        return `"${rowTableJoinAlias}"."${rowTableJoinValue}" = "${previousTableJoinAlias}"."${previousTableJoinValue}"`;
      })
      .join(' AND ');
    let fromRowString = index > 0 ? `${this.joinType} ` : '';
    fromRowString += `"${this.tableMetadata.name}" AS "${this.tableAlias}" `;
    fromRowString += (index > 0 ? 'ON ' : '') + joinColumnString;

    return fromRowString.trim();
  };
}

FromJoinRow.TableAliases = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
];

FromJoinRow.templateJoinFromRow = {
  joinType: null,
  tableMetadata: {},
  tableAlias: 'a',
  tableText: '',
  previousTablesJoinColumns: [],
  joinColumns: [
    {
      previousTableJoinColumn: { name: '', type: null },
      rowTableJoinColumn: { name: '', type: null },
    },
  ],
};

class From {
  constructor(db, fullResults) {
    this.fromJoinRows = [new FromJoinRow()];
    this.db = db;
    this.fullResults = fullResults;
  }

  addFromJoinRow = () => {
    this.fromJoinRows.push(new FromJoinRow());
  };

  rebuildSubsequentTablesPreviousTablesJoinColumns(startIndex, endIndex) {
    for (let i = startIndex; i <= endIndex; i++) {
      let nextTable = this.fromJoinRows[i];
      nextTable.previousTablesJoinColumns = [];
      for (let j = 0; j < i; j++) {
        let prevTable = this.fromJoinRows[j];
        if (Object.keys(prevTable.tableMetadata).length) {
          nextTable.previousTablesJoinColumns.push({
            tableMetadata: prevTable.tableMetadata,
            tableAlias: prevTable.tableAlias,
          });
        }
      }
    }
  }

  addToPreviousTablesJoinColumnsResults = (rowIndex, table) => {
    for (let nextFromJoinRow of this.fromJoinRows.slice(rowIndex + 1)) {
      nextFromJoinRow.previousTablesJoinColumns.push({
        tableMetadata: table,
        tableAlias: this.fromJoinRows[rowIndex].tableAlias,
      });
    }
  };

  rebuildPreviousTablesJoinColumnsResults(rowIndex) {
    this.fromJoinRows[rowIndex + 1].previousTablesJoinColumns = [];
    for (let prevTable of this.fromJoinRows.slice(0, rowIndex + 1)) {
      if (Object.keys(prevTable.tableMetadata).length) {
        this.fromJoinRows[rowIndex + 1].previousTablesJoinColumns.push({
          tableMetadata: prevTable.tableMetadata,
          tableAlias: prevTable.tableAlias,
        });
      }
    }
  }

  modifyFromRowTable = (rowIndex, tableName) => {
    // Change table text in search bar
    this.fromJoinRows[rowIndex].tableText = tableName;

    // See if table name text is actually a table
    let table = null;
    if (this.db.isTableInDb) {
      // Get table fields if in Db
      table = this.db.getTable(tableName);
    }

    if (table) {
      // Add table metadata
      this.fromJoinRows[rowIndex].tableMetadata = table;
      // Add new table to results of subsequent joined tables
      this.addToPreviousTablesJoinColumnsResults(rowIndex, table);

      this.fullResults.addResult(this.fromJoinRows[rowIndex]);
    } else {
      // Remove table from from clause
      this.fromJoinRows[rowIndex].tableMetadata = {};

      this.rebuildSubsequentTablesPreviousTablesJoinColumns(
        rowIndex,
        this.fromJoinRows.length - 1
      );

      this.fullResults.rebuildResults(this.fromJoinRows);
    }
  };

  modifyRowTableJoinColumn = (
    rowIndex,
    joinColumnIndex,
    alias,
    tableName,
    value
  ) => {
    const tableAliasAndColumn = value.split('.');
    const tableAlias = alias || tableAliasAndColumn[0];
    const columnName = tableAliasAndColumn[1] || value;

    let rowTable = this.fromJoinRows[rowIndex];

    let validRowTable =
      rowTable.tableAlias === tableAlias &&
      !!Object.keys(rowTable.tableMetadata).length;

    this.modifyColumn(
      rowIndex,
      joinColumnIndex,
      validRowTable,
      rowTable,
      tableAlias,
      columnName,
      value,
      'rowTableJoinColumn'
    );
  };

  modifyPreviousTableJoinColumn = (
    rowIndex,
    joinColumnIndex,
    alias,
    tableName,
    value
  ) => {
    const tableAliasAndColumn = value.split('.');
    const tableAlias = alias || tableAliasAndColumn[0];
    const columnName = tableAliasAndColumn[1] || value;

    let previousTableWithAlias = this.fromJoinRows
      .slice(0, rowIndex + 1)
      .find(previousTable => previousTable.tableAlias === tableAlias);

    this.modifyColumn(
      rowIndex,
      joinColumnIndex,
      !!previousTableWithAlias,
      previousTableWithAlias,
      tableAlias,
      columnName,
      value,
      'previousTableJoinColumn'
    );
  };

  modifyColumn = (
    rowIndex,
    joinColumnIndex,
    validTable,
    table,
    alias,
    column,
    value,
    joinColumnType
  ) => {
    let foundColumn = null;
    if (validTable) {
      foundColumn = table.tableMetadata.fields.find(field => {
        return field.name === column;
      });

      if (foundColumn) {
        this.fromJoinRows[rowIndex].joinColumns[joinColumnIndex][
          joinColumnType
        ] = {
          name: value,
          type: foundColumn ? foundColumn.type : null,
        } || { name: value, type: null };
      }
    }

    if (!validTable || !foundColumn) {
      this.fromJoinRows[rowIndex].joinColumns[joinColumnIndex][
        joinColumnType
      ] = {
        name: value,
        type: null,
      };
    }
  };

  handleAddJoinRowClick(rowIndex) {
    this.fromJoinRows.splice(rowIndex + 1, 0, new FromJoinRow());

    this.rebuildPreviousTablesJoinColumnsResults(rowIndex);
  }

  handleRemoveJoinRowClick(rowIndex) {
    this.fromJoinRows.splice(rowIndex, 1);

    this.rebuildSubsequentTablesPreviousTablesJoinColumns(rowIndex);
  }

  handleDraggableDrop(sourceIndex, destinationIndex, startIndex, endIndex) {
    let sourceRow = this.fromJoinRows.splice(sourceIndex, 1)[0];
    this.fromJoinRows.splice(destinationIndex, 0, sourceRow);

    this.rebuildSubsequentTablesPreviousTablesJoinColumns(startIndex, endIndex);
  }

  handleAddJoinConditionClick = rowIndex => {
    this.fromJoinRows[rowIndex].joinColumns.push({
      previousTableJoinColumn: {
        ...FromJoinRow.templateJoinFromRow.joinColumns[0]
          .previousTableJoinColumn,
      },
      rowTableJoinColumn: {
        ...FromJoinRow.templateJoinFromRow.joinColumns[0].rowTableJoinColumn,
      },
    });
  };

  handleRemoveJoinConditionClick = rowIndex => {
    this.fromJoinRows[rowIndex].joinColumns.pop();
  };

  handleJoinTypeClick = (rowIndex, joinType) => {
    this.fromJoinRows[rowIndex].joinType = joinType;
  };

  isEmpty = () => {
    return this.fromJoinRows.every(
      row => !row.tableMetadata.name || !row.tableMetadata.name.trim()
    );
  };

  toSql = () => {
    let fromString = this.isEmpty() ? '' : '\nFROM\n';
    fromString += this.fromJoinRows
      .filter(row => row.tableMetadata.name && row.tableMetadata.name.trim())
      .map((row, index) => '  ' + row.toSql(index))
      .join('\n');

    return fromString;
  };
}

class SelectRow {
  constructor() {
    this.name = SelectRow.templateSelectRow.name;
    this.type = SelectRow.templateSelectRow.type;
  }

  toSql() {
    const [tableAlias, fieldName] = this.name.split('.');
    return `"${tableAlias}"."${fieldName}"`;
  }
}

SelectRow.templateSelectRow = {
  name: '',
  type: null,
};

class Select {
  constructor(fullResults) {
    this.selectRows = [new SelectRow()];
    this.fullResults = fullResults;
  }

  addSelectRow(tableName, fields) {
    this.select.push(new SelectRow(tableName, fields));
  }

  handleAddClick = rowIndex => {
    this.selectRows.splice(
      rowIndex + 1,
      0,
      new SelectRow(
        SelectRow.templateSelectRow.name,
        SelectRow.templateSelectRow.type
      )
    );
  };

  handleRemoveClick = rowIndex => {
    this.selectRows.splice(rowIndex, 1);
  };

  // eslint-disable-next-line complexity
  modifySelectColumn = (rowIndex, alias, tableName, value) => {
    modifySelectOrWhereColumn(
      this.selectRows[rowIndex],
      this.fullResults,
      alias,
      value
    );
  };

  handleDraggableDrop(sourceIndex, destinationIndex, startIndex, endIndex) {
    handleSelectOrWhereDraggableDrop(
      this.selectRows,
      sourceIndex,
      destinationIndex
    );
  }

  isEmpty = () => {
    return this.selectRows.every(selectRow => !selectRow.name.trim());
  };

  toSql = () => {
    let queryString = 'SELECT\n';

    queryString += this.isEmpty()
      ? '  1'
      : '  ' +
        this.selectRows
          .filter(row => row.name.trim())
          .map(row => row.toSql())
          .join(', ');

    return queryString;
  };
}

class WhereRow {
  constructor() {
    this.name = WhereRow.templeteWhereRow.name;
    this.type = WhereRow.templeteWhereRow.type;
    this.selectedOperator = { ...WhereRow.templeteWhereRow.selectedOperator };
    this.operatorText = WhereRow.templeteWhereRow.operatorText;
    this.filter = WhereRow.templeteWhereRow.filter;
  }

  filterTypeQuotes() {
    if (this.type) {
      const fieldType = this.type.toLowerCase();
      return (
        fieldType.includes('char') ||
        fieldType.includes('date') ||
        fieldType.includes('time') ||
        fieldType === 'interval'
      );
    }
    return false;
  }

  toSql = () => {
    const [tableAlias, value] = this.name.trim().split('.');
    const filter = this.filterTypeQuotes() ? `'${this.filter}'` : this.filter;
    return `"${tableAlias}"."${value}" ${this.selectedOperator.name} ${filter}`;
  };
}

WhereRow.templeteWhereRow = {
  name: '',
  type: null,
  selectedOperator: { operator: '', hint: null },
  operatorText: '',
  filter: '',
};

class Where {
  constructor(fullResults) {
    this.whereRows = [new WhereRow()];
    this.fullResults = fullResults;
    this.operators = [
      { name: 'LIKE', hint: null },
      { name: 'IN', hint: 'Separate items by commas' },
      { name: '=', hint: null },
      { name: '<=', hint: null },
      { name: '<', hint: null },
      { name: '>=', hint: null },
      { name: '>', hint: null },
      { name: '<>', hint: null },
    ];
  }

  // eslint-disable-next-line complexity
  modifyWhereColumn = (rowIndex, alias, tableName, value) => {
    modifySelectOrWhereColumn(
      this.whereRows[rowIndex],
      this.fullResults,
      alias,
      value
    );
  };
  modifyOperator = (rowIndex, operator) => {
    // Find if operator exists
    const foundOp = this.operators.find(op => {
      return op.name === operator;
    });

    this.whereRows[rowIndex].selectedOperator = foundOp
      ? { ...foundOp }
      : { name: '', hint: null };
    this.whereRows[rowIndex].operatorText = operator;
  };

  handleAddClick = rowIndex => {
    this.whereRows.splice(
      rowIndex + 1,
      0,
      new WhereRow(
        WhereRow.templeteWhereRow.name,
        WhereRow.templeteWhereRow.type,
        { ...WhereRow.templeteWhereRow.selectedOperator },
        WhereRow.templeteWhereRow.operatorText,
        WhereRow.templeteWhereRow.filter
      )
    );
  };

  handleRemoveClick = rowIndex => {
    this.whereRows.splice(rowIndex, 1);
  };

  handleFilterChange(value, rowIndex) {
    this.whereRows[rowIndex].filter = value;
  }

  handleDraggableDrop(sourceIndex, destinationIndex, startIndex, endIndex) {
    handleSelectOrWhereDraggableDrop(
      this.whereRows,
      sourceIndex,
      destinationIndex
    );
  }

  isEmpty = () => {
    return this.whereRows.every(
      row =>
        !(row.name.trim() && row.selectedOperator.name && row.filter.trim())
    );
  };

  toSql = () => {
    let whereString = this.isEmpty() ? '' : '\nWHERE\n';

    whereString +=
      '  ' +
      this.whereRows
        .filter(
          row =>
            row.name.trim() &&
            row.selectedOperator.name &&
            row.selectedOperator.name.trim() &&
            row.filter.trim()
        )
        .map(row => {
          return row.toSql();
        })
        .join('\n  AND ');
    return whereString;
  };
}

class FullResultsRow {
  constructor(tableMetadata, alias) {
    this.tableMetadata = tableMetadata
      ? { ...tableMetadata }
      : { ...FullResultsRow.template.tableMetadata };
    this.tableAlias = alias || FullResultsRow.tableAlias;
  }

  getField(fieldName) {
    return this.tableMetadata.fields.find(field => field.name === fieldName);
  }
}

FullResultsRow.template = {
  tableMetadata: {},
  tableAlias: null,
};

class FullResults {
  constructor() {
    this.results = [];
  }

  addResult = fromJoinRow => {
    if (fromJoinRow.hasTableMetadata()) {
      this.results.push(
        new FullResultsRow(fromJoinRow.tableMetadata, fromJoinRow.tableAlias)
      );
    }
  };

  rebuildResults = fromJoinRows => {
    this.results = fromJoinRows
      .filter(row => row.hasTableMetadata())
      .map(row => new FullResultsRow(row.tableMetadata, row.tableAlias));
  };

  tableAliasExistsInFullResults = alias => {
    return this.results.map(table => table.tableAlias).includes(alias);
  };

  getTableInFullResults = alias => {
    console.log(alias);
    return this.results.find(table => table.tableAlias === alias);
  };
}

export default class Query {
  constructor(from, select, where, fullResults) {
    this.select = select;
    this.from = from;
    this.where = where;
    this.fullResults = fullResults;
  }

  static build(db) {
    const fullResults = new FullResults();
    const select = new Select(fullResults);
    const where = new Where(fullResults);
    const from = new From(db, fullResults);
    return new Query(from, select, where, fullResults);
  }

  toSql = () => {
    return this.select.toSql() + this.from.toSql() + this.where.toSql();
  };
}

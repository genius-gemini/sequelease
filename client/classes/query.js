/* eslint-disable complexity */
/* eslint-disable max-statements */
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
  static templateJoinFromRow = {
    joinType: null,
    joinTypeText: null,
    joinTypeError: false,
    joinTypeInitial: false,
    tableMetadata: {},
    tableAlias: '',
    tableText: '',
    tableTextText: `Check out the schema reference to see which tables are available`,
    tableTextError: null,
    tableTextInitial: false,
    previousTablesJoinColumns: [],
    joinColumns: [
      {
        previousTableJoinColumn: {
          name: '',
          type: null,
          text: null,
          error: null,
          initial: false,
        },
        rowTableJoinColumn: {
          name: '',
          type: null,
          text: null,
          error: null,
          initial: false,
        },
      },
    ],
  };

  constructor(tableAlias) {
    this.joinType = FromJoinRow.templateJoinFromRow.joinType;
    this.joinTypeText = FromJoinRow.templateJoinFromRow.joinTypeText;
    this.joinTypeError = FromJoinRow.templateJoinFromRow.joinTypeError;
    this.joinTypeInitial = FromJoinRow.templateJoinFromRow.joinTypeInitial;
    this.tableMetadata = FromJoinRow.templateJoinFromRow.tableMetadata;
    this.tableAlias = tableAlias;
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

class From {
  constructor(db, fullResults, select, where) {
    this.db = db;
    this.fullResults = fullResults;
    this.select = select;
    this.where = where;
    this.tableAliases = [
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
    this.fromJoinRows = [];
    this.handleAddJoinRowClick(-1);
  }

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

  updateColumnTypes = rowIndex => {
    let firstTable = true;
    let updatedRow = null;
    for (let row of this.fromJoinRows.slice(rowIndex)) {
      for (let col of row.joinColumns) {
        if (firstTable) {
          updatedRow = row;
          const [tableAlias, columnText] = col.rowTableJoinColumn.name.split(
            '.'
          );
          const foundField =
            row.tableMetadata.fields &&
            row.tableMetadata.fields.find(field => field.name === columnText);

          if (foundField) {
            col.rowTableJoinColumn.type = foundField.type;
          } else {
            col.rowTableJoinColumn.type = null;
          }
        } else {
          const [
            tableAlias,
            columnText,
          ] = col.previousTableJoinColumn.name.split('.');
          const foundField =
            updatedRow.tableMetadata.fields &&
            updatedRow.tableMetadata.fields.find(
              field => field.name === columnText
            );
          if (tableAlias === updatedRow.tableAlias && foundField) {
            col.previousTableJoinColumn.type = foundField.type;
          } else if (tableAlias === updatedRow.tableAlias && !foundField) {
            col.previousTableJoinColumn.type = null;
          }
        }
      }
      firstTable = false;
    }
  };

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

    this.updateColumnTypes(rowIndex);

    this.select.updateColumnTypes(this.fromJoinRows[rowIndex]);

    this.where.updateColumnTypes(this.fromJoinRows[rowIndex]);

    this.buildGuidance();
    this.select.buildGuidance();
    this.where.buildGuidance();
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

    this.buildGuidance();
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

    this.buildGuidance();
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

      this.fromJoinRows[rowIndex].joinColumns[joinColumnIndex][
        joinColumnType
      ].name = value;
      this.fromJoinRows[rowIndex].joinColumns[joinColumnIndex][
        joinColumnType
      ].type = foundColumn ? foundColumn.type : null;
    }

    if (!validTable || !foundColumn) {
      this.fromJoinRows[rowIndex].joinColumns[joinColumnIndex][
        joinColumnType
      ].name = value;

      this.fromJoinRows[rowIndex].joinColumns[joinColumnIndex][
        joinColumnType
      ].type = null;
    }

    this.buildGuidance();
  };

  handleAddJoinRowClick(rowIndex) {
    const newTableAlias = this.tableAliases.shift();
    this.fromJoinRows.splice(rowIndex + 1, 0, new FromJoinRow(newTableAlias));

    this.rebuildPreviousTablesJoinColumnsResults(rowIndex);
  }

  handleRemoveJoinRowClick(rowIndex) {
    this.fromJoinRows.splice(rowIndex, 1);

    this.rebuildSubsequentTablesPreviousTablesJoinColumns(rowIndex);

    this.buildGuidance();
    this.select.buildGuidance();
    this.where.buildGuidance();
  }

  handleDraggableDrop(sourceIndex, destinationIndex, startIndex, endIndex) {
    let sourceRow = this.fromJoinRows.splice(sourceIndex, 1)[0];
    this.fromJoinRows.splice(destinationIndex, 0, sourceRow);

    this.rebuildSubsequentTablesPreviousTablesJoinColumns(startIndex, endIndex);
    this.buildGuidance();
    this.select.buildGuidance();
    this.where.buildGuidance();
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

    this.buildGuidance();
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

  buildGuidance() {
    // eslint-disable-next-line complexity
    this.fromJoinRows.forEach((row, rowIndex) => {
      // Join type
      if (!row.joinTypeInitial) {
        if (
          row.joinType &&
          !row.joinColumns.every(
            column =>
              column.rowTableJoinColumn.type &&
              column.previousTableJoinColumn.type
          )
        ) {
          row.joinTypeText = 'Not all join condition in this join are valid';
          row.joinTypeError = false;
        } else if (!row.joinType) {
          row.joinTypeText = 'Choose a join type';
          row.joinTypeError = true;
        }
      }
      if (!row.tableTextInitial) {
        if (row.tableText && !row.tableMetadata.name) {
          row.tableTextText = 'Table does not exist in database';
          row.tableTextError = true;
        } else if (!row.tableText) {
          row.tableTextText = 'Enter table';
          row.tableTextError = true;
        } else {
          row.tableTextText = '';
          row.tableTextError = false;
        }
      }

      const previousTablesTableFirst = row.previousTablesJoinColumns.map(
        previousTable =>
          `${previousTable.tableMetadata.name} (${previousTable.tableAlias})`
      );

      const previousTablesTableFirstText =
        previousTablesTableFirst.length === 1
          ? previousTablesTableFirst[0]
          : `${previousTablesTableFirst
              .slice(0, previousTablesTableFirst.length - 1)
              .join(', ')}${
              previousTablesTableFirst.length > 2 ? ',' : null
            } and ${
              previousTablesTableFirst[previousTablesTableFirst.length - 1]
            }`;

      const previousTablesAliasFirst = row.previousTablesJoinColumns.map(
        previousTable =>
          `${previousTable.tableAlias} (${previousTable.tableMetadata.name})
            `
      );

      const previousTablesAliasFirstText =
        previousTablesAliasFirst.length === 1
          ? previousTablesAliasFirst[0]
          : `${previousTablesAliasFirst
              .slice(0, previousTablesAliasFirst.length - 1)
              .join(', ')}${
              previousTablesAliasFirst.length > 2 ? ',' : null
            } and ${
              previousTablesAliasFirst[previousTablesAliasFirst.length - 1]
            }`;

      row.joinColumns.forEach((col, colIndex) => {
        // row table join column
        if (!col.rowTableJoinColumn.initial) {
          const [tableAlias, columnText] =
            col.rowTableJoinColumn.name &&
            col.rowTableJoinColumn.name.split('.');

          const matchingColumnAsAlias =
            row.tableMetadata.fields &&
            !!row.tableMetadata.fields.find(field => field.name === tableAlias);

          if (!row.tableMetadata.name) {
            col.rowTableJoinColumn.text = `Choose a valid table from the database for this row`;
            col.rowTableJoinColumn.error = false;
          } else if (
            col.rowTableJoinColumn.name &&
            !col.rowTableJoinColumn.type &&
            row.tableAlias !== tableAlias &&
            row.tableMetadata.fields &&
            matchingColumnAsAlias &&
            !columnText
          ) {
            col.rowTableJoinColumn.text = `No table alias in text. Format: ${
              row.tableAlias
            }.${col.rowTableJoinColumn.name}`;
            col.rowTableJoinColumn.error = true;
          } else if (
            col.rowTableJoinColumn.name &&
            !col.rowTableJoinColumn.type &&
            tableAlias !== row.tableAlias &&
            columnText
          ) {
            col.rowTableJoinColumn.text = `Invalid table alias for this row's table (${
              row.tableMetadata.name
            }). Use ${row.tableAlias}.`;
            col.rowTableJoinColumn.error = true;
          } else if (
            col.rowTableJoinColumn.name &&
            !col.rowTableJoinColumn.type &&
            tableAlias === row.tableAlias &&
            !columnText
          ) {
            col.rowTableJoinColumn.text = `Choose a column from this row's table (${
              row.tableMetadata.name
            }). Format: ${row.tableAlias}.[column] e.g. ${row.tableAlias}.id`;
            col.rowTableJoinColumn.error = true;
          } else if (
            col.rowTableJoinColumn.name &&
            tableAlias === row.tableAlias &&
            columnText &&
            !col.rowTableJoinColumn.type
          ) {
            col.rowTableJoinColumn.text = `Column not found in this row's table (${
              row.tableMetadata.name
            }). Check out the schema reference`;
            col.rowTableJoinColumn.error = true;
          } else {
            col.rowTableJoinColumn.text = '';
            col.rowTableJoinColumn.error = false;
          }
        }

        if (!col.previousTableJoinColumn.initial) {
          const [
            tableAlias,
            columnText,
          ] = col.previousTableJoinColumn.name.split('.');

          const previousTableAssociatedWithAlias = row.previousTablesJoinColumns.find(
            previousTable => previousTable.tableAlias === tableAlias
          );

          const validPreviousTablesAlias = !!previousTableAssociatedWithAlias;

          const previousTableAssociatedWithAliasText = validPreviousTablesAlias
            ? `${previousTableAssociatedWithAlias.tableMetadata.name} (${
                previousTableAssociatedWithAlias.tableAlias
              })`
            : '';

          if (!row.previousTablesJoinColumns.length) {
            col.previousTableJoinColumn.text = `No valid tables available above to join to. Choose some`;
            col.previousTableJoinColumn.error = false;
          } else if (
            col.previousTableJoinColumn.name &&
            !col.previousTableJoinColumn.type &&
            !validPreviousTablesAlias &&
            !columnText
          ) {
            col.previousTableJoinColumn.text = `Choose a column from a valid table above (${previousTablesTableFirstText}). Format: [table alias].[column] e.g. a.id`;
            col.previousTableJoinColumn.error = true;
          } else if (
            col.previousTableJoinColumn.name &&
            !col.previousTableJoinColumn.type &&
            !validPreviousTablesAlias &&
            columnText
          ) {
            col.previousTableJoinColumn.text = `Choose a valid table alias from the tables above (${previousTablesAliasFirstText})`;
            col.previousTableJoinColumn.error = true;
          } else if (
            col.previousTableJoinColumn.name &&
            !col.previousTableJoinColumn.type &&
            validPreviousTablesAlias &&
            !columnText
          ) {
            col.previousTableJoinColumn.text = `Choose a column from table ${previousTableAssociatedWithAliasText}`;
            col.previousTableJoinColumn.error = true;
          } else if (
            col.previousTableJoinColumn.name &&
            validPreviousTablesAlias &&
            columnText &&
            !col.previousTableJoinColumn.type
          ) {
            col.previousTableJoinColumn.text = `Column not found in table ${previousTableAssociatedWithAliasText}. Check out the schema reference`;
            col.previousTableJoinColumn.error = true;
          } else {
            col.previousTableJoinColumn.text = '';
            col.previousTableJoinColumn.error = false;
          }
        }
      });
    });
  }
}

class SelectRow {
  constructor() {
    this.name = SelectRow.templateSelectRow.name;
    this.type = SelectRow.templateSelectRow.type;
    this.error = SelectRow.templateSelectRow.error;
    this.text = SelectRow.templateSelectRow.text;
  }

  toSql() {
    const [tableAlias, fieldName] = this.name.split('.');
    return `"${tableAlias}"."${fieldName}"`;
  }
}

SelectRow.templateSelectRow = {
  name: '',
  type: null,
  error: false,
  text: '',
};

class Select {
  constructor(fullResults) {
    this.selectRows = [];
    this.handleAddClick(-1);
    this.fullResults = fullResults;
  }

  handleAddClick = rowIndex => {
    this.selectRows.splice(rowIndex + 1, 0, new SelectRow());
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

    this.buildGuidance();
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

  updateColumnTypes = updatedFromRow => {
    for (let row of this.selectRows) {
      const [tableAlias, columnText] = row.name.split('.');
      const foundField =
        updatedFromRow.tableMetadata.fields &&
        updatedFromRow.tableMetadata.fields.find(
          field => field.name === columnText
        );
      if (tableAlias === updatedFromRow.tableAlias && foundField) {
        row.type = foundField.type;
      } else if (tableAlias === updatedFromRow.tableAlias && !foundField) {
        row.type = null;
      }
    }
  };

  buildGuidance = () => {
    const fullTableListWithAliasAliasFirstText = this.fullResults.listTablesAliasFirst();

    const fullTableListWithAliasTableFirstText = this.fullResults.listTablesTableFirst();

    this.selectRows.forEach(row => {
      const [tableAlias, columnText] = row.name.split('.');

      const tableAssociatedWithAlias = this.fullResults.results.find(
        table => table.tableAlias === tableAlias
      );

      const validTableAlias = !!tableAssociatedWithAlias;

      const tableAssociatedWithAliasText = validTableAlias
        ? tableAssociatedWithAlias.tableMetadata.name
        : '';

      if (!this.fullResults.results.length) {
        row.error = true;
        row.text = `No valid tables available above to select columns from. Choose some in FROM`;
      } else if (row.name && !row.type && !validTableAlias && !columnText) {
        row.text = `Choose a column from a valid table above (${fullTableListWithAliasTableFirstText}). Format: [table alias].[column] e.g. a.id`;
        row.error = true;
      } else if (row.name && !row.type && !validTableAlias && columnText) {
        row.text = `Choose a valid table alias from the tables above (${fullTableListWithAliasAliasFirstText})`;
        row.error = true;
      } else if (row.name && !row.type && validTableAlias && !columnText) {
        row.text = `Choose a column from table ${tableAssociatedWithAliasText}`;
        row.error = true;
      } else if (row.name && validTableAlias && columnText && !row.type) {
        row.text = `Column not found in table ${tableAssociatedWithAliasText}. Check out the schema reference`;
        row.error = true;
      } else {
        row.text = '';
        row.error = false;
      }
    });
  };
}

class WhereRow {
  static templeteWhereRow = {
    name: '',
    type: null,
    columnText: '',
    columnError: false,
    selectedOperator: { operator: '', hint: null },
    operatorText: '',
    operatorError: false,
    operatorTextText: '',
    filter: '',
    filterError: false,
    filterText: '',
  };

  constructor() {
    this.name = WhereRow.templeteWhereRow.name;
    this.type = WhereRow.templeteWhereRow.type;
    this.columnText = WhereRow.templeteWhereRow.columnText;
    this.columnError = WhereRow.templeteWhereRow.columnError;
    this.selectedOperator = { ...WhereRow.templeteWhereRow.selectedOperator };
    this.operatorText = WhereRow.templeteWhereRow.operatorText;
    this.operatorTextText = WhereRow.templeteWhereRow.operatorTextText;
    this.operatorError = WhereRow.templeteWhereRow.operatorError;
    this.filter = WhereRow.templeteWhereRow.filter;
    this.filterError = WhereRow.templeteWhereRow.filterError;
    this.filterText = WhereRow.templeteWhereRow.filterText;
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

class Where {
  constructor(fullResults) {
    this.whereRows = [];
    this.handleAddClick(-1);
    this.fullResults = fullResults;
    this.operators = [
      {
        name: 'LIKE',
        hint: `<a href='https://www.lifewire.com/pattern-matching-in-sql-server-queries-1019799'>LIKE operator</a>`,
      },
      { name: 'IN', hint: 'Separate items by commas. Format: one, two, three' },
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

    this.buildGuidance();
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

    this.buildGuidance();
  };

  handleAddClick = rowIndex => {
    this.whereRows.splice(rowIndex + 1, 0, new WhereRow());
  };

  handleRemoveClick = rowIndex => {
    this.whereRows.splice(rowIndex, 1);
  };

  handleFilterChange(value, rowIndex) {
    this.whereRows[rowIndex].filter = value;
    this.buildGuidance();
  }

  handleDraggableDrop(sourceIndex, destinationIndex, startIndex, endIndex) {
    handleSelectOrWhereDraggableDrop(
      this.whereRows,
      sourceIndex,
      destinationIndex
    );

    this.buildGuidance();
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

  updateColumnTypes = updatedFromRow => {
    for (let row of this.whereRows) {
      const [tableAlias, columnText] = row.name.split('.');
      const foundField =
        updatedFromRow.tableMetadata.fields &&
        updatedFromRow.tableMetadata.fields.find(
          field => field.name === columnText
        );
      if (tableAlias === updatedFromRow.tableAlias && foundField) {
        row.type = foundField.type;
      } else if (tableAlias === updatedFromRow.tableAlias && !foundField) {
        row.type = null;
      }
    }
  };

  buildGuidance = () => {
    const fullTableListWithAliasAliasFirstText = this.fullResults.listTablesAliasFirst();

    const fullTableListWithAliasTableFirstText = this.fullResults.listTablesTableFirst();

    this.whereRows.forEach(row => {
      const [tableAlias, columnText] = row.name.split('.');

      const tableAssociatedWithAlias = this.fullResults.results.find(
        table => table.tableAlias === tableAlias
      );

      const validTableAlias = !!tableAssociatedWithAlias;

      const tableAssociatedWithAliasText = validTableAlias
        ? tableAssociatedWithAlias.tableMetadata.name
        : '';

      if (!this.fullResults.results.length) {
        row.columnError = true;
        row.columnText = `No valid tables available above to select columns from. Choose some in FROM`;
      } else if (row.name && !row.type && !validTableAlias && !columnText) {
        row.columnText = `Choose a column from a valid table above (${fullTableListWithAliasTableFirstText}). Format: [table alias].[column] e.g. a.id`;
        row.columnError = true;
      } else if (row.name && !row.type && !validTableAlias && columnText) {
        row.columnText = `Choose a valid table alias from the tables above (${fullTableListWithAliasAliasFirstText})`;
        row.columnError = true;
      } else if (row.name && !row.type && validTableAlias && !columnText) {
        row.columnText = `Choose a column from table ${tableAssociatedWithAliasText}`;
        row.columnError = true;
      } else if (row.name && validTableAlias && columnText && !row.type) {
        row.columnText = `Column not found in table ${tableAssociatedWithAliasText}. Check out the schema reference`;
        row.columnError = true;
      } else {
        row.columnText = '';
        row.columnError = false;
      }

      if (row.columnError) {
        row.operatorTextText = 'Choose a valid operator first';
        row.operatorError = false;
      } else if (!row.operatorText) {
        row.operatorError = true;
        row.operatorTextText = 'Choose an operator for condition';
      } else if (!row.selectedOperator.name) {
        row.operatorError = true;
        row.operatorTextText =
          'Invalid operator (Note: Even if the operator exists in SQL, SQLease may not support it)';
      } else {
        row.operatorError = false;
        row.operatorTextText = '';
      }

      row.filterText = '';
      if (row.type && row.selectedOperator.name && !row.filter) {
        row.filterError = true;
        row.filterText += '<div>No input filter</div>';
      } else {
        row.filterError = false;
      }

      if (row.selectedOperator.hint) {
        row.filterText += `<div>${row.selectedOperator.hint}</div>`;
      }

      if (row.type) {
        row.filterText += `<div>Type: ${row.type}</div>`;
      } else {
        row.filterText += `<div>Choose a valid column first</div>`;
      }

      if (row.type && row.operatorError) {
        row.filterText += `<div>Choose a valid operator first</div>`;
      }
    });
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
    return this.results.find(table => table.tableAlias === alias);
  };

  listTablesTableFirst = () => {
    const tableList = this.results.map(
      table => `${table.tableMetadata.name} (${table.tableAlias})`
    );
    return this.listTables(tableList);
  };

  listTablesAliasFirst = () => {
    const tableList = this.results.map(
      table => `${table.tableAlias} (${table.tableMetadata.name} )`
    );
    return this.listTables(tableList);
  };

  listTables(tableList) {
    return tableList.length === 1
      ? tableList[0]
      : `${tableList.slice(0, tableList.length - 1).join(', ')}
      ${tableList.length > 2 ? ',' : null} and
      ${tableList[tableList.length - 1]}`;
  }
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
    const from = new From(db, fullResults, select, where);
    return new Query(from, select, where, fullResults);
  }

  toSql = () => {
    return this.select.toSql() + this.from.toSql() + this.where.toSql();
  };
}

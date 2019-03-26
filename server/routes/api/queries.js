const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const queries = require('../../db/queries');

module.exports = router;

const connectPool = (host, user, password, port, database) => {
  return new Pool({
    // host: 'ec2-54-221-201-212.compute-1.amazonaws.com',
    // database: 'dbpnauv6i7jjki',
    // user: 'rwbqgxjqwqrxuh',
    // password: process.env.TUTORIAL_DB_PASS,
    host: host || 'localhost',
    database: database || 'tutorial-sql',
    user: user || null,
    password: password || null,
    port: port || 5432,
  });
};

const formatTransformedDbObjectFields = (tAndCResultRow, fkMetadataFromDb) => {
  const foreignKeyTargetTables = fkMetadataFromDb.rows.filter(
    fkRow =>
      fkRow.table === tAndCResultRow.Table &&
      fkRow.column === tAndCResultRow.Field
  );

  const foreignKeyTargetTablesNames = foreignKeyTargetTables.map(
    row => row.target_table
  );

  return {
    name: tAndCResultRow.Field,
    type: tAndCResultRow.Type,
    default: tAndCResultRow.Default,
    constraint:
      tAndCResultRow.Constraint ||
      (foreignKeyTargetTables.length ? 'FOREIGN KEY' : null),
    fkTargetTables: foreignKeyTargetTablesNames,
    nullable: tAndCResultRow.Null === 'YES',
  };
};

const formatDbMetadataQueryResults = (
  tablesAndColumnsMetadataFromDb,
  fkMetadataFromDb
) => {
  const transformedResults = { tables: [] };

  tablesAndColumnsMetadataFromDb.rows.reduce(
    (transformedResultsObj, tAndCResultRow) => {
      const tableInObj = transformedResultsObj.tables.find(
        tableObj => tableObj.name === tAndCResultRow.Table
      );
      if (tableInObj) {
        tableInObj.fields.push(
          formatTransformedDbObjectFields(tAndCResultRow, fkMetadataFromDb)
        );
      } else {
        transformedResultsObj.tables.push({
          name: tAndCResultRow.Table,
          fields: [
            formatTransformedDbObjectFields(tAndCResultRow, fkMetadataFromDb),
          ],
        });
      }
      return transformedResultsObj;
    },
    transformedResults
  );
  return transformedResults;
};

router.post('/getDbMetadata', async (req, res, next) => {
  const { host, user, password, port, database } = req.body;

  const pool = connectPool(host, user, password, port, database);

  const tableAndColumnsDbQueryResults = await pool.query(
    queries.postgresDbTablesAndColumnsMetadata
  );

  const fkQueryResults = await pool.query(
    queries.postgresDbForeignKeysMetadata
  );

  await pool.end();

  const transformedResults = formatDbMetadataQueryResults(
    tableAndColumnsDbQueryResults,
    fkQueryResults
  );

  res.send(transformedResults);
});

// eslint-disable-next-line complexity
router.post('/run', async (req, res, next) => {
  const { query } = req.body;
  let select = 'SELECT ';

  let selectColumns = '';
  if (
    query.select.selectedColumns.length &&
    query.select.selectedColumns[0].name.trim()
  ) {
    selectColumns = query.select.selectedColumns
      .filter(column => column.name.trim())
      .map(column => {
        const [table, col] = column.name.split('.');
        return '"' + table + '"."' + col + '"';
      })
      .join(', ');
  }
  if (selectColumns) {
    select += '  ' + selectColumns;
  } else {
    select += '  1';
  }

  let from = ' FROM ';

  let fromClause = '';

  if (
    query.from.selectedTables.length &&
    query.from.selectedTables[0].tableText.trim()
  ) {
    fromClause = query.from.selectedTables
      .filter(table => table.table.name)
      .map((table, i) => {
        if (i === 0) {
          return table.table.name;
        } else {
          let ij = ' INNER JOIN ' + table.tableText;
          let [t, col] = table.sourceJoinColumn.name.split('.');
          let sjc = '"' + t + '"."' + col + '"';
          [t, col] = table.targetJoinColumn.name.split('.');
          let tjc = '"' + t + '"."' + col + '"';
          ij += sjc && tjc ? ' ON ' + sjc + ' = ' + tjc : '';
          return ij;
        }
      })
      .join('  ');
  }
  if (fromClause) {
    from += '  ' + fromClause;
  } else {
    from = '';
  }

  let where = ' WHERE ';
  let whereClause = '';
  if (
    query.where.selectedWhereColumns.length &&
    query.where.selectedWhereColumns[0].name.trim()
  ) {
    whereClause = query.where.selectedWhereColumns
      .filter(
        condition =>
          condition.type &&
          condition.selectedOperator.operator &&
          condition.filter
      )
      .map((condition, i) => {
        let initText = ' AND ';
        if (i === 0) {
          initText = '  ';
        }
        const [t, col] = condition.name.split('.');
        return (
          initText +
          '"' +
          t +
          '"."' +
          col +
          '"' +
          ' ' +
          condition.selectedOperator.operator +
          ' ' +
          condition.filter
        );
      })
      .join('  ');
  }

  if (whereClause) {
    where += whereClause;
  } else {
    where = '';
  }

  const pool = connectPool();
  const queryResults = await pool.query(select + from + where + ' LIMIT 10');

  await pool.end();

  res.send(queryResults);
});

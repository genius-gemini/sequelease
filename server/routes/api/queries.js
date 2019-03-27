const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const queries = require("../../db/queries");

module.exports = router;

const filterTypeQuotes = row => {
  if (row.type) {
    const fieldType = row.type.toLowerCase();
    return (
      fieldType.includes('char') ||
      fieldType.includes('date') ||
      fieldType.includes('time') ||
      fieldType === 'interval'
    );
  }
  return false;
};

const connectPool = (host, user, password, port, database) => {
  return new Pool({
    // host: 'ec2-54-221-201-212.compute-1.amazonaws.com',
    // database: 'dbpnauv6i7jjki',
    // user: 'rwbqgxjqwqrxuh',
    // password: process.env.TUTORIAL_DB_PASS,
    host: host || 'ec2-54-221-201-212.compute-1.amazonaws.com',
    database: database || 'dbpnauv6i7jjki',
    user: user || 'rwbqgxjqwqrxuh',
    password: password || process.env.TUTORIAL_DB_PASS,
    port: port || 5432,
  });
};

const formatTransformedDbObjectFields = (tAndCResultRow, fkMetadataFromDb) => {
  const foreignKeyTargetTables = fkMetadataFromDb.rows.filter(
    fkRow =>
      fkRow.table === tAndCResultRow.Table &&
      fkRow.column === tAndCResultRow.Field,
  );

  const foreignKeyTargetTablesNames = foreignKeyTargetTables.map(
    row => row.target_table,
  );

  return {
    name: tAndCResultRow.Field,
    type: tAndCResultRow.Type,
    default: tAndCResultRow.Default,
    constraint:
      tAndCResultRow.Constraint ||
      (foreignKeyTargetTables.length ? "FOREIGN KEY" : null),
    fkTargetTables: foreignKeyTargetTablesNames,
    nullable: tAndCResultRow.Null === "YES",
  };
};

const formatDbMetadataQueryResults = (
  tablesAndColumnsMetadataFromDb,
  fkMetadataFromDb,
) => {
  const transformedResults = { tables: [] };

  tablesAndColumnsMetadataFromDb.rows.reduce(
    (transformedResultsObj, tAndCResultRow) => {
      const tableInObj = transformedResultsObj.tables.find(
        tableObj => tableObj.name === tAndCResultRow.Table,
      );
      if (tableInObj) {
        tableInObj.fields.push(
          formatTransformedDbObjectFields(tAndCResultRow, fkMetadataFromDb),
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
    transformedResults,
  );
  return transformedResults;
};


router.post('/getDbMetadata', async (req, res, next) => {
  try {
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
  } catch (err) {
    res.status(500).send({ error: 'error' });
  }
});

// eslint-disable-next-line complexity
router.post('/run', async (req, res, next) => {
  const { query, host, user, password, port, database } = req.body;

  console.log(query);

  let selectString = 'SELECT ';

  selectString += !query.select.selectRows.length
    ? '  1'
    : '  ' +
      query.select.selectRows
        .filter(row => row.name.trim())
        .map(row => {
          const [tableAlias, fieldName] = row.name.split('.');
          return `"${tableAlias}"."${fieldName ? fieldName : ''}"`;
        })
        .join(', ');

  let fromString = !query.from.fromJoinRows.length ? '' : ' FROM ';

  fromString += query.from.fromJoinRows
    .filter(
      (row, i) =>
        (row.joinType || i === 0) &&
        row.tableMetadata.name &&
        row.tableMetadata.name.trim()
    )
    .map((row, index) => {
      const joinColumnString = row.joinColumns
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
      let fromRowString = index > 0 ? `${row.joinType} ` : '';
      fromRowString += `"${row.tableMetadata.name}" AS "${row.tableAlias}" `;
      fromRowString += (index > 0 ? 'ON ' : '') + joinColumnString;

      return '  ' + fromRowString.trim();
    })
    .join(' ');

  let whereString = !query.where.whereRows.filter(
    row =>
      row.name.trim() &&
      row.selectedOperator.name &&
      row.selectedOperator.name.trim() &&
      row.filter.trim()
  ).length
    ? ''
    : ' WHERE ';

  whereString +=
    '  ' +
    query.where.whereRows
      .filter(
        row =>
          row.name.trim() &&
          row.selectedOperator.name &&
          row.selectedOperator.name.trim() &&
          row.filter.trim()
      )
      .map(row => {
        const [tableAlias, value] = row.name.trim().split('.');
        const filter = filterTypeQuotes(row) ? `'${row.filter}'` : row.filter;
        return `"${tableAlias}"."${value}" ${
          row.selectedOperator.name
        } ${filter}`;
      })
      .join(' AND ');

  let queryString = selectString + fromString + whereString;

  console.log(queryString);

  const pool = connectPool(host, user, password, port, database);
  const queryResults = await pool.query(queryString + ' LIMIT 10');

  await pool.end();

  console.log(queryResults);
  res.send(queryResults);
});

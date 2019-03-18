const express = require('express');
const { Pool, Client } = require('pg');

const path = require('path');
const morgan = require('morgan');
const db = require('./db/db');
const { User } = require('./db/models');
const session = require('express-session');
const compression = require('compression');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sessionStore = new SequelizeStore({ db });
const passport = require('passport');
const app = express();
const PORT = process.env.PORT || 3001;
module.exports = app;

if (process.env.NODE_ENV !== 'production') require('../secrets');

if (process.env.NODE_ENV === 'test') {
  after('close the session store', () => sessionStore.stopExpiringSessions());
}

const connectPool = () => {
  return new Pool({
    host: 'localhost',
    database: 'stickr',
    port: 5432,
  });
};

const createApp = () => {
  // Static files directory (css, js, etc)
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // compression middleware
  app.use(compression());

  // express session
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'my best friend is Cody',
      resave: false,
      store: sessionStore,
      saveUninitialized: false,
    })
  );

  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  require('./passport'); // For serialize/deserialize

  // Logging
  app.use(morgan('dev'));

  app.get('/api/getDbMetaData', async (req, res, next) => {
    const pool = connectPool();

    const queryResults = await pool.query(
      `SELECT c.table_name as "Table", pk.constraint_type as "Constraint", c.column_name as "Field", c.column_default as "Default", c.is_nullable as "Null", (CASE WHEN c.udt_name = 'hstore' THEN c.udt_name ELSE c.data_type END) || (CASE WHEN c.character_maximum_length IS NOT NULL THEN '(' || c.character_maximum_length || ')' ELSE '' END) as "Type", (SELECT array_agg(e.enumlabel) FROM pg_catalog.pg_type t JOIN pg_catalog.pg_enum e ON t.oid=e.enumtypid WHERE t.typname=c.udt_name) AS "special" FROM information_schema.columns c LEFT JOIN (SELECT tc.table_schema, tc.table_name, cu.column_name, tc.constraint_type FROM information_schema.TABLE_CONSTRAINTS tc JOIN information_schema.KEY_COLUMN_USAGE  cu ON tc.table_schema=cu.table_schema and tc.table_name=cu.table_name and tc.constraint_name=cu.constraint_name and tc.constraint_type='PRIMARY KEY') pk ON pk.table_schema=c.table_schema AND pk.table_name=c.table_name AND pk.column_name=c.column_name WHERE c.table_schema = 'public'`
    );

    const fkQueryResults = await pool.query(
      `SELECT DISTINCT tc.constraint_name as constraint_name, tc.constraint_schema as constraint_schema, tc.constraint_catalog as constraint_catalog, tc.table_name as "table",tc.table_schema as table_schema,tc.table_catalog as table_catalog,kcu.column_name as "column",ccu.table_schema  AS referenced_table_schema,ccu.table_catalog  AS referenced_table_catalog,ccu.table_name  AS "target_table",ccu.column_name AS "target_column" FROM information_schema.table_constraints AS tc JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name WHERE constraint_type = 'FOREIGN KEY'`
    );

    await pool.end();

    const obj = { tables: [] };
    queryResults.rows.reduce((obj, row) => {
      if (obj.tables.find(t => t.name === row.Table)) {
        obj.tables
          .find(t => t.name === row.Table)
          .fields.push({
            name: row.Field,
            type: row.Type,
            default: row.Default,
            constraint:
              row.Constraint ||
              (fkQueryResults.rows.find(
                t => t.table === row.Table && t.column === row.Field
              )
                ? 'FOREIGN KEY'
                : null),
            nullable: row.Null === 'YES',
          });
      } else {
        obj.tables.push({
          name: row.Table,
          fields: [
            {
              name: row.Field,
              type: row.Type,
              default: row.Default,
              constraint:
                row.Constraint ||
                (fkQueryResults.rows.find(
                  t => t.table === row.Table && t.column === row.Field
                )
                  ? 'FOREIGN KEY'
                  : null),
              nullable: row.Null === 'YES',
            },
          ],
        });
      }
      return obj;
    }, obj);

    res.send(obj);
  });

  // eslint-disable-next-line complexity
  app.post('/api/query', async (req, res, next) => {
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

    console.log(select + from + where);
    const pool = connectPool();
    const queryResults = await pool.query(select + from + where + ' LIMIT 10');

    await pool.end();

    res.send(queryResults);
  });

  // Include routes
  app.use(require('./routes'));

  // Requests with an extension (.js, .css, etc.) send 404
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found');
      err.status = 404;
      next(err);
    } else {
      next();
    }
  });

  // Serve index.html by default
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);

    err.message = err.message || 'Internal Server Error';
    res.status = err.status || 500;
    res.send(err);
  });
};

const startListening = () => {
  // start listening (and create a 'server' object representing our server)
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

const syncDb = () => db.sync();

async function bootApp() {
  await sessionStore.sync();
  await syncDb();
  await createApp();
  await startListening();
}

// This evaluates as true when this file is run directly from the command line,
// i.e. when we say 'node server/index.js' (or 'nodemon server/index.js', or 'nodemon server', etc)
// It will evaluate false when this module is required by another module - for example,
// if we wanted to require our app in a test spec
if (require.main === module) {
  bootApp();
} else {
  createApp();
}

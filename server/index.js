const express = require('express');
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

const express = require('express');

const router = express.Router();

router.use(require('./local'));

router.get('/error', (req, res, next) => {
  const errorMessage = req.session.errorMessage;
  delete req.session.errorMessage;
  res.send(errorMessage);
});

//router.use('/google', require('./oauth/google'));

module.exports = router;

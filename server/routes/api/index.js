const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));
router.use('/queries', require('./queries'));

// api route 404
router.use(function(req, res, next) {
  const err = new Error('Not found.');
  err.status = 404;
  next(err);
});

module.exports = router;

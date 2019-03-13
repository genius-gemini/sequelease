const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('api response for get');
});

router.post('/', (req, res, next) => {
  res.send(`api response for post. Body: ${req.body}`);
});

router.get('/:id', (req, res, next) => {
  res.send(`api response for get id=${req.params.id}`);
});

router.put('/:id', (req, res, next) => {
  res.send(`api response for put id=${req.params.id}. Body: ${req.body}`);
});

router.delete('/:id', (req, res, next) => {
  res.send(`api response for delete id=${req.params.id}`);
});

// api route 404
router.use(function(req, res, next) {
  const err = new Error('Not found.');
  err.status = 404;
  next(err);
});

module.exports = router;

const User = require('../../db/models/user');
const express = require('express');
const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      setTimeout(
        () => res.status(401).send('Wrong username and/or password'),
        3000
      );
    } else if (await !user.correctPassword(req.body.password)) {
      res.status(401).send('Wrong username and/or password');
    } else {
      req.login(user, err => (err ? next(err) : res.json(user)));
    }
  } catch (err) {
    next(err);
  }
});

router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    req.login(user, err => (err ? next(err) : res.status(201).json(user)));
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(403).send('User already exists');
    } else {
      next(err);
    }
  }
});

router.delete('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.sendStatus(204);
});

router.get('/me', (req, res) => {
  res.json(req.user || {});
});

module.exports = router;

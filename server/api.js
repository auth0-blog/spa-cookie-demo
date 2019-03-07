const express = require('express');
const router = express.Router();
const debug = require('debug')('app:api');

router.get('/ping', (req, res, next) => {
  res.send({ msg: 'Hello, world' });
});

router.get('/user', (req, res, next) => {
  const user = req.openid ? req.openid.user : null;

  if (!user) {
    res.sendStatus(404);
    return;
  }

  debug(user);
  res.send(user);
});

module.exports = router;

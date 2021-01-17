const express = require('express');
const router = express.Router();
const { account } = require('../db/store');

router.get('/', function(req, res, next) {
  res.json({
    balance: account.formattedBalance()
  });
});

module.exports = router;
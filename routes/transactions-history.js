const express = require('express');
const router = express.Router();
const { account } = require('../db/store');
const Config = require('../db/Config');
const { debit, credit } = require('../db/strategies');
const locale = require('../locale');

router.get('/', function(req, res, next) {
  res.json(account.transactionsHistory);
});

router.post('/', function(req, res, next) {
  const { amount } = req.body;
  if (amount < 0) {
    res.status(400).json({error: locale.amountPositiveError});
    return;
  }
  const type = req.body.type.toLowerCase();

  if (type === "credit") {
    const newTransaction = account.addTransaction({
      amount,
      type
    });
    const creditConfig = new Config(credit);
    creditConfig.calculate(amount);
    res.status(201).json(newTransaction);
  
  } else if (type === "debit") {
    try {
      const newTransaction = account.addTransaction({
        amount,
        type
      });
      const debitConfig = new Config(debit);
      debitConfig.calculate(amount);
      res.status(201).json(newTransaction);
    } catch(e) {
      if (e.message === "Balance error") {
        res.status(400).json({error: locale.balanceError})
        return;
      }
      res.status(400).json({error: locale.unexpectedError})
    }


  } else {
    res.status(400).json({error: locale.transactionTypeError})
  }
});

router.get('/:id', function(req, res, next) {
  const { id } = req.params;
  if (!account.validateID(id)) {
    res.status(400).json({error: locale.invalidTransactionIdError});
    return;
  }
  try {
    res.json(account.getById(id));
  } catch(e) {
    res.status(400).json({error: locale.transactionNotFoundError})
  }
});


module.exports = router;

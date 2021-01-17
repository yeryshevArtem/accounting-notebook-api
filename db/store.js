const { v4: uuidv4, validate } = require('uuid');
const { DateTime } = require('luxon');
const Decimal = require('decimal.js');

const db = {
    account: {
        balance: new Decimal(0),
        transactionsHistory: [],
        getBalance() {
            return this.balance;
        },
        formattedBalance() {
            return this.getBalance().toNumber();
        },
        addTransaction(data) {
            const id = uuidv4();
            const dl = DateTime.local();
            const newTransaction = {
                id,
                type: data.type,
                amount: new Decimal(data.amount).toNumber(),
                effectiveDate: dl.toISO()
            };
            this.transactionsHistory.unshift(newTransaction);
            return newTransaction;
        },
        getById(id) {
            const found = this.transactionsHistory.filter(transactionItem => transactionItem.id === id);
            if (found[0]) {
                return found;
            }
            throw new Error('transaction not found');
        },
        validateID(id) {
            return validate(id);
        }
    }
};

module.exports = db;

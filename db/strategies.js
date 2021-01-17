const Decimal = require('decimal.js');
const { account } = require('./store');

module.exports.credit = {
    calculate(val) {
        return Decimal.add(account.balance, val);
    }
}; 

module.exports.debit = {
    calculate(val) {
        const result = Decimal.sub(account.balance, val);
        if (result.isNegative()) {
            throw new Error('Balance error');
        }
        return result;
    }
};
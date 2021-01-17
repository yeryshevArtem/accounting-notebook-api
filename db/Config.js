const { account } = require('./store');

function Config(strategy) {
    this.strategy = strategy;
}

Config.prototype.calculate = function(val) {
    account.balance = this.strategy.calculate(val);
};

module.exports = Config;
const MatchesAggregator = require('./matches_aggregator');
const SurebetCalculator = require('./surebet_calculator');

const config = require('../config.js');

class SurebetFinder {
  constructor(apiKey) {
    this.aggregator = new MatchesAggregator(apiKey);
    this.calculator = new SurebetCalculator();

    this.surebets = [];
    this.bets = [];
  }
  async run() {
    await this.aggregator.run();

    this.bets = this.aggregator.getBets();
    this.surebets = this.calculator.run(this.bets);
  }

  getSurebets() {
    return this.surebets;
  }
}

module.exports = SurebetFinder;

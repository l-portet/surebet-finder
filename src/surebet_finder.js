const MatchesAggregator = require('./matches_aggregator');
const SurebetCalculator = require('./surebet_calculator');
const fs = require('fs');

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
    console.log(JSON.stringify(this.bets, null, 2));
    this.surebets = this.calculator.run(this.bets);


    fs.writeFileSync(
      './output.json',
      JSON.stringify(this.surebets, null, 2),
      'utf-8'
    );
  }
}

module.exports = SurebetFinder;

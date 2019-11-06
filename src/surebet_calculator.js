class SurebetCalculator {
  constructor(bets, config) {
    if (bets) this.bets = bets;
    this.surebets = [];
    this.config = config;
  }

  extract(bets) {
    if (bets) this.bets = bets;
    if (!this.bets) throw 'No bets received.';

    this.findSurebets();
    this.calculateInvestment();

    return this.surebets;
  }

  findSurebets() {
    for (let bet of this.bets) {
      if (
        bet.odds.length <= 1 ||
        bet.info.type === 'homeaway' ||
        (bet.info.type === '1x2' && bet.odds.length <= 2)
      )
        continue;

      let sum = 0,
        profit = 0;

      for (let odd of bet.odds) {
        sum += 1 / odd.value;
      }

      if (sum < 1) {
        profit = (1 - sum) * this.config.earnings;
        this.surebets.push({ ...bet, rate: sum, profit });
      }
    }
    console.log(`Evaluating ${this.bets.length} bets`);
    console.log(`Found ${this.surebets.length} surebets`);
    this.surebets = this.surebets.sort((betA, betB) => betA.rate - betB.rate);
  }

  calculateInvestment() {
    for (let bet of this.surebets) {
      let investment = {};

      for (let odd of bet.odds) {
        investment[odd.name] = this.config.earnings * (1 / odd.value);
      }
      bet.investment = investment;
    }
  }
}

module.exports = SurebetCalculator;

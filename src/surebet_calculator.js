class SurebetCalculator {
  constructor(bets) {
    if (bets) this.bets = bets;
    this.surebets = [];
  }

  run(bets) {
    if (bets) this.bets = bets;
    if (!this.bets) throw 'No bets received.';

    return this.findSurebets();
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
        profit = (1 - sum) * 100;
        this.surebets.push({ ...bet, rate: sum, profit });
      }
    }
    console.log(`Evaluating ${this.bets.length} bets`);
    console.log(`Found ${this.surebets.length} surebets`);
    this.surebets = this.surebets.sort((betA, betB) => betA.rate - betB.rate);
    return this.surebets;
  }
}

module.exports = SurebetCalculator;

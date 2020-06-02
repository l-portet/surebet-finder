const axios = require('axios');

class MatchesAggregator {
  constructor(apiKey, config) {
    this.apiKey = apiKey;
    this.config = config;
    this.http = axios.create({
      baseURL: 'https://app.oddsapi.io/api/v1/',
      headers: {
        apikey: this.apiKey
      }
    });
    this.matches = [];
    this.bets = [];
  }

  async run() {
    let data;
    try {
      ({ data } = await this.http.get('odds'));
    } catch (e) {
      console.error('Error: Unable to call API');
      throw e;
    }

    this.cleanMatchesData(data);
    this.separateMatchesToBets();
  }

  cleanMatchesData(rawMatches) {
    for (let rawMatch of rawMatches) {
      let match = {};
      let bets = [];

      match.info = {
        sport: rawMatch.sport.name,
        league: rawMatch.league.name,
        teamA: rawMatch.event.home,
        teamB: rawMatch.event.away,
        startTime: rawMatch.event.start_time,
        lastUpdated: rawMatch.sites.last_updated
      };

      match.bets = [];

      delete rawMatch.sites.last_updated;
      bets = Object.entries(rawMatch.sites);

      for (let bet of bets) {
        match.bets.push(this.cleanBetsData(bet[0], bet[1]));
      }
      match.bets = match.bets.reduce((acc, val) => acc.concat(val), []);
      this.matches.push(match);
    }
  }

  cleanBetsData(betName, sites) {
    delete sites.outright; // Just removing unwanted value from API

    sites = Object.values(sites);

    let bets = {
      name: betName,
      data: []
    };

    for (let site of sites) {
      // if (typeof site !== 'object') continue;
      if (!this.config.allowExchanges && site.exchange) continue;

      let odds = Object.entries(site.odds);

      for (let odd of odds) {
        // odds = [['1', $value], ['2', $value]]
        let betId = bets.data.findIndex(bet => bet.name === odd[0]);

        if (betId === -1) {
          bets.data.push({
            name: odd[0],
            odds: []
          });

          betId = bets.data.length - 1;
        }

        let bet = bets.data[betId];

        bet.odds.push({
          value: odd[1],
          broker: site.name
        });
      }
    }

    return bets;
  }

  separateMatchesToBets() {
    for (let match of this.matches) {
      for (let bet of match.bets) {
        let info = { ...match.info, type: bet.name };
        let odds = []; //[{name, value, broker}]

        odds = this.getHighestOdds(bet.data);

        this.bets.push({ info, odds });
      }
    }
  }

  getHighestOdds(betOptions) {
    let odds = [];

    for (let betOption of betOptions) {
      let crescentOdds = betOption.odds.sort(
        (oddA, oddB) => oddB.value - oddA.value
      );
      let brokers = '';

      for (let odd of crescentOdds) {
        if (odd.value === crescentOdds[0].value) brokers += `/${odd.broker}`;
      }

      brokers = brokers.substr(1);

      let highestOdd = {
        name: betOption.name, // ex: 1
        value: crescentOdds[0].value, // ex: 2.3
        broker: brokers, // ex: Betclic
        allOdds: crescentOdds
      };

      odds.push(highestOdd);
    }

    return odds;
  }

  getBets() {
    return this.bets;
  }
}

module.exports = MatchesAggregator;

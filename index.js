const SurebetFinder = require('./src/surebet_finder.js');
const apiKey = require('dotenv').config().parsed.API_KEY;
const fs = require('fs');

(async function() {
  let bot = new SurebetFinder({ apiKey });
  let surebets;

  await bot.run();
  surebets = bot.getSurebets();

  fs.writeFileSync('./output.json', JSON.stringify(surebets, null, 2), 'utf-8');
})();

const SurebetFinder = require('./src/surebet_finder.js');
const apiKey = require('dotenv').config().parsed.API_KEY;
const fs = require('fs');
const config = require('./config.js');

(async function() {
  console.log(apiKey)
  let bot = new SurebetFinder(apiKey, config);
  let surebets;

  await bot.run();
  surebets = bot.getSurebets();

  fs.writeFileSync('./output.json', JSON.stringify(surebets, null, 2), 'utf-8');
})();

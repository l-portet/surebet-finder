const SurebetFinder = require('./src/surebet-finder.js');
const apiKey = require('dotenv').config().parsed.API_KEY;
const fs = require('fs');
const config = require('./config.js');

(async function() {
  let bot = new SurebetFinder(apiKey, config);
  let surebets;

  await bot.run();
  surebets = bot.getSurebets();

  let content = {
    time: new Date(),
    data: surebets
  };

  fs.writeFileSync('./output.json', JSON.stringify(content, null, 2), 'utf-8');

})();

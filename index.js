const SurebetFinder = require('./src/surebet_finder.js')
const apiKey = require('dotenv').config().parsed.API_KEY;

let bot = new SurebetFinder({
  apiKey
});

bot.run();

# surebet-finder
Surebet finder bot

## Installation
Clone the repo and run
```
npm install
```
Then, you need to set an API key from `https://oddsapi.io/` in the env as `API_KEY`.
You can do it by setting it manually or by creating a `.env` file at the root of the project.

## Configuration
Modify the `config.js` file at your convenience.

#### Sample config

```javascript
const config = {
  allowExchanges: true, // Include exchange brokers
  earnings: 100, // How much profit is targeted
  verbose: true // Display results on the shell
};

module.exports = config;
```

## Usage
Run the bot
```
npm start
```

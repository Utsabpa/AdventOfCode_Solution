const Bot = require('./Bot');
const { REGEX_TYPES } = require('./config');

class Factory {
  constructor() {
    this.bots = {};
    this.outputs = {};
    this.parsers = [
      { type: REGEX_TYPES.VALUE, regex: /^value (\d+) goes to bot (\d+)$/ },
      { type: REGEX_TYPES.TRANSFER, regex: /^bot (\d+) gives low to (bot|output) (\d+) and high to (bot|output) (\d+)$/ }
    ];
  }

  start() {
    this.loop();
  }

  loop(botId) {
    let nextBotId = botId;
    if (nextBotId === undefined) {
      nextBotId = Object.keys(this.bots).find(botId => {
        return this.bots[botId].chips.low && this.bots[botId].chips.high
      });
    }
    if (nextBotId === undefined) {
      return;
    }
    const nextBots = [];
    try {
      nextBots.push(...this.bots[nextBotId].doTransfers(this.bots, this.outputs));
    } catch (e) {
      throw new Error('Could not find bot');
    }
    this.loop(nextBots.find(id => this.bots[id].chips.low && this.bots[id].chips.high));
  }

  parseInstruction(line) {
    let parsed = {};
    this.parsers.some(parser => {
      const { type, regex } = parser;
      const match = line.match(regex);
      if (match) {
        parsed = { type, match };
        return true;
      }
      return false;
    });
    switch (parsed.type) {
      case REGEX_TYPES.VALUE:
        return this.getBot(parsed.match[2]).setChips(parseInt(parsed.match[1], 10));
      case REGEX_TYPES.TRANSFER:
        return this.getBot(parsed.match[1]).setTransfers(parsed.match.slice(2));
      default:
        throw Error('Invalid instruction' + line);
    }
  }

  getBot(id) {
    const botId = parseInt(id, 10);
    let bot = this.bots[botId];
    if (!bot) {
      bot = new Bot(botId);
      this.bots[botId] = bot;
    }
    return bot;
  }

}

module.exports = Factory;

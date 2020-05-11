const { property } = require('testcheck');
require('mocha-testcheck').install();
const { expect } = require('chai');

const Bot = require('../Day_10_exercise/Bot');
const Factory = require('../Day_10_exercise/Bot');

describe('Day 10: Balance Bots', () => {

  describe('Bot class', () => {
    const botid = gen.posInt;
    const chips = gen.uniqueArray(gen.posInt, { size: 2 });
    const transfers = gen.array([
      gen.oneOf(['bot', 'output']),
      gen.posInt,
      gen.oneOf(['bot', 'output']),
      gen.posInt,
    ], { size: 1 });

    check.test('should have integer passed to constructor as its id', { times: 100 }, botid, (id) => {
      const bot = new Bot(id);
      expect(bot.id).to.equal(id);
    });

    check.test('should set the given chip to low if it had no chips', { times: 100 }, [botid, chips], (id, chips) => {
      const bot = new Bot(id);
      bot.setChips(chips[0]);
      expect(bot.chips.low).to.not.equal(null);
      expect(bot.chips.low).to.equal(chips[0]);
    });

    check.test('should set the given chip to low or high depending on value', { times: 100 }, [botid, chips], (id, chips) => {
      const bot = new Bot(id);
      bot.setChips(chips[0]);
      bot.setChips(chips[1]);
      expect(bot.chips.low).to.equal(chips[0] < chips[1] ? chips[0] : chips[1]);
      expect(bot.chips.high).to.equal(chips[0] < chips[1] ? chips[1] : chips[0]);
    });

    check.test('should set the given transfer rules correctly', { times: 100 }, [botid, transfers], (id, transfer) => {
      const bot = new Bot(id);
      bot.setTransfers(transfer);
      expect(bot.transfers.low).to.be.eql({
        to: transfer[0],
        id: transfer[1],
      });
      expect(bot.transfers.high).to.eql({
        to: transfer[2],
        id: transfer[3],
      });
    });
    
  });

});

const Logger = require('./Logger');
const { VALUE_TYPES, TRANSFER_TYPES } = require('./config');

class Bot {
  constructor(id) {
    this.id = id;
    this.chips = { low: null, high: null };
    this.transfers = { low: null, high: null };
  }

  setChips(chip) {
    const { chips } = this;
    if (chips.low === null) {
      chips.low = chip;
    } else if (chip < chips.low) {
      chips.high = chips.low;
      chips.low = chip;
    } else {
      chips.high = chip;
    }
  }

  setTransfers(inputs) {
    this.transfers.low = {
      to: inputs[0],
      id: inputs[1]
    };
    this.transfers.high = {
      to: inputs[2],
      id: inputs[3]
    };
  }

  handoverChip(type, bots, outputs) {
    const { chips, transfers } = this;
    let toBot = null;
    if (transfers[type].to === TRANSFER_TYPES.BOT) {
      bots[transfers[type].id].setChips(chips[type]);
      chips[type] = null;
      toBot = transfers[type].id;
    } else if (transfers[type].to === TRANSFER_TYPES.OUTPUT) {
      const outputId = transfers[type].id;
      let output = outputs[outputId];
      if (!output) {
        output = [];
        outputs[outputId] = output;
      }
      output.push(chips[type]);
    }
    chips[type] = null;
    return toBot;
  }

  doTransfers(bots, outputs) {
    const { id, chips } = this;
    const toBots = [];
    Logger.getInstance().push({ id, compares: [chips.low, chips.high] });
    try {
      let toBot;
      if (chips.low) {
        toBot = this.handoverChip(VALUE_TYPES.LOW, bots, outputs);
        toBot && toBots.push(toBot);
      }
      if (chips.high) {
        toBot = this.handoverChip(VALUE_TYPES.HIGH, bots, outputs);
        toBot && toBots.push(toBot);
      }
      return toBots;
    } catch (e) {
      throw new Error('Invalid Transfer');
    }
  }
}
module.exports = Bot;

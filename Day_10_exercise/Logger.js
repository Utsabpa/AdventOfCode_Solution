class Logger {
  constructor() {
    this.logs = [];
  }

  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  push(trace) {
    this.logs.push(trace);
  }

  findByValues(values) {
    return this.logs.find(log => log.compares.every(value => values.includes(value)));
  }
}

module.exports = Logger;
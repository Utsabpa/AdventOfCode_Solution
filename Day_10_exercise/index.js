const fs = require('fs');
const readline = require('readline');
const Factory = require('./Factory');
const Logger = require('./Logger');

const params = [];
const factory = new Factory();

function main() {
  // Accept input from console for values to check
  const paramsReader = readline.createInterface(process.stdin, process.stdout);
  paramsReader.question('Enter the value of first microchip to check (61):', (chip1 => {
    paramsReader.question('Enter the value of second microchip to check (17):', (chip2 => {
      params.push(parseInt(chip1 || 61));
      params.push(parseInt(chip2 || 17));
      paramsReader.close();
    }));
  }));
  paramsReader.on('close', () => readInputFile());
}

function start() {
  factory.start();
  processLogs(params);
}

function readInputFile() {
  // Process the input txt file
  const lineReader = readline.createInterface({
    input: fs.createReadStream('./input.txt')
  });
  lineReader.on('line', function (line) {
    factory.parseInstruction(line)
  });
  lineReader.on('close', function () {
    start();
  });
}

function processLogs(values) {
  const log = Logger.getInstance().findByValues(values);
  if (log) {
    console.log(`Bot ${log.id} compares value-${values[0]} with value-${values[1]}.`);
  } else {
    console.log(`Could not find the bot which compares value-${values[0]} with value-${values[1]}.`);
  }
}

main();

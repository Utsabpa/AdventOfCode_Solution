const fs = require('fs');
const readline = require('readline');

const { getSumOfRealRooms } = require('./day_4')

const rooms = [];

const lineReader = readline.createInterface({
  input: fs.createReadStream('./input.txt')
});

lineReader.on('line', function (line) {
  rooms.push(line);
});

lineReader.on('close', function () {
  const result = getSumOfRealRooms(rooms);
  console.log(result);
});
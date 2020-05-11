function parseRoom(room) {
  try {
    const match = room.match(/([a-z\-]+)-(\d+)\[([a-z]+)\]/);
    return {
      name: match[1],
      sectorId: parseInt(match[2], 10),
      checksum: match[3]
    };
  }
  catch (e) {
    console.error('Invalid room: Could not parse the room');
  }
  return null;
}

function getLettersMap(roomName) {
  const lettersMap = {};
  roomName.replace(/-/g, '')
    .split('')
    .forEach(item => (
      lettersMap[item] === undefined
        ? lettersMap[item] = 1
        : lettersMap[item] = lettersMap[item] + 1
    ));
  return lettersMap;
}

function getSortedLetters(roomName) {
  const lettersMap = getLettersMap(roomName);
  const sortFunc = (a, b) => (
    (b.count - a.count)
    || ((a.letter > b.letter) ? 1 : (a.letter < b.letter) ? -1 : 0)
  );
  const lettersArr = Object.keys(lettersMap)
    .map(letter => ({ letter, count: lettersMap[letter] }))
    .sort(sortFunc);
  return lettersArr;
}

function getSectorId(room) {
  const roomObj = parseRoom(room);
  if (roomObj) {
    const sortedLetters = getSortedLetters(roomObj.name);
    let expectedChecksum = '';
    for (let i = 0; i < 5; i++) {
      expectedChecksum += sortedLetters[i].letter;
    }
    if (expectedChecksum === roomObj.checksum) {
      return roomObj.sectorId;
    }
  }
  return 0;
}

function getSumOfRealRooms(rooms) {
  return rooms.map(getSectorId).reduce((id, acc) => acc + id, 0);
}

module.exports = {
  parseRoom,
  getLettersMap,
  getSortedLetters,
  getSectorId,
  getSumOfRealRooms
}
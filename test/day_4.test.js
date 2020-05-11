require('mocha-testcheck').install();
const { expect } = require('chai');

const { parseRoom, getSectorId, getSumOfRealRooms } = require('../Day_4_exercise/day_4');

const ROOM_TYPES = {
  REAL: 'real',
  DECOY: 'decoy',
};

const sampleRooms = [{
  sectorId: 123,
  name: 'aaaaa-bbb-z-y-x-123[abxyz]',
  type: ROOM_TYPES.REAL,
  checksum: 'abxyz',
},
{
  sectorId: 987,
  name: 'a-b-c-d-e-f-g-h-987[abcde]',
  type: ROOM_TYPES.REAL,
  checksum: 'abcde',
},
{
  sectorId: 404,
  name: 'not-a-real-room-404[oarel]',
  type: ROOM_TYPES.REAL,
  checksum: 'oarel',
},
{
  sectorId: 200,
  name: 'totally-real-room-200[decoy]',
  type: ROOM_TYPES.DECOY,
  checksum: 'decoy',
}];

const oneOfRooms = gen.oneOf(sampleRooms);
const randomRooms = gen.sized((size) => gen.array(oneOfRooms, { size }));

describe('Day 4: Security Through Obscurity', () => {
  check.test('getSectorId: should return sectorId for real room, otherwise 0', { times: 10 }, oneOfRooms, (room) => {
    const result = getSectorId(room.name);
    const expected = room.type === ROOM_TYPES.REAL ? room.sectorId : 0;
    expect(result).to.equal(expected);
  });

  check.test('parseRoom: should correctly parse the room into its parts', { times: 10 }, oneOfRooms, (room) => {
    const result = parseRoom(room.name);
    expect(result.sectorId).to.equal(room.sectorId);
    expect(result.name).to.equal(room.name.slice(0, room.name.lastIndexOf('-')));
    expect(result.checksum).to.equal(room.checksum);
  });

  check.test('getSumOfRealRooms: should return the sum of sector IDs of real rooms', { times: 10 }, randomRooms, (rooms) => {
    const expected = rooms.reduce((acc, r) => acc + (r.type === ROOM_TYPES.REAL ? r.sectorId : 0), 0);
    const roomNames = rooms.map(r => r.name);
    expect(getSumOfRealRooms(roomNames)).to.equal(expected);
  });
});
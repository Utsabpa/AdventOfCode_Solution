const fs = require('fs'),
	path = require('path'),
	filePath = path.join(__dirname, 'input.txt');

	function index() {
		fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
			const directions = data.split(', ');
			const result = main(directions);
			console.log(result);
		});
	}

function main(directions) {
	const DIRECTION = { NORTH: 0, EAST: 1, SOUTH: 2, WEST: 3 };
	const TURN = { LEFT: 'L', RIGHT: 'R' };

	let x = y = facing = DIRECTION.NORTH;
	const cods = [];

	directions.forEach(item => {
		move = item.charAt(0);
		distance = parseInt(item.substring(1));
		right = 1;
		if (move === TURN.LEFT)
			right = -1;

		for (let i = 0; i < distance; i++) {
			if (cods && cods.find(cod => cod[0] == x && cod[1] == y))
				break;
			cods.push([x, y]);

			if (facing < 0)
				facing += 4;

			switch (facing % 4) {
				case DIRECTION.NORTH:
					x += right;
					break;
				case DIRECTION.EAST:
					y += -right;
					break;
				case DIRECTION.SOUTH:
					x += -right;
					break;
				case DIRECTION.WEST:
					y += right;
					break;
			} // close of switch
		} // close of for
		facing += right;
	}); // close of forEach
	return Math.abs(x) + Math.abs(y);
}

index();

module.exports = main;
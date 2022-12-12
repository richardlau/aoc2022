import { readFile } from 'node:fs/promises';

class HeightMap {
  constructor(input) {
    this.map = input.split(/\r\n|\r|\n/);
  };
  find(target) {
    for (let y = 0; y < this.map.length; y++) {
      const x = this.map[ y ].indexOf(target);
      if (x !== -1) {
        return [ x, y ];
      };
    };
    console.error('No starting location.');
  };
  get(x, y) {
    return this.map[ y ].charAt(x);
  };
  getElevation(x, y) {
    const height = this.map[ y ].charAt(x);
    switch (height) {
      case 'E': return 'z'.charCodeAt(0);
      case 'S': return 'a'.charCodeAt(0);
      default: return height.charCodeAt(0);
    };
  };
  getHeight() {
    return this.map.length;
  };
  getWidth() {
    return this.map[0].length;
  };
  isValidMove([ fromX, fromY ], [ toX, toY ]) {
    if (fromX < 0 || fromX >= this.getWidth() ||
        fromY < 0 || fromY >= this.getHeight() ||
        toX < 0 || toX >= this.getWidth() ||
        toY < 0 || toY >= this.getHeight()) {
      return false;
    };
    return this.getElevation(toX, toY) - this.getElevation(fromX, fromY) < 2;
  };
};

const asXYArray = (s) => {
  return /x(\d+)y(\d+)/.exec(s).slice(1).map(Number);
}
const asStringXY = ([x, y]) => `x${x}y${y}`;

const inputFile = process.argv[ 2 ] ?? 'input';
const input = await readFile(inputFile, { encoding: 'utf8' });
const map = new HeightMap(input);
const end = map.find('E');
const visited = new Map();
const unvisited = [ asStringXY(end) ];
const directions = [ [ 0, -1 ], [ 0, 1 ], [ -1, 0 ], [ 1, 0 ] ];
let path = [ ];
while (unvisited.length > 0) {
  const position = unvisited.shift();
  const pathToPosition = visited.get(position) ?? [ asStringXY(position) ];
  visited.set(position, pathToPosition);
  const [ x, y ] = asXYArray(position);
  for (const [ dx, dy ] of directions) {
    const newX = x + dx;
    const newY = y + dy;
    const newPosition = asStringXY([ newX, newY ]);
    const pathToNext = visited.get(newPosition);
    if (map.isValidMove([ newX, newY ], [ x, y ])) {
      if (pathToPosition.length + 1 < (pathToNext?.length ?? Number.MAX_SAFE_INTEGER)) {
        visited.set(newPosition, [ newPosition, ...pathToPosition ]);
        if (!unvisited.includes(newPosition)) {
          unvisited.push(newPosition);
        };
      };
    };
  };
  if (map.get(x, y) === 'a') {
    path = pathToPosition;
    break;
  };
  unvisited.sort((a, b) => visited.get(a).length - visited.get(b).length);
};
console.log(path.length - 1);
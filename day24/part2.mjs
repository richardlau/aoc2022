import { readFile } from 'node:fs/promises';

const asStringXYT = (arrayXYT) => arrayXYT.join();
const asArrayXYT = (stringXYT) => stringXYT.split(',').map(Number);
const directions = [ [ 0, -1 ], [ 0, 1 ], [ -1, 0 ], [ 1, 0 ] ];
const isBlocked = (x, y, time) => {
  if ((y === (startMap.length - 1) || y === 0) && startMap[ y ].charAt(x) === '.') {
    return false;
  };
  if (y < 1 || x < 1 || y >= startMap.length || x >= (startMap[ 0 ].length) || startMap[ y ].charAt(x) === '#') {
    return true;
  };
  // To see if the given point is blocked by a blizzard, work out for every
  // direction where a blizzard must have been at time 0 and check the start
  // map to see if there was such a blizzard.
  for (let direction = 0; direction < directions.length; direction++) {
    const [ dx, dy ] = directions[ direction ];
    const ox = (((x - 1 - dx * time) % traversableWidth + traversableWidth) % traversableWidth) + 1;
    const oy = (((y - 1 - dy * time) % traversableHeight + traversableHeight) % traversableHeight) + 1;
    if (startMap[ oy ].charAt(ox) === '^v<>'.charAt(direction)) {
      return true;
    };
  };
  return false;
};
const shortestPath = (start, goal) => {
  let path = [];
  const visited = new Map();
  const unvisited = [ asStringXYT(start) ];
  while (unvisited.length > 0 && path.length === 0) {
    const position = unvisited.shift();
    const pathToPosition = visited.get(position) ?? [position];
    visited.set(position, pathToPosition);
    const [x, y, t] = asArrayXYT(position);

    for (const [ dx, dy ] of [ ...directions, [ 0, 0 ] ]) {
      const newx = x + dx;
      const newy = y + dy;
      const newPosition = asStringXYT([ newx, newy, t + 1 ]);
      if (newx === goal[ 0 ] && newy === goal[ 1 ]) {
        path = [ ...pathToPosition, newPosition ];
        break;
      };
      if (!isBlocked(newx, newy, t + 1)) {
        const pathToNext = visited.get(newPosition);
        if (pathToPosition.length + 1 < (pathToNext?.length ?? Number.MAX_SAFE_INTEGER)) {
          visited.set(newPosition, [ ...pathToPosition, newPosition ]);
          if (!unvisited.includes(newPosition)) {
            unvisited.push(newPosition);
          };
        };
      };
    };
    unvisited.sort((a, b) => visited.get(a).length - visited.get(b).length);
  };
  return path;
};

const inputFile = process.argv[ 2 ] ?? 'input';
const input = await readFile(inputFile, { encoding: 'utf8' });
const startMap = input.split(/\r\n|\r|\n/);
const traversableHeight = startMap.length - 2;
const traversableWidth = startMap[ 0 ].length - 2;

const start = [ startMap[ 0 ].indexOf('.'), 0 ];
const goal = [ startMap[ startMap.length - 1 ].indexOf('.'), startMap.length - 1 ];
const path = shortestPath([ ...start, 0 ], goal);
const path2 = shortestPath([ ...goal, path.length - 1 ], start);
const path3 = shortestPath([ ...start, path.length + path2.length - 2 ], goal);
console.log(path.length - 1 + path2.length - 1 + path3.length - 1);
import { readFile } from 'node:fs/promises';

const inputRe = /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/;

const asXYArray = (s) => {
  return /x(\d+)y(\d+)/.exec(s).slice(1).map(Number);
}
const asStringXY = ([ x, y ]) => `x${x}y${y}`;
const distance = (x0, y0, x1, y1) => Math.abs(x1 - x0) + Math.abs(y1 - y0);
const coveredRangesForY = (sensors, queryRow) => {
  const intersections = [];
  for (const [sensor, distance] of sensors) {
    const [sx, sy] = asXYArray(sensor);
    if (Math.abs(queryRow - sy) <= distance) {
      const xdiff = distance - Math.abs(queryRow - sy);
      intersections.push([
        sx - xdiff < 0 ? 0 : sx - xdiff,
        sx + xdiff > searchBoundary ? searchBoundary : sx + xdiff,
      ]);
    }
  };
  // Merge covered ranges.
  const covered = new Set();
  const processQueue = Array.from(intersections);
  while (processQueue.length > 0) {
    const [i0, i1] = processQueue.pop();
    const overlaps = [...covered].filter(([x0, x1]) => {
      return (x0 <= i0 && i0 <= x1) ||
        (x0 <= i1 && i1 <= x1) ||
        (i0 <= x0 && x0 <= i1) ||
        (i0 <= x1 && x1 <= i1);
    });
    if (overlaps.length === 0) {
      covered.add([i0, i1]);
    }
    for (const overlap of overlaps) {
      const [x0, x1] = overlap;
      if (!(i0 === x0 && i1 === x1)) {
        overlap[0] = i0 < overlap[0] ? i0 : overlap[0];
        overlap[1] = i1 > overlap[1] ? i1 : overlap[1];
        processQueue.push(overlap);
        covered.delete(overlap);
      };
    };
  };
  return covered;
}

const searchBoundary = process.argv[ 2 ] ?? 4000000;
const inputFile = process.argv[ 3 ] ?? 'input';
const input = await readFile(inputFile, { encoding: 'utf8' });
const sensors = new Map();
for (const line of input.split(/\r\n|\r|\n/)) {
  const [ _, sx, sy, bx, by ] = inputRe.exec(line).map(Number);
  sensors.set(asStringXY([ sx, sy ]), distance(sx, sy, bx, by));
};
for (let y = 0; y <= searchBoundary; y++) {
  const covered = [...coveredRangesForY(sensors, y)].sort(([ ax ], [ bx ]) => ax - bx);
  if ([...covered].reduce((total, [ x0, x1 ]) => total + x1 - x0 + 1, 0) === searchBoundary + 1) {
    continue;
  };
  let x = 0;
  for (const [ x0, x1 ] of covered) {
    if (x0 <= x && x <= x1) {
      x = x1 + 1;
    };
  };
  if (x <= searchBoundary) {
    console.log(`${x},${y}`);
    console.log(4000000 * x + y);
    break;
  }
};
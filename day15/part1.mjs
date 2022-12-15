import { readFile } from 'node:fs/promises';

const inputRe = /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/;

const asXYArray = (s) => {
  return /x(\d+)y(\d+)/.exec(s).slice(1).map(Number);
}
const asStringXY = ([ x, y ]) => `x${x}y${y}`;
const distance = (x0, y0, x1, y1) => Math.abs(x1 - x0) + Math.abs(y1 - y0);
const sensors = new Map();
const beacons = new Set();

const queryRow = process.argv[ 2 ] ?? 2000000;
const inputFile = process.argv[ 3 ] ?? 'input';
const input = await readFile(inputFile, { encoding: 'utf8' });
for (const line of input.split(/\r\n|\r|\n/)) {
  const [ _, sx, sy, bx, by ] = inputRe.exec(line).map(Number);
  sensors.set(asStringXY([ sx, sy ]), distance(sx, sy, bx, by));
  beacons.add(asStringXY([ bx, by ]));
};
const intersections = [];
for (const [ sensor, distance ] of sensors) {
  const [ sx, sy ] = asXYArray(sensor);
  if (Math.abs(queryRow - sy) <= distance) {
    const xdiff = distance - Math.abs(queryRow - sy);
    intersections.push([ sx - xdiff, sx + xdiff ]);
  }
};
// Merge covered ranges.
const covered = [];
const processQueue = Array.from(intersections).sort(([ ax ], [ bx ]) => ax - bx);
while (processQueue.length > 0) {
  const [ i0, i1 ] = processQueue.shift();
  const lastRange = covered[ covered.length - 1 ];
  if (lastRange === undefined) {
    covered.push([ i0, i1 ]);
    continue;
  };
  if (i0 <= lastRange[1]) {
    // Overlap. Extend previous range.
    lastRange[1] = lastRange[1] >= i1 ? lastRange[1] : i1;
    continue;
  };
  covered.push([ i0, i1 ]);
};
const scanned = covered.reduce((total, [ x0, x1 ]) => x1 - x0 + 1, 0);
console.log(scanned - [...beacons].filter((beacon) => beacon.endsWith(`y${queryRow}`)).length);
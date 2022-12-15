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
const covered = new Set();
for (const [ sensor, distance ] of sensors) {
  const [ sx, sy ] = asXYArray(sensor);
  if (Math.abs(queryRow - sy) <= distance) {
    const xdiff = distance - Math.abs(queryRow - sy);
    for (let x = sx - xdiff; x <= sx + xdiff; x++) {
      covered.add(asStringXY([x, queryRow ]));
    };
  }
};
console.log(covered.size - [...beacons].filter((beacon) => beacon.endsWith(`y${queryRow}`)).length);
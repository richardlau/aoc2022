import { readFile } from 'node:fs/promises';

const asXYZString = (arrayXYZ) => arrayXYZ.join(',');
const asXYZArray = (stringXYZ) => stringXYZ.split(',').map(Number);
const surroundingCubes = [
  [ 1, 0, 0 ], [ -1, 0, 0 ],
  [ 0, 1, 0 ], [ 0, -1, 0 ],
  [ 0, 0, 1 ], [ 0, 0, -1 ],
];

const inputFile = process.argv[ 2 ] ?? 'input';
const input = await readFile(inputFile, { encoding: 'utf8' });
const cubes = new Map();
for (const coordinates of input.split(/\r\n|\r|\n/)) {
  const [ x, y, z ] = asXYZArray(coordinates);
  let exposedSides = 6;
  for (const neighbour of surroundingCubes.map(([ dx, dy, dz ]) => asXYZString([ x + dx, y + dy, z + dz ]))) {
    if (cubes.has(neighbour)) {
      exposedSides--;
      cubes.set(neighbour, cubes.get(neighbour) - 1);
    };
  };
  cubes.set(coordinates, exposedSides);
};
console.log(`${[ ...cubes.values() ].reduce((total, v) => total + v)}`);
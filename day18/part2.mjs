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
const cubes = input.split(/\r\n|\r|\n/);

const cubesAsCoordinates = [...cubes].map(asXYZArray);
const minimumX = cubesAsCoordinates.reduce((minX, [ x, y, z ]) => Math.min(minX, x), Number.MAX_SAFE_INTEGER) - 1;
const minimumY = cubesAsCoordinates.reduce((minY, [ x, y, z ]) => Math.min(minY, y), Number.MAX_SAFE_INTEGER) - 1;
const minimumZ = cubesAsCoordinates.reduce((minZ, [ x, y, z ]) => Math.min(minZ, z), Number.MAX_SAFE_INTEGER) - 1;
const maximumX = cubesAsCoordinates.reduce((maxX, [ x, y, z ]) => Math.max(maxX, x), minimumX) + 1;
const maximumY = cubesAsCoordinates.reduce((maxY, [ x, y, z ]) => Math.max(maxY, y), minimumY) + 1;
const maximumZ = cubesAsCoordinates.reduce((maxZ, [ x, y, z ]) => Math.max(maxZ, z), minimumZ) + 1;
const externalCubes = new Map();
const visited = new Set();
const unvisited = [ asXYZString([ minimumX, minimumY, minimumZ ])];
while (unvisited.length > 0) {
  const cube = unvisited.pop();
  if (cubes.includes(cube)) {
    const count = (externalCubes.get(cube) ?? 0) + 1;
    externalCubes.set(cube, count);
    continue;
  };
  if (visited.has(cube)) {
    continue;
  };
  visited.add(cube);
  const [ x, y, z ] = asXYZArray(cube);
  for (const [ nx, ny, nz ] of surroundingCubes.map(([ dx, dy, dz ]) => [ x + dx, y + dy, z + dz ])) {
    const neighbour = asXYZString([ nx, ny, nz ]);
    if (!visited.has(neighbour) &&
        (nx >= minimumX) && (nx <= maximumX) &&
        (ny >= minimumY) && (ny <= maximumY) &&
        (nz >= minimumZ) && (nz <= maximumZ)) {
      unvisited.push(neighbour);
    };
  };
};
console.log(`${[ ...externalCubes.values() ].reduce((total, c) => total + c, 0)}`);
import { readFile } from 'node:fs/promises';

const coordinates = (x, y) => `x${x}y${y}`;
const isAdjacent = (hx, hy, tx, ty) => {
  return [-1, 0, 1].includes(hx - tx) && [-1, 0, 1].includes(hy - ty);
};
const moveTail = (hx, hy, tx, ty) => {
  const dx = hx - tx;
  const dy = hy - ty;
  if (isAdjacent(hx, hy, tx, ty)) {
    return [tx, ty]; // Adjacent, do not move tail.
  }
  let rx = tx;
  let ry = ty;
  rx += dx === 0 ? 0 : dx / Math.abs(dx);
  ry += dy === 0 ? 0 : dy / Math.abs(dy);
  const newcoords = coordinates(rx, ry);
  tailPositions.set(newcoords, 1 + (tailPositions.get(newcoords) ?? 0));
  return [rx, ry];
};

const input = await readFile('input', { encoding: 'utf8' });
let hx = 0;
let hy = 0;
let tx = 0;
let ty = 0;
const tailPositions = new Map();
tailPositions.set(coordinates(tx, ty), 1);
for (const move of input.split(/\r\n|\r|\n/)) {
  const [ direction, steps ] = move.split(' ')
                               .map((v, i) => i === 1 ? Number(v) : v);
  switch (direction) {
    case 'D':
      for (let i = 0; i < steps; i++) {
        hy++;
        [tx, ty] = moveTail(hx, hy, tx, ty);
      }
      break;
    case 'L':
      for (let i = 0; i < steps; i++) {
        hx--;
        [tx, ty] = moveTail(hx, hy, tx, ty);
      }
      break;
    case 'R':
      for (let i = 0; i < steps; i++) {
        hx++;
        [tx, ty] = moveTail(hx, hy, tx, ty);
      }
      break;
    case 'U':
      for (let i = 0; i < steps; i++) {
        hy--;
        [tx, ty] = moveTail(hx, hy, tx, ty);
      }
      break;
    default:
      console.error(`Unable to parse move '${move}'`);
  };
};
console.log([...tailPositions.keys()].length);
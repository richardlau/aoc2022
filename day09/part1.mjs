import { readFile } from 'node:fs/promises';

const coordinates = ([x, y]) => `x${x}y${y}`;
const isAdjacent = (hx, hy, tx, ty) => {
  return [-1, 0, 1].includes(hx - tx) && [-1, 0, 1].includes(hy - ty);
};
const moveKnot = ([hx, hy], [tx, ty]) => {
  const dx = hx - tx;
  const dy = hy - ty;
  if (isAdjacent(hx, hy, tx, ty)) {
    return [tx, ty]; // Adjacent, do not move tail.
  }
  let rx = tx;
  let ry = ty;
  rx += dx === 0 ? 0 : dx / Math.abs(dx);
  ry += dy === 0 ? 0 : dy / Math.abs(dy);
  return [rx, ry];
};

const input = await readFile('input', { encoding: 'utf8' });
let knots = [...new Array(2)].map((_) => [0, 0]);

const tailPositions = new Map();
tailPositions.set(coordinates(knots[knots.length - 1]), 1);
for (const move of input.split(/\r\n|\r|\n/)) {
  const [ direction, steps ] = move.split(' ')
                               .map((v, i) => i === 1 ? Number(v) : v);
  const dx = direction === 'R' ? 1 : direction === 'L' ? -1 : 0;
  const dy = direction === 'D' ? 1 : direction === 'U' ? -1 : 0;
  for (let i = 0; i < steps; i++) {
    knots[0] = [knots[0][0] + dx, knots[0][1] + dy];
    for (let j = 1; j < knots.length; j++) {
      knots[j] = moveKnot(knots[j - 1], knots[j]);
    }
    const newcoords = coordinates(knots[knots.length - 1]);
    tailPositions.set(newcoords, 1 + (tailPositions.get(newcoords) ?? 0));
  }
};
console.log([...tailPositions.keys()].length);
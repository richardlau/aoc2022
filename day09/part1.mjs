import { readFile } from 'node:fs/promises';

const coordinates = ([x, y]) => `x${x}y${y}`;
const isAdjacent = ([hx, hy], [tx, ty]) => {
  return [-1, 0, 1].includes(hx - tx) && [-1, 0, 1].includes(hy - ty);
};
const moveKnot = ([hx, hy], [tx, ty]) => {
  const dx = hx - tx;
  const dy = hy - ty;
  if (isAdjacent([hx, hy], [tx, ty])) {
    return [tx, ty]; // Adjacent, do not move tail.
  }
  return [
    tx + (dx === 0 ? 0 : dx / Math.abs(dx)),
    ty + (dy === 0 ? 0 : dy / Math.abs(dy)),
  ];
};

const input = await readFile('input', { encoding: 'utf8' });
// Head is knots[0], tail is knots[knots.length - 1].
let knots = [...new Array(2)].map((_) => [0, 0]);
const tailPositions = new Set();
tailPositions.add(coordinates(knots[knots.length - 1]));
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
    tailPositions.add(coordinates(knots[knots.length - 1]));
  }
};
console.log(tailPositions.size);
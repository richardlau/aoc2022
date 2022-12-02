import { readFile } from 'node:fs/promises';

const scores = {
  A: { X: 4, Y: 8, Z: 3 },
  B: { X: 1, Y: 5, Z: 9 },
  C: { X: 7, Y: 2, Z: 6 },
};

const input = await readFile('input', { encoding: 'utf8' });
console.log(input.split('\n').reduce((score, move) => {
  const [ p1, p2 ] = move.split(' ');
  return score + scores[p1][p2];
}, 0));
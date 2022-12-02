import { readFile } from 'node:fs/promises';

const scores = {
  A: { X: 3, Y: 4, Z: 8 },
  B: { X: 1, Y: 5, Z: 9 },
  C: { X: 2, Y: 6, Z: 7 },
};

const input = await readFile('input', { encoding: 'utf8' });
console.log(input.split('\n').reduce((score, move) => {
  const [ p1, outcome ] = move.split(' ');
  return score + scores[p1][outcome];
}, 0));
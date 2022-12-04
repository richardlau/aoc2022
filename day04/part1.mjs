import { readFile } from 'node:fs/promises';

const fullyContains = ([range1, range2]) => {
  return (range1[0] <= range2[0] && range1[1] >= range2[1]) ||
    (range2[0] <= range1[0] && range2[1] >= range1[1]);
};

const input = await readFile('input', { encoding: 'utf8' });
console.log(input.split('\n').map((assignments) => {
  return assignments.trim().split(',').map((assignment) => {
    return assignment.split('-').map((s) => parseInt(s));
  });
}).filter(fullyContains).length);
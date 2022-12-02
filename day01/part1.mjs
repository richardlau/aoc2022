import { readFile } from 'node:fs/promises';

const input = await readFile('input', { encoding: 'utf8' });
const sortedTotals = input.trim().split('\n\n').map((calories) => {
  return calories.split('\n').map((entry) => {
    return parseInt(entry);
  }).reduce((total, entry) => total + entry, 0);
}).sort();
console.log(sortedTotals.at(-1));
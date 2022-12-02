import { readFile } from 'node:fs/promises';

const sum = (numbers) => numbers.reduce((total, n) => total + n, 0);

const input = await readFile('input', { encoding: 'utf8' });
const sortedTotals = input.trim().split('\n\n').map((calories) => {
  return sum(calories.split('\n').map((entry) => parseInt(entry)));
}).sort();
const topThree = sortedTotals.slice(-3);
console.log(sum(topThree));
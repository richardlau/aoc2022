import { readFile } from 'node:fs/promises';

const getPriority = (item) => {
  const c = item.charCodeAt();
  return (c > 90) ? c - 96 : 27 + c - 65;
};
const sum = (numbers) => numbers.reduce((total, n) => total + n, 0);

const input = await readFile('input', { encoding: 'utf8' });
console.log(sum(input.split('\n').map((sack) => {
  const length = sack.length / 2;
  const compartment2 = sack.slice(-length);
  for (const item of sack.substring(0, length)) {
    if (compartment2.indexOf(item) !== -1) {
      return getPriority(item);
    }
  }
}, 0)));
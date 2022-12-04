import { readFile } from 'node:fs/promises';

const getPriority = (item) => {
  const c = item.charCodeAt();
  return (c > 90) ? c - 96 : 27 + c - 65;
};
const sum = (numbers) => numbers.reduce((total, n) => total + n, 0);

const input = await readFile('input', { encoding: 'utf8' });
console.log(sum(input.split('\n').reduce((result, sack, i) => {
    if (i % 3 == 0) {
      result[Math.floor(i / 3)] = [];
    }
    result[Math.floor(i / 3)].push(sack);
    return result;
  }, []).map(([sack1, sack2, sack3]) => {
  for (const item of sack1) {
    if (sack2.indexOf(item) !== -1 && sack3.indexOf(item) !== -1) {
      return getPriority(item);
    }
  }
}, 0)));
import { readFile } from 'node:fs/promises';

const compare = (left, right) => {
  if (typeof left === 'number' && typeof right === 'number') {
    return left - right;
  };
  if (typeof left === 'number' && Array.isArray(right)) {
    return compare([ left ], right);
  };
  if (Array.isArray(left) && typeof right === 'number') {
    return compare(left, [ right ]);
  };
  if (!Array.isArray(left) && !Array.isArray(right)) {
    console.error('Not arrays:');
    console.error(left);
    console.error(right);
  };
  let i = 0;
  do {
    if (i >= left.length && i < right.length) {
      return -1;
    };
    if (i < left.length && i >= right.length) {
      return 1;
    };
    if (i >= left.length && i >= right.length) {
      return 0;
    }
    const result = compare(left[ i ], right[ i ]);
    if (result === 0) {
      i++;
      continue;
    }
    return result;
  } while (true);
};
const inputFile = process.argv[ 2 ] ?? 'input';
const input = await readFile(inputFile, { encoding: 'utf8' });
const pairs = input.split(/\r\n\r\n|\r\r|\n\n/).map((line) => {
  const [ left, right ] = line.split(/\r\n|\r|\n/).map((l) => JSON.parse(l));
  return [ left, right ];
});
console.log(pairs.reduce((total, [ left, right], i) => {
  return total + (compare(left, right) < 0 ? i + 1 : 0);
}, 0));
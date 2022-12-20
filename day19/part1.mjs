import { readFile } from 'node:fs/promises';

const inputFile = process.argv[ 2 ] ?? 'input';
const input = await readFile(inputFile, { encoding: 'utf8' });
const encrypted = input.split(/\r\n|\r|\n/).map((line) => { return { value: Number(line) }});
let zero;
for (let i = 0; i < encrypted.length; i++) {
  encrypted[ i ].prev = (i === 0) ? encrypted[ encrypted.length - 1 ] : encrypted[ i - 1 ];
  encrypted[ i ].next = (i === encrypted.length - 1) ? encrypted[ 0 ] : encrypted[ i + 1 ];
  if (encrypted[ i ].value === 0) {
    zero = encrypted[ i ];
  };
};
const valueAfterZero = (index) => {
  let result = zero;
  for (let i = 0; i < index; i++) {
    result = result.next;
  };
  return result.value;
};
for (const item of encrypted) {
  const direction = item.value / Math.abs(item.value);
  for (let i = 0; i !== item.value ; i = i + direction) {
    const { next, prev } = item;
    prev.next = next;
    next.prev = prev;
    if (direction > 0) {
      item.next = next.next;
      item.prev = next;
      next.next.prev = item;
      next.next = item;
    };
    if (direction < 0) {
      item.prev = prev.prev;
      item.next = prev;
      prev.prev.next = item;
      prev.prev = item;
    };
  };
};
const coordinates =
  valueAfterZero(1000) +
  valueAfterZero(2000) +
  valueAfterZero(3000);
console.log(coordinates);
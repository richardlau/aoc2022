import { readFile } from 'node:fs/promises';

const inputFile = process.argv[ 2 ] ?? 'input';
const input = await readFile(inputFile, { encoding: 'utf8' });
const encrypted = input.split(/\r\n|\r|\n/).map((line) => { return { value: Number(line) }});
const decrypted = Array.from(encrypted);
for (const item of encrypted) {
  const index = decrypted.indexOf(item);
  let newIndex = (index + item.value) % (decrypted.length - 1);
  decrypted.splice(index, 1);
  decrypted.splice(newIndex, 0, item);
};
const zeroIndex = decrypted.findIndex(({ value }) => value === 0);
const coordinates =
  decrypted[ (zeroIndex + 1000) % decrypted.length ].value +
  decrypted[ (zeroIndex + 2000) % decrypted.length ].value +
  decrypted[ (zeroIndex + 3000) % decrypted.length ].value;
console.log(coordinates);
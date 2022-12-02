import { open } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';

const scores = {
  A: { X: 4, Y: 8, Z: 3 },
  B: { X: 1, Y: 5, Z: 9 },
  C: { X: 7, Y: 2, Z: 6 },
};

const inputHandle = await open('input');
const inputStream = inputHandle.createReadStream();
const reader = createInterface({
  input: inputStream,
})
let total = 0;
for await (const line of reader) {
  const [ p1, p2 ] = line.split(' ');
  total += scores[p1][p2];
}
inputHandle.close();
console.log(total);
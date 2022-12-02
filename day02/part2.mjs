import { open } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';

const scores = {
  A: { X: 3, Y: 4, Z: 8 },
  B: { X: 1, Y: 5, Z: 9 },
  C: { X: 2, Y: 6, Z: 7 },
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
import { open } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises'

const inputHandle = await open ('input');
const inputStream = inputHandle.createReadStream();
const reader = createInterface({
  input: inputStream,
})
const calories = [[]];
let i = 0;
for await (const line of reader) {
  if (line === '') {
    calories[++i] = [];
  } else {
    calories[i].push(parseInt(line));
  }
}
const totals = calories.map((x) => {
  return x.reduce((accumulator, n) => {
    return accumulator + n;
  });
});
console.log(totals.sort().at(-1))
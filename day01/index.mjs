import { open } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises'

const totalCalories = (c) => {
  return c.reduce((accumulator, n) =>{
    return accumulator + n;
  });
};

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
const totals = calories.map((x) => totalCalories(x));
const topThree = totals.sort().slice(-3);
console.log(totalCalories(topThree));
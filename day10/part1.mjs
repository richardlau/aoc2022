import { readFile } from 'node:fs/promises';

const sum = (numbers) => numbers.reduce((total, n) => total + n, 0);

const input = await readFile('input', { encoding: 'utf8' });
const rx = [1, 1];
let pc = 1;
for (const instruction of input.split(/\r\n|\r|\n/)) {
  switch (true) {
    case instruction === 'noop':
      rx[pc + 1] = rx[pc];
      pc++;
      break;
    case instruction.startsWith('addx '):
      const v = Number(instruction.slice(5));
      rx[pc + 1] = rx[pc];
      rx[pc + 2] = rx[pc] + v;
      pc += 2;
      break;
  }
};
console.log(sum(rx.map((v, i) => v * i).filter((_, i) => i % 40 - 20 === 0)));
import { readFile } from 'node:fs/promises';

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
for (let cycle = 1; cycle <= 240; cycle++) {
  const x = (cycle - 1) % 40;
  process.stdout.write(Math.abs(x - rx[cycle]) < 2 ? '#' : '.');
  if (x === 39) {
    process.stdout.write('\n');
  }
}
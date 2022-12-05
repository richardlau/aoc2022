import { readFile } from 'node:fs/promises';

const readStacks = (lines) => {
  const stacks = [];
  const labels = lines[lines.length - 1];
  const bottom = lines[lines.length - 2];
  let position = bottom.indexOf('[');
  while (position !== -1) {
    const col = position + 1;
    const n = parseInt(labels.charAt(col));
    stacks[n] = [bottom.charAt(col)];
    for (let l = lines.length - 3 ; l >= 0 && lines[l].charAt(col) !== ' '; l--) {
      stacks[n].unshift(lines[l].charAt(col));
    }
    position = bottom.indexOf('[', col);
  }
  return stacks;
};

const input = await readFile('input', { encoding: 'utf8' });
const [ stacklines, steps ] = input.split('\n\n');
const stacks = readStacks(stacklines.split('\n'));
const moveRE = /move (\d+) from (\d+) to (\d+)/;
for (const step of steps.split('\n')) {
  const [ _, amount, from, to ] = step.match(moveRE);
  const moved = [];
  for (let i = 0; i < amount; i++) {
    moved.push(stacks[from].shift());
  }
  stacks[to].unshift(...moved);
}
console.log(stacks.map((s) => s[0]).join(''));
import { readFile } from 'node:fs/promises';
import * as path from 'node:path';

const dirFilter = ([_, entry]) => entry.type === dirType;
const fileFilter = ([_, entry]) => entry.type === fileType;
const sum = (numbers) => numbers.reduce((total, n) => total + n, 0);

const input = await readFile('input', { encoding: 'utf8' });
const [ fileType, dirType ] = [ Symbol.for('f'), Symbol.for('d') ];
const fileEnt = /(?<size>\d+) (?<name>\w+)/;
const fs = new Map();
let cwd = '/';
fs.set(cwd, { type: dirType });
for (const line of input.split(/\r\n|\r|\n/)) {
  if (line.startsWith('$ cd')) {
    const dir = line.slice(4).trim();
    cwd = path.resolve(cwd, dir);
    fs.set(cwd, { type: dirType, size: 0 });
  } else if (fileEnt.test(line)) {
    const { name, size } = fileEnt.exec(line).groups;
    fs.set(path.resolve(cwd, name), { type: fileType, size: parseInt(size) });
  }
};
const files = [...fs].filter(fileFilter);
console.log(sum([...fs].filter(dirFilter).map(([dir, _]) => {
  const size = sum(files.filter(([name, _]) => {
    return name.startsWith(dir);
  }).map(([_, entry]) => entry.size));
  return size;
}).filter((size) => {
  return size <= 100000;
})));
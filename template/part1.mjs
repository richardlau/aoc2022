import { readFile } from 'node:fs/promises';

const inputFile = process.argv[ 2 ] ?? 'input';
const input = await readFile(inputFile, { encoding: 'utf8' });
console.log(input.split(/\r\n|\r|\n/));
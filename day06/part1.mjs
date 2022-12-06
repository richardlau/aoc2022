import { readFile } from 'node:fs/promises';

const isMarker = (s, start, end) => {
  for (let i = start; i < end - 1; i++) {
    for (let j = i + 1; j < end; j++) {
      if (s.charCodeAt(i) === s.charCodeAt(j)) {
        return false;
      }
    }
  }
  return true;
};

const input = await readFile('input', { encoding: 'utf8' });
const markerLength = 4;
let marker = markerLength;
while (!isMarker(input, marker - markerLength, marker)) {
  marker++
};
console.log(marker);
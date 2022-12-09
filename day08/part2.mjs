import { readFile } from 'node:fs/promises';

const countTreesEast = (grid, x, y) => {
  if (x === grid[y].length - 1) {
    return 0;
  }
  const height = grid[y][x];
  let count = 0;
  for (let i = x + 1; i < grid[y].length; i++) {
    count++;
    if (grid[y][i] >= height) {
      break;
    }
  }
  return count;
};
const countTreesNorth = (grid, x, y) => {
  if (y === 0) {
    return 0;
  }
  const height = grid[y][x];
  let count = 0;
  for (let j = y - 1; j >= 0; j--) {
    count++;
    if (grid[j][x] >= height) {
      break;
    }
  }
  return count;
}
const countTreesWest = (grid, x, y) => {
  if (x === 0) {
    return 0;
  }
  const height = grid[y][x];
  let count = 0;
  for (let i = x - 1; i >= 0; i--) {
    count++;
    if (grid[y][i] >= height) {
      break;
    }
  }
  return count;
};
const countTreesSouth = (grid, x, y) => {
  if (y === grid.length - 1) {
    return 0;
  }
  const height = grid[y][x];
  let count = 0;
  for (let j = y + 1; j < grid.length; j++) {
    count++;
    if (grid[j][x] >= height) {
      break;
    }
  }
  return count;
}

const input = await readFile('input', { encoding: 'utf8' });
const grid = input.split(/\r\n|\r|\n/).map((row) => row.split(''));
const scores = grid.map((r) => r.map((col) => col));
let highest = 0;
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[0].length; x++) {
    const score = countTreesEast(grid, x, y) * countTreesNorth(grid, x, y) *
                  countTreesSouth(grid, x, y) * countTreesWest(grid, x, y);
    scores[y][x] = score;
    if (score > highest) {
      highest = score;
    }
  }
}
console.log(highest);
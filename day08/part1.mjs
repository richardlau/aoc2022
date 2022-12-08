import { readFile } from 'node:fs/promises';

const isVisible = (grid, x, y) => {
  if (x === 0 || y === 0 || x === grid[0].length - 1 || y === grid.length - 1) {
    return true;
  }
  const height = grid[y][x];
  const vertical = grid[0].map((_, i) => grid[i][x]);
  return grid[y].slice(0, x).every((tree) => tree < height) ||
    grid[y].slice(x + 1, grid[0].length).every((tree) => tree < height) ||
    vertical.slice(0, y).every((tree) => tree < height) ||
    vertical.slice(y + 1, vertical.length).every((tree) => tree < height);
};
const sum = (numbers) => numbers.reduce((total, n) => total + n, 0);

const input = await readFile('input', { encoding: 'utf8' });
const grid = input.split(/\r\n|\r|\n/).map((row) => row.split(''));
const visible = grid.map((r) => r.map((col) => col));
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[0].length; x++) {
    visible[y][x] = isVisible(grid, x, y);
  }
}
console.log(sum(visible.map((row) => row.filter((visible) => visible).length)));
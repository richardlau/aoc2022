import { readFile } from 'node:fs/promises';

class Board {
  constructor(input) {
    this.map = input.split(/\r\n|\r|\n/);
    this.direction = 0;
    this.y = 1;
    this.x = this.getMinimumX(this.y);
  };
  getDirection() {
    return this.direction;
  };
  getXY(x, y) {
    return this.map[ y - 1].charAt(x - 1);
  };
  getMinimumX(y) {
    return /[\.#]/.exec(this.map[ y - 1 ]).index + 1;
  };
  getMinimumY(x) {
    let i;
    for (i = 1; ![ '.', '#' ].includes(this.getXY(x, i)); i++);
    return i;
  };
  getMaximumX(y) {
    return this.map[ y - 1 ].length;
  };
  getMaximumY(x) {
    let i;
    for (i = this.map.length; ![ '.', '#' ].includes(this.getXY(x, i)); i--);
    return i;
  };
  getPostion() {
    return [ this.x, this.y ];
  };
  execute(path) {
    for (const [ step ] of path.matchAll(/(\d+|L|R)/g)) {
      switch (step) {
        case 'L':
          this.direction = (this.direction === 0) ? 3 : (this.direction - 1);
          break;
        case 'R':
          this.direction = (this.direction + 1) % 4;
          break;
        default:
          this.moveForward(Number(step));
      };
    }
  };
  moveForward(steps) {
    for (let i = 0; i < steps; i++) {
      const [ dx, dy ] = directions[ this.direction ];
      let newx = this.x + dx;
      let newy = this.y + dy;
      if (newx < this.getMinimumX(this.y)) {
        newx = this.getMaximumX(this.y);
      } else if (newx > this.getMaximumX(this.y)) {
        newx = this.getMinimumX(this.y);
      };
      if (newy < this.getMinimumY(this.x)) {
        newy = this.getMaximumY(this.x);
      } else if (newy > this.getMaximumY(this.x)) {
        newy = this.getMinimumY(this.x);
      };
      if (this.getXY(newx, newy) === '#') {
        break;
      };
      this.x = newx;
      this.y = newy;
    };
  };
};
const directions = [
  [ 1, 0 ],
  [ 0, 1 ],
  [ -1, 0 ],
  [ 0, -1 ],
];

const inputFile = process.argv[ 2 ] ?? 'input';
const input = await readFile(inputFile, { encoding: 'utf8' });
const [ map, path ] = input.split(/\r\n\r\n|\r\r|\n\n/);
const board = new Board(map);

board.execute(path);
const [ x, y ] = board.getPostion();
const password = 1000 * y + 4 * x + board.getDirection();
console.log(password);
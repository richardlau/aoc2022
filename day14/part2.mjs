import { readFile } from 'node:fs/promises';

class CaveMap {
  constructor() {
    this.map = [ [ '.' ] ];
    this.offset = 500;
  };
  #get(x, y) {
    return this.map[ y ][ x - this.offset ];
  };
  #expandX(x, floor = false) {
    if (x > (this.offset + this.map[ 0 ].length - 1)) {
      const xdiff = x - (this.offset + this.map[ 0 ].length - 1);
      this.map = this.map.map((row) => {
        return [ ...row, ...Array(xdiff).fill('.') ];
      });
      if (floor) {
        this.map[this.map.length - 1].fill('#');
      };      
      return;
    };
    if (x >= this.offset) {
      return;
    };
    const xdiff = this.offset - x;
    this.map = this.map.map((row) => {
      return [ ...Array(xdiff).fill('.'), ...row ];
    });
    if (floor) {
      this.map[this.map.length - 1].fill('#');
    };
    this.offset = x;
  };
  #expandY(y) {
    if (y >= this.map.length) {
      const ydiff = y - this.map.length + 1;
      for (let i = 0; i < ydiff ; i++) {
        this.map.push(Array.from(this.map[0]).fill('.'));
      };
    };
  };
  #set(x, y, c) {
    this.map[ y ][ x - this.offset ] = c;
  }
  addFloor() {
    this.#expandY(this.map.length + 1);
    this.map[this.map.length - 1].fill('#');
  }
  addRock(x0, y0, x1, y1) {
    for (const x of [ x0, x1 ]) {
      this.#expandX(x);
    };
    for (const y of [ y0, y1 ]) {
      this.#expandY(y);
    };
    if (y0 === y1) {
      const length = Math.abs(x1 - x0);
      const fromX = Math.min(x0, x1);
      let currX = fromX;
      do {
        this.#set(currX, y0, '#');
      } while (++currX < (fromX + (length + 1)));
    };
    if (x0 === x1) {
      const length = Math.abs(y1 - y0);
      const fromY = Math.min(y0, y1);
      let currY = fromY;
      do {
        this.#set(x0, currY, '#');
      } while (++currY < (fromY + (length + 1)));
      
    };
  };
  dropSand() {
    let x = 500;
    let y = 0;
    while (true) {
      if (x - this.offset - 1 < 0) {
        this.#expandX(x - 1, true);
      };
      if (x - this.offset + 1 >= this.map[ 0 ].length) {
      this.#expandX(x + 1, true);
      };
      if (this.#get(x, y) === 'O') {
        return false;
      };
      if (this.#get(x, y + 1) === '.') {
        y++;
        continue;
      };
      if (this.#get(x - 1, y + 1) === '.') {
        x--;
        y++;
        continue;
      };
      if (this.#get(x + 1, y + 1) === '.') {
        x++;
        y++;
        continue;
      };
      this.#set(x, y, 'O');
      return true;
    };
  };
  toString() {
    return this.map.map((row) => row.join('')).join('\n');
  }
};

const inputFile = process.argv[ 2 ] ?? 'input';
const input = await readFile(inputFile, { encoding: 'utf8' });
const rockDef = /(?<=(\d+),(\d+)) -> (\d+),(\d+)/g;

const caveMap = new CaveMap();
for (const line of input.split(/\r\n|\r|\n/)) {
  for (const rock of line.matchAll(rockDef)) {
    const [ _, x0, y0, x1, y1 ] = rock.map((v) => Number(v));
    caveMap.addRock(x0, y0, x1, y1);
  };
};
caveMap.addFloor();
let rounds = 0;
while (caveMap.dropSand()) {
  rounds++;
};
console.log(rounds);
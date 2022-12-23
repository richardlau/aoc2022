import { readFile } from 'node:fs/promises';

const asArrayXY = (stringXY) => stringXY.split(',').map(Number);
const asStringXY = (arrayXY) => arrayXY.join();
const getBounds = (elves) => elves.reduce(
  ([ [ minx, miny ], [ maxx, maxy ] ], elf) => {
    const [ x, y ] = asArrayXY(elf);
    return [
      [ Math.min(minx, x), Math.min(miny, y) ],
      [ Math.max(maxx, x), Math.max(maxy, y) ],
    ];
  }, [
    [ Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER ],
    [ Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER ],
  ]);
const printElves = (elves) => {
  const [ [ minx, miny ], [ maxx, maxy ] ] = getBounds(elves);
  for (let y = miny; y <= maxy; y++) {
    for (let x = minx; x <= maxx; x++) {
      process.stdout.write(
        (elves.includes(asStringXY([ x, y ]))) ? '#' : '.',
      );
    };
    process.stdout.write('\n');
  };
};
const checks = [
  [ [ 0, -1 ], [ -1, -1 ], [ 1, -1] ],
  [ [ 0, 1 ], [ -1, 1 ], [ 1, 1] ],
  [ [ -1, 0 ], [ -1, -1 ], [ -1, 1 ]],
  [ [ 1, 0 ], [ 1, -1 ], [ 1, 1] ],
];

const inputFile = process.argv[ 2 ] ?? 'input';
const input = await readFile(inputFile, { encoding: 'utf8' });
let elves = input.split(/\r\n|\r|\n/).flatMap((line, i) => {
  return [...line.matchAll(/#/gm)].map(({index}) => asStringXY([ index, i ]));
});

for (let round = 1; true; round++) {
  const proposedMoves = elves.map((elf) => {
    const [ ex, ey ] = asArrayXY(elf);
    const validMoves = [];
    for (const check of checks) {
      const adjacent = check.map(([ dx, dy ]) => asStringXY([ ex + dx, ey + dy ]));
      if (adjacent.every((a) => !elves.includes(a))) {
        validMoves.push(adjacent[ 0 ]);
      };
    };
    if (validMoves.length > 0 && validMoves.length < checks.length) {
      return validMoves[ 0 ];
    };
    return elf;
  });
  let moved = 0;
  elves = proposedMoves.map((move, i) => {
    if (proposedMoves.indexOf(move) === proposedMoves.lastIndexOf(move)) {
      if (move !== elves[ i ]) {
        moved++;
      };
      return move;
    };
    return elves[ i ];
  });
  if (moved === 0) {
    console.log(round);
    break;
  };
  checks.push(checks.shift());
  // console.log(`--- round ${round + 1} ---`)
  // printElves(elves);
};
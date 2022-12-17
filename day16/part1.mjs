import { readFile } from 'node:fs/promises';

const move = (minutesLeft, position, openValves, unopenedValves) => {
  const releasedPerStep = openValves.reduce((total, valve) => {
    const { rate } = valves.get(valve);
    return total + rate;
  }, 0);
  const possibleMoves = unopenedValves.map((target) => {
    return shortestPath(position, target).slice(1);
  }).filter((path) => path.length + 1 < minutesLeft);
  if (possibleMoves.length === 0) {
    // No more valves can be opened. Run clock down.
    return releasedPerStep * minutesLeft;
  };
  const released = possibleMoves.map((nextMove) => {
    const target = nextMove[ nextMove.length - 1 ];
    const total = releasedPerStep * (nextMove.length + 1) +
      move(minutesLeft - nextMove.length - 1,
        target,
        [ ...openValves,  target ],
        unopenedValves.filter((valve) => valve !== target),
      );
    return total;
  });
  return Math.max(...released);
};

const shortestPath = (start, target) => {
  const visited = new Map();
  const unvisited = [ start ];
  let path = [ ];
  while (unvisited.length > 0) {
    const position = unvisited.shift();
    const pathToPosition = visited.get(position) ?? [ position ];
    visited.set(position, pathToPosition);
    const { exits } = valves.get(position);
    for (const exit of exits) {
      const pathToNext = visited.get(exit);
      if (pathToPosition.length + 1 < (pathToNext?.length ?? Number.MAX_SAFE_INTEGER)) {
        visited.set(exit, [ ...pathToPosition, exit ]);
        if (!unvisited.includes(exit)) {
          unvisited.push(exit);
        };
      };
    };
    if (position === target) {
      path = pathToPosition;
      break;
    };
    unvisited.sort((a, b) => visited.get(a).length - visited.get(b.length));
  };
  return path;
};

const scanRE = /Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? ([ ,\w]+)/;
const inputFile = process.argv[ 2 ] ?? 'input';
const input = await readFile(inputFile, { encoding: 'utf8' });
const valves = new Map();
for (const line of input.split(/\r\n|\r|\n/)) {
  const [ _, valve, rate, exits ] = scanRE.exec(line);
  valves.set(valve, { rate: Number(rate), exits: exits.split(/, /) });
};

const candidateValves = [...valves].filter(([ _, { rate }]) => rate > 0)
  .sort(([ _, { rate: a } ], [ __, { rate: b } ]) => b - a).map(([ valve ]) => valve);
console.log(move(30, 'AA', [], candidateValves));
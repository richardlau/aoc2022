import { readFile } from 'node:fs/promises';

const monkeyParser = /(?<monkey>\w+):\s*(?<action>\d+|\w+\s*[\+\-\*\/]\s*\w+)/gm
const operationParser = /(?<number>\d+)|(?<monkey1>\w+)\s*(?<op>[\+\-\*\/])\s*(?<monkey2>\w+)/;
const action = (operationText) => {
  const { monkey1, monkey2, number, op } = operationParser.exec(operationText).groups;
  if (number !== undefined) {
    return () => Number(number);
  };
  switch (op) {
    case '+': return () => getMonkey(monkey1) + getMonkey(monkey2);
    case '-': return () => getMonkey(monkey1) - getMonkey(monkey2);
    case '*': return () => getMonkey(monkey1) * getMonkey(monkey2);
    case '/': return () => getMonkey(monkey1) / getMonkey(monkey2);
    default: console.error(`Unable to parse '${operationText}'`);
  };
};
const getMonkey = (monkey) =>{
  return monkeys.get(monkey)();
};

const inputFile = process.argv[ 2 ] ?? 'input';
const input = await readFile(inputFile, { encoding: 'utf8' });
const monkeys = new Map();
for (const parsed of input.matchAll(monkeyParser)) {
  const monkey = parsed.groups;
  monkeys.set(monkey.monkey, action(monkey.action));
};
console.log(getMonkey('root'));
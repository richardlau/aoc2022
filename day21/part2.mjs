import { readFile } from 'node:fs/promises';

const monkeyParser = /(?<monkey>\w+):\s*(?<action>\d+|\w+\s*[\+\-\*\/]\s*\w+)/gm
const operationParser = /(?<number>\d+)|(?<monkey1>\w+)\s*(?<op>[\+\-\*\/])\s*(?<monkey2>\w+)/;
const getMonkey = (monkey) => {
  return monkeys.get(monkey).action();
};

const inputFile = process.argv[ 2 ] ?? 'input';
const input = await readFile(inputFile, { encoding: 'utf8' });
const monkeys = new Map();
for (const parsed of input.matchAll(monkeyParser)) {
  const monkey = parsed.groups;
  const { monkey1, monkey2, number, op } = operationParser.exec(monkey.action).groups;
  let action;
  if (number !== undefined) {
    // Intercept and ignore value for 'humn'.
    action = () => monkey.monkey === 'humn' ? NaN : Number(number);
  };
  if (action === undefined) {
    switch (op) {
      case '+': action = () => getMonkey(monkey1) + getMonkey(monkey2); break;
      case '-': action = () => getMonkey(monkey1) - getMonkey(monkey2); break;
      case '*': action = () => getMonkey(monkey1) * getMonkey(monkey2); break;
      case '/': action = () => getMonkey(monkey1) / getMonkey(monkey2); break;
      default: console.error(`Unable to parse '${monkey.action}'`);
    };
  };
  monkeys.set(monkey.monkey, {
    action,
    monkey1,
    // Rewrite 'root'. monkey1 = monkey2 is equivalent to 0 = monkey1 - monkey2.
    op: (monkey.monkey === 'root') ? '-' : op,
    monkey2,
  });
};

// Start with value === 0 === 'root', and 'root' === operand1 - operand2.
// Since we set up 'humn' as NaN, evaluating 'operand1 - operand2' will result
// in NaN. We work out which of operand1 or operand2 evaluates to NaN and
// update the "unknown" variable to point to it, also adjusting "value" by
// the other operand based on the mathematical operation. Keep looping until
// the "unsolved" variable is 'humn'.
let unsolved = 'root';
let value = 0;
do {
  const { monkey1, monkey2, op } = monkeys.get(unsolved);
  const number1 = getMonkey(monkey1);
  const number2 = getMonkey(monkey2);
  if (isNaN(number1)) {
    unsolved = monkey1;
    switch (op) {
      case '+': value -= number2; break;
      case '-': value += number2; break;
      case '*': value = value / number2; break;
      case '/': value = number2 * value; break;
      default: console.error(`Unknown operator '${op}'`);
    };
  } else {
    unsolved = monkey2;
    switch (op) {
      case '+': value -= number1; break;
      case '-': value = number1 - value; break;
      case '*': value = value / number1; break;
      case '/': value = number1 / value; break;
      default: console.error(`Unknown operator '${op}'`);
    };
  };
} while (unsolved !== 'humn');
console.log(value);
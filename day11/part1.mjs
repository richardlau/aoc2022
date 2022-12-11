import { readFile } from 'node:fs/promises';

const monkeyParser = new RegExp([
  /Monkey (?<monkey>\d)+:/.source,
  /\s*Starting items:\s*(?<items>[\d ,]+)/.source,
  /\s*Operation:\s*new =(?<operation>.*)/.source,
  /\s*Test: divisible by (?<divisor>\d+)/.source,
  /\s*If true: throw to monkey (?<trueMonkey>\d+)/.source,
  /\s*If false: throw to monkey (?<falseMonkey>\d+)$/.source,
].join(''), 'gm');
const operationParser = /old\s*(?<op>[+\-*])\s*(?<factor>old|\d+)\s*/;
const operation = (operationText) => {
  const { op, factor } = operationParser.exec(operationText).groups;
  switch (op) {
    case '+': return (old) => old + (factor === 'old' ? old : Number(factor));
    case '-': return (old) => old - (factor === 'old' ? old : Number(factor));
    case '*': return (old) => old * (factor === 'old' ? old : Number(factor));
    default: console.error(`Unable to parse '${operationText}'`);
  };
};
const test = (divisor, trueMonkey, falseMonkey) => {
  return (worryLevel) => (worryLevel % divisor) === 0 ? trueMonkey : falseMonkey;
};

const input = await readFile('input', { encoding: 'utf8' });
const monkeys = [];
for (const parsed of input.matchAll(monkeyParser)) {
  const monkey = parsed.groups;
  monkeys[monkey.monkey] = {
    inspected: 0,
    items: [ ...monkey.items.split(', ').map((i) => Number(i)) ],
    operation: operation(monkey.operation),
    test: test(monkey.divisor, monkey.trueMonkey, monkey.falseMonkey),
  };
};
for (let round = 0; round < 20; round++) {
  for (const monkey of monkeys) {
    for (const item of monkey.items) {
      monkey.inspected++;
      const worryLevel = Math.trunc(monkey.operation(item) / 3);
      const throwTo = monkey.test(worryLevel);
      monkeys[throwTo].items.push(worryLevel);
    }
    monkey.items = [];
  }
};
const mostActive = monkeys.map((m) => m.inspected).sort((a, b) => b - a);
const monkeyBusiness = mostActive.slice(0, 2).reduce((total, n) => total * n, 1);
console.log(monkeyBusiness);
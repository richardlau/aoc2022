import { readFile } from 'node:fs/promises';

const product = (array) => {
  return array.reduce((total, d) => total * d, 1);
}
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
  return (worryLevel) => worryLevel % divisor === 0 ? trueMonkey : falseMonkey;
};

const input = await readFile('input', { encoding: 'utf8' });
const monkeys = [];
for (const parsed of input.matchAll(monkeyParser)) {
  const monkey = parsed.groups;
  monkeys[monkey.monkey] = {
    divisor: Number(monkey.divisor),
    inspected: 0,
    items: [ ...monkey.items.split(', ').map((i) => Number(i)) ],
    operation: operation(monkey.operation),
    test: test(Number(monkey.divisor), monkey.trueMonkey, monkey.falseMonkey),
  };
};
const clamp = product(monkeys.map((m) => m.divisor));
for (let round = 0; round < 10000; round++) {
  for (const monkey of monkeys) {
    for (const item of monkey.items) {
      monkey.inspected++;
      const worryLevel = monkey.operation(item) % clamp;
      const throwTo = monkey.test(worryLevel);
      monkeys[throwTo].items.push(worryLevel);
    }
    monkey.items = [];
  }
};
const mostActive = monkeys.map((m) => m.inspected).sort((a, b) => b - a);
const monkeyBusiness = product(mostActive.slice(0, 2));
console.log(monkeyBusiness);
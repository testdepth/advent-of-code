import { Day } from "../day";

type Operator = {
  solution: number;
  equation: number[];
};

function parseInput(input: string): Operator[] {
  let lines = input.split(/\n/g);
  let result: Operator[] = [];

  for (let line of lines) {
    let split = line.split(":");
    result.push({
      solution: Number(split[0]),
      equation: split[1]
        .trim()
        .split(" ")
        .map((input) => Number(input))
        .reverse(),
    });
  }
  return result;
}

class Day7 extends Day {
  constructor() {
    super(7);
  }

  solveForPartOne(input: string): string {
    let parsed = parseInput(input);

    let result = 0;
    let flag = false;

    let solve = (operator: Operator, sum: number | undefined) => {
      if (!operator.equation.length) {
        if (operator.solution === sum && !flag) {
          result += operator.solution;
          flag = true;
        }
        return;
      }
      let cur = operator.equation.pop()!;
      if (sum == undefined) {
        solve(
          { solution: operator.solution, equation: [...operator.equation] },
          cur
        );
      } else {
        //add
        solve(
          { solution: operator.solution, equation: [...operator.equation] },
          cur + sum
        );
        //multiply
        solve(
          { solution: operator.solution, equation: [...operator.equation] },
          cur * sum
        );
      }
    };
    for (let operator of parsed) {
      flag = false;
      solve(operator, undefined);
    }

    return String(result);
  }

  solveForPartTwo(input: string): string {
    let parsed = parseInput(input);

    let result = 0;
    let flag = false;

    let solve = (operator: Operator, sum: number | undefined) => {
      if (!operator.equation.length) {
        if (operator.solution === sum && !flag) {
          result += operator.solution;
          flag = true;
        }
        return;
      }
      let cur = operator.equation.pop()!;
      if (sum == undefined) {
        solve(
          { solution: operator.solution, equation: [...operator.equation] },
          cur
        );
      } else {
        //add
        solve(
          { solution: operator.solution, equation: [...operator.equation] },
          cur + sum
        );
        //multiply
        solve(
          { solution: operator.solution, equation: [...operator.equation] },
          cur * sum
        );

        //concat
        solve(
          { solution: operator.solution, equation: [...operator.equation] },
          Number(String(sum).concat(String(cur)))
        );
      }
    };
    for (let operator of parsed) {
      flag = false;
      solve(operator, undefined);
    }

    return String(result);
  }
}

export default new Day7();

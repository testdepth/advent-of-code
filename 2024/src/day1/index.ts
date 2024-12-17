import { Day } from "../day";

class Day1 extends Day {
  constructor() {
    super(1);
  }

  solveForPartOne(input: string): string {
    // Split on newlines
    const intermediate = input.split("\n");
    var left: number[] = [];
    var right: number[] = [];

    // iterate through and append to left and right arrays
    for (var pair in intermediate) {
      var splitted = intermediate[pair].trim().split(/\s+/);
      left.push(Number(splitted[0]));
      right.push(Number(splitted[1]));
    }

    // sort arrays
    left.sort();
    right.sort();

    var sum = 0;

    while (left.length && right.length) {
      sum += Math.abs(left.pop()! - right!.pop()!);
    }

    return String(sum);
  }

  solveForPartTwo(input: string): string {
    interface Dictionary<T> {
      [Key: number]: T;
    }

    // Split on newlines
    const intermediate = input.split("\n");
    var left: number[] = [];
    //use dictionary objects to count
    var leftCounts: Dictionary<number> = {};
    var rightCounts: Dictionary<number> = {};
    var right: number[] = [];

    // iterate through and append to left and right arrays
    for (var pair in intermediate) {
      let splitted = intermediate[pair].trim().split(/\s+/);
      let leftVal = Number(splitted[0]);
      let rightVal = Number(splitted[1]);

      leftCounts[leftVal] = (leftCounts[leftVal] || 0) + 1;
      rightCounts[rightVal] = (rightCounts[rightVal] || 0) + 1;

      left.push(leftVal);
      right.push(rightVal);
    }

    var sum = 0;

    while (left.length) {
      let leftVal = left.pop()!;

      sum += leftVal * (rightCounts[leftVal] || 0);
    }

    return String(sum);
  }
}

export default new Day1();

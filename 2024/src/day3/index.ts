import { stat } from "fs";
import { Day } from "../day";

class Day3 extends Day {

    constructor(){
        super(3);
    }

    solveForPartOne(input: string): string {
      let regexp = /mul\(\d+,\d+\)/g;

      let filtered = [...input.matchAll(regexp)];

      let sum = filtered.reduce((accumulator, statement) => {
        return accumulator += extractAndMultiply(statement[0])
      }, 0)

      return String(sum);
    }

    solveForPartTwo(input: string): string {
      let regexp = /(mul\(\d+,\d+\)|do\(\)|don't\(\))/g;

      let filtered = [...input.matchAll(regexp)].reverse();
      let sum = 0;
      let enabled = true;

      while(filtered.length) {
        let cur = filtered.pop()![0];
        //identify flag
        if ((cur ===  "don't()" || cur === "do()")) {
          if (cur === 'do()') {
            enabled = true;
          } else {
            enabled = false;
          }
        //do mul if conditions are met
        } else {
          if (enabled) {
            sum += extractAndMultiply(cur);
          }
        }
      }

      return String(sum);
    }
}

export function extractAndMultiply(input: string): number {
  // Assum input is in form mul(/d+, /d+)
  const regexp = /\d+/g

  let nums = [...input.matchAll(regexp)];
  
  return Number(nums[0]) * Number(nums[1]);
}

export default new Day3;
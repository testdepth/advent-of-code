import { Day } from "../day";

class Day11 extends Day {

    constructor(){
        super(11);
    }

    solveForPartOne(input: string): string {
      let stones = input.split(" ");
      let applyRules = (stone: string): string[] => {
        let stoneNumber = Number(stone);

        if (stoneNumber === 0) {
          return ["1"];
        } else if (stone.length % 2 === 0) {
          let half = stone.length / 2;
          return [String(Number(stone.slice(0, half))), String(Number(stone.slice(half, stone.length)))];
        }
        return [String(stoneNumber * 2024)]

      }

      let ruleRound = (stoneList: string[]): string[] => {
        let output: string[] = [];
        for (let stone of stoneList) {
          output.push(...applyRules(stone))
        };
        return output
      }
      
      for (let i = 0; i < 25; i++){
        stones = ruleRound(stones)
        // console.log(stones)
      }
      
      return String(stones.length);
    }

    solveForPartTwo(input: string): string {
      let stones = input.split(" ");

      let applyRules = (stone: string): string[] => {
        let stoneNumber = Number(stone);

        if (stoneNumber === 0) {
          return ["1"];
        } else if (stone.length % 2 === 0) {
          let half = stone.length / 2;
          return [String(Number(stone.slice(0, half))), String(Number(stone.slice(half, stone.length)))];
        }
        return [String(stoneNumber * 2024)]

      }
      let ruleRound = (stoneList: string[]): string[] => {
        let output: string[] = [];
        for (let stone of stoneList) {
          output.push(...applyRules(stone))
        };
        return output
      }
      
      for (let i = 0; i < 75; i++){
        stones = ruleRound(stones)
        // console.log(stones.length)
      }
      
      return String(stones.length);
    }
}

export default new Day11;
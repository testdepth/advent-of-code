import { Day } from "../day";

class Day11 extends Day {

  constructor() {
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

    for (let i = 0; i < 25; i++) {
      stones = ruleRound(stones)
      // console.log(stones)
    }

    return String(stones.length);
  }

  solveForPartTwo(input: string): string {
    let stones = input.split(" ");


    let ruleRound = (stoneList: string[], n: number): number => {
      const cache = new Map();

      let solveStone = (stone: string, n: number): number => {
        if (n === 0) {
          return 1;
        }
        let cacheKey = `${stone},${n}`;
        let save = (result: number) => {
          cache.set(cacheKey, result);
          return result;
        };
        if (cache.has(cacheKey)) {
          return cache.get(cacheKey);
        }

        if (stone === "0") {
          return save(solveStone('1', n - 1));
        }
        if (stone.length % 2 === 0) {
          let middleIndex = stone.length / 2;
          let firstHalf = stone.slice(0, middleIndex);
          let secondHalf = stone.slice(middleIndex);
          return save(
            solveStone(`${parseInt(firstHalf, 10)}`, n - 1) +
            solveStone(`${parseInt(secondHalf, 10)}`, n - 1)
          );
        }
        return save(solveStone(`${parseInt(stone, 10) * 2024}`, n - 1))
      }
      return stones.reduce((sum, stone) => sum + solveStone(stone, n), 0)
    }



    return String(ruleRound(stones, 75));
  }
}

export default new Day11;
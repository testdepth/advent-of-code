import day1 from './index';

describe('On Day 1', () =>{
    it(`part1 is identity function`, ()=>{
        expect(day1.solveForPartOne(`3   4
          4   3
          2   5
          1   3
          3   9
          3   3`)).toBe('11');
    }),
    it(`part2 is identity function`, ()=>{
      expect(day1.solveForPartTwo(`3   4
        4   3
        2   5
        1   3
        3   9
        3   3`)).toBe('31');
  })
});

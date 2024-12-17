import day10 from './index';

describe('On Day 10', () =>{
    it(`part1 is identity function`, ()=>{
      expect(day10.solveForPartOne(`...0...
...1...
...2...
6543456
7.....7
8.....8
9.....9`)).toBe('2');
        expect(day10.solveForPartOne(`89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`)).toBe('36');
expect(day10.solveForPartTwo(`89010123
  78121874
  87430965
  96549874
  45678903
  32019012
  01329801
  10456732`)).toBe('81');
    })
});
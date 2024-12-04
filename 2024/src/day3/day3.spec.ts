import day3 from './index';
import {extractAndMultiply} from './index';

describe('On Day 3', () =>{
    it(`part1 is identity function`, ()=>{
        expect(day3.solveForPartOne('xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))')).toBe('161');
    });
    it(`part2 is identity function`, ()=>{
      expect(day3.solveForPartTwo("xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))")).toBe('48');
  })
});

describe('Helper Functions day 2', () => {
  it('extract and multiply', () => {
    expect(extractAndMultiply('mul(5,5)')).toBe(25);
    expect(extractAndMultiply('mul(25,10)')).toBe(250);
  })
})
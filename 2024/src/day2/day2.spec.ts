import day2 from './index';
import { checkSafety } from './index'

describe('On Day 2', () =>{
    it(`part1 is identity function`, ()=>{
        expect(day2.solveForPartOne(`7 6 4 2 1
        1 2 7 8 9
        9 7 6 2 1
        1 3 2 4 5
        8 6 4 4 1
        1 3 6 7 9`)).toBe('2');
    });
    it('part2 is  identity function', () =>{
      expect(day2.solveForPartTwo(`7 6 4 2 1
        1 2 7 8 9
        9 7 6 2 1
        1 3 2 4 5
        8 6 4 4 1
        1 3 6 7 9
        20, 21, 23, 26, 30, 30
        48 46 47 49 51 54 56
        1 1 2 3 4 5
        1 2 3 4 5 5
        5 1 2 3 4 5
        1 4 3 2 1
        1 6 7 8 9
        1 2 3 4 3
        9 8 7 6 7
        7 10 8 10 11
        29 28 27 25 26 25 22 20`)).toBe('15');
  })
});



describe('Helper Functions Day 2', () => {
  it(`check safety`, () => {
    expect(checkSafety('7 6 4 2 1', false)).toBe(1);
    expect(checkSafety('1 2 7 8 9', false)).toBe(0);
    expect(checkSafety('1 3 2 4 5', false)).toBe(0);
    expect(checkSafety('9 7 6 2 1', false)).toBe(0);
    expect(checkSafety('8 6 4 4 1', false)).toBe(0);
    expect(checkSafety('1 3 6 7 9', false)).toBe(1);
    expect(checkSafety('23 26 27 30 30', false)).toBe(0);
    expect(checkSafety('70 74 77 80 81', false)).toBe(0);
    expect(checkSafety('7 6 4 2 1', true)).toBe(1);
    expect(checkSafety('1 2 7 8 9', true)).toBe(0);
    expect(checkSafety('1 3 2 4 5', true)).toBe(1);
    expect(checkSafety('9 7 6 2 1', true)).toBe(0);
    expect(checkSafety('8 6 4 4 1', true)).toBe(1);
    expect(checkSafety('1 3 6 7 9', true)).toBe(1);
    expect(checkSafety('29 28 27 25 26 25 22 20', true)).toBe(1);
    expect(checkSafety('7 10 8 10 11', true)).toBe(1);
    expect(checkSafety('9 8 7 6 7', true)).toBe(1);
    expect(checkSafety('1 2 3 4 3', true)).toBe(1);
    expect(checkSafety('1 4 3 2 1', true)).toBe(1);
    expect(checkSafety('5 1 2 3 4 5', true)).toBe(1);
    expect(checkSafety('1 2 3 4 5 5', true)).toBe(1);
    expect(checkSafety('1 1 2 3 4 5', true)).toBe(1);
    expect(checkSafety('48 46 47 49 51 54 56', true)).toBe(1);
    expect(checkSafety('20, 21, 23, 26, 30, 30', true)).toBe(1);
  })
})
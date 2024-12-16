import day9 from './index';

describe('On Day 9', () =>{
    it(`part1 is identity function`, ()=>{
        expect(day9.solveForPartOne('2333133121414131402')).toBe('1928');
        expect(day9.solveForPartTwo('2333133121414131402')).toBe('2858');
    })
});
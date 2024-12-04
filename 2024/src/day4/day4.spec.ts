import day4 from "./index";

describe("On Day 4", () => {
  it(`part1 is identity function`, () => {
    expect(
      day4.solveForPartOne(`....XXMAS.
.SAMXMS...
...S..A...
..A.A.MS.X
XMASAMX.MM
X.....XA.A
S.S.S.S.SS
.A.A.A.A.A
..M.M.M.MM
.X.X.XMASX`)
    ).toBe("18");
    expect (
    day4.solveForPartOne(`MMMSXXMASM`)).toBe("1");
    expect (
      day4.solveForPartOne(`..X...
.SAMX.
.A..A.
XMAS.S
.X....`)).toBe("4");
    
  });
  it(`part2 is identity function`, () => {
    expect(
      day4.solveForPartTwo(`MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`)
    ).toBe("9");
    
  });
});

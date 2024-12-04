import { dir } from "console";
import { Day } from "../day";
import { stringTo2D } from "../utils/bfs";

class Day4 extends Day {
  constructor() {
    super(4);
  }

  solveForPartOne(input: string): string {
    // Convert input to 2d array
    let grid = stringTo2D(input);
    //get length/width of grid
    let rows = grid.length;
    let cols = grid[0].length;
    let target = ["X", "M", "A", "S"];
    let result = 0;

    type Level = {
      row: number;
      column: number;
      level: number;
      direction: undefined | number[];
    };

    let found: Map<string, boolean> = new Map();
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        //find X and start search
        if (grid[r][c] === "X") {
          let queue = [];
          let level: Level = {
            row: r,
            column: c,
            level: 0,
            direction: undefined,
          };
          queue.push(level);
          while (queue.length) {
            let cur = queue.pop()!;
            // stop if we're at the end
            if (
              target[cur.level] == "S" &&
              grid[cur.row][cur.column] == "S" &&
              !found.has(
                [
                  cur.row,
                  cur.column,
                  cur.direction![0],
                  cur.direction![1],
                ].toString()
              )
            ) {
              found.set(
                [
                  cur.row,
                  cur.column,
                  cur.direction![0],
                  cur.direction![1],
                ].toString(),
                true
              );
              grid[cur.row - 3 * cur.direction![0]][
                cur.column - 3 * cur.direction![1]
              ] = ".";
              result++;
            } else {
              cur.level += 1;
              let directions = cur.direction
                ? [cur.direction]
                : [
                    [-1, 0],
                    [1, 0],
                    [0, -1],
                    [0, 1],
                    [0, -1],
                    [1, 1],
                    [-1, -1],
                    [1, -1],
                    [-1, 1],
                  ];
              for (let d of directions) {
                let nextR = cur.row + d[0];
                let nextC = cur.column + d[1];

                if (
                  nextR >= 0 &&
                  nextR < rows &&
                  nextC >= 0 &&
                  nextC < cols &&
                  grid[nextR][nextC] === target[cur.level] &&
                  cur.level < 4
                ) {
                  let newLevel: Level = {
                    row: nextR,
                    column: nextC,
                    level: cur.level,
                    direction: d,
                  };
                  queue.push(newLevel);
                }
              }
            }
          }
        }
      }
    }
    return String(result);
  }

solveForPartTwo(input: string): string {
      // Convert input to 2d array
      let grid = stringTo2D(input);
      //get length/width of grid
      let rows = grid.length;
      let cols = grid[0].length;
      let result = 0;

      let check = (r: number, c: number, dir: number[]): string => {
        if (
          r + dir[0] >= 0 &&
          r + dir[0] < rows &&
          c + dir[1] >= 0 &&
          c + dir[1] < cols
        ) {
          return grid[r + dir[0]][c + dir[1]]
        };
        return "."
      };
  
  
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          //find X and start search
          if (grid[r][c] === "A") {
            //left X
            let left = check(r,c, [-1, -1]) + check(r,c,[1,1]);
            // //right X
            let right = check(r, c, [-1,1]) + check(r,c,[1,-1])          

            
            if( (right === "MS" || right === "SM") && (left === "MS" || left === "SM") ) {
              result++;
            }

          }
        }
      }
      return String(result);
}

}
export default new Day4();

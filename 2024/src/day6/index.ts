import { Dir } from "fs";
import { Day } from "../day";
import { stringTo2D } from "../utils/bfs";
import * as crypto from "crypto";

enum Direction {
  UP = "^",
  DOWN = "v",
  LEFT = "<",
  RIGHT = ">",
}

function getEnumKeyByValue(value: string): Direction {
  const entry = Object.entries(Direction).find(([key, val]) => val === value);
  return entry![1];
}

function moveDirection(dir: Direction) {
  switch (dir) {
    case Direction.UP:
      return [-1, 0];
    case Direction.DOWN:
      return [1, 0];
    case Direction.LEFT:
      return [0, -1];
    case Direction.RIGHT:
      return [0, 1];
  }
}

function goRight(dir: Direction) {
  switch (dir) {
    case Direction.UP:
      return Direction.RIGHT;
    case Direction.DOWN:
      return Direction.LEFT;
    case Direction.LEFT:
      return Direction.UP;
    case Direction.RIGHT:
      return Direction.DOWN;
  }
}

class Day6 extends Day {
  constructor() {
    super(6);
  }

  solveForPartOne(input: string): string {
    // Convert input to 2D Grid
    let grid = stringTo2D(input);
    let rows = grid.length;
    let cols = grid[0].length;

    let visited = 0;
    let dfs = (r: number, c: number, dir: Direction) => {
      if (r >= rows || c >= cols || r < 0 || c < 0) {
        return;
      }
      //check if visited, otherewise don't increment
      if (grid[r][c] != "X") {
        visited++;
        grid[r][c] = "X";
      }

      //find next direction to go
      let move = moveDirection(dir);
      if (r + move[0] < rows && c + move[1] < cols) {
        if (grid[r + move[0]][c + move[1]] === "#") {
          dir = goRight(dir);
          move = moveDirection(dir);
        }
      }
      dfs(r + move[0], c + move[1], dir);
    };

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let val = grid[r][c];

        if (Object.entries(Direction).find(([key, val1]) => val1 === val)) {
          dfs(r, c, getEnumKeyByValue(grid[r][c]));
        }
      }
    }

    return String(visited);
  }

  solveForPartTwo(input: string): string {
    // Convert input to 2D Grid
    let grid = stringTo2D(input);
    let rows = grid.length;
    let cols = grid[0].length;
    let start: string;
    let startCoord: number[];
    let startVal: Direction;
    let md5 = (contents: string[]) =>
      crypto.createHash("md5").update(contents.toString()).digest("hex");

    let visited = 0;
    let dfs = (r: number, c: number, dir: Direction) => {
      if (r >= rows || c >= cols || r < 0 || c < 0) {
        return;
      }
      //check if visited, otherewise don't increment
      if (grid[r][c] != "X") {
        grid[r][c] = "X";
      }

      //find next direction to go
      let move = moveDirection(dir);
      if (r + move[0] < rows && c + move[1] < cols) {
        if (grid[r + move[0]][c + move[1]] === "#") {
          dir = goRight(dir);
          move = moveDirection(dir);
        }
      }
      dfs(r + move[0], c + move[1], dir);
    };
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let val = grid[r][c];

        if (Object.entries(Direction).find(([key, val1]) => val1 === val)) {
          startCoord = [r, c];
          startVal = getEnumKeyByValue(grid[r][c]);
          start = md5([String(r), String(c), startVal]);
          dfs(r, c, getEnumKeyByValue(grid[r][c]));
        }
      }
    }
    grid[startCoord![0]][startCoord![1]] = String(startVal!);
    // console.log(grid);

    // Do iterative dfs
    let iterativeDfs = (r: number, c: number, dir: Direction) => {
      let visitedNodes: Record<string, number> = {};

      while (r < rows && c < cols && r >= 0 && c >= 0) {
        let cur = md5([String(r), String(c), dir]);

        if (cur in visitedNodes) {
          if (visitedNodes[cur] > 2) {
            visited++;
            return;
          } else {
            visitedNodes[cur]++;
          }
        } else {
          visitedNodes[cur] = 0;
        }

        let move = moveDirection(dir);
        // console.log(`r: ${r} c ${c} move ${move}`);
        if (
          r + move[0] < rows &&
          c + move[1] < cols &&
          r + move[0] >= 0 &&
          c + move[1] >= 0
        ) {
          if (grid[r + move[0]][c + move[1]] === "#") {
            dir = goRight(dir);
            move = moveDirection(dir);
          }
        }
        r += move[0];
        c += move[1];
      }
    };

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let current = grid[r][c];
        grid[r][c] = "#";
        iterativeDfs(startCoord![0], startCoord![1], startVal!);
        grid[r][c] = current;
      }
    }

    return String(visited);
  }
}

export default new Day6();

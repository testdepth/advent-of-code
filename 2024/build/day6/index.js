"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const day_1 = require("../day");
const bfs_1 = require("../utils/bfs");
const perf_hooks_1 = require("perf_hooks");
var Dir;
(function (Dir) {
    Dir[Dir["Up"] = 0] = "Up";
    Dir[Dir["Down"] = 1] = "Down";
    Dir[Dir["Left"] = 2] = "Left";
    Dir[Dir["Right"] = 3] = "Right";
})(Dir || (Dir = {}));
var Direction;
(function (Direction) {
    Direction["UP"] = "^";
    Direction["DOWN"] = "v";
    Direction["LEFT"] = "<";
    Direction["RIGHT"] = ">";
})(Direction || (Direction = {}));
function getEnumKeyByValue(value) {
    const entry = Object.entries(Direction).find(([key, val]) => val === value);
    return entry[1];
}
function moveDirection(dir) {
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
function goRight(dir) {
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
class Day6 extends day_1.Day {
    constructor() {
        super(6);
    }
    solveForPartOne(input) {
        // Convert input to 2D Grid
        let grid = (0, bfs_1.stringTo2D)(input);
        let rows = grid.length;
        let cols = grid[0].length;
        let visited = 0;
        let dfs = (r, c, dir) => {
            if (r >= rows || c >= cols || r < 0 || c < 0) {
                return;
            }
            //check if visited, otherewise don't increment
            if (grid[r][c] != 'X') {
                visited++;
                grid[r][c] = 'X';
            }
            ;
            //find next direction to go
            let move = moveDirection(dir);
            if (r + move[0] < rows && c + move[1] < cols) {
                if (grid[r + move[0]][c + move[1]] === '#') {
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
    solveForPartTwo(input) {
        const performanceStart = perf_hooks_1.performance.now();
        let parseInput = (input) => {
            const guard = [0, 0];
            let guardFound = false;
            const grid = input.split('\n').map((line, row) => {
                if (!guardFound) {
                    const col = line.indexOf('^');
                    if (col !== -1) {
                        guardFound = true;
                        guard[0] = row;
                        guard[1] = col;
                    }
                }
                return line.split('');
            });
            return { grid, guard };
        };
        const { grid, guard } = parseInput(input);
        let dir = Dir.Up;
        const candidates = new Set();
        const visited = new Set([`${guard.join('_')}_${dir}`]);
        // walk it once and keep track of the tiles visited and what obstructions exist
        this.walkPath([...guard], dir, grid, visited);
        // go backwards down the visited path and test to see what happens if we add a new obstruction
        const visitedTiles = [...visited.values()];
        for (let i = visitedTiles.length - 1; i > 0; i--) {
            const [row, col] = visitedTiles[i].split('_').map(n => +n);
            // turn that tile into an obstruction
            const prevTileVal = grid[row][col];
            if (prevTileVal === '^') {
                continue;
            }
            grid[row][col] = '#';
            // put the guard to be one step behind the new obstruction. No need to walk the whole path again.
            const [guardRow, guardCol, dir] = visitedTiles[i - 1].split('_').map(n => +n);
            // clone the visited tiles and pull out anything after the new obstacle
            const newVisited = new Set(visitedTiles.slice(0, i));
            // if this new obstacle is in a spot that we would already have walked by earlier, it's not valid
            if (newVisited.has(`${row}_${col}_${Dir.Up}`) || newVisited.has(`${row}_${col}_${Dir.Down}`) || newVisited.has(`${row}_${col}_${Dir.Left}`) || newVisited.has(`${row}_${col}_${Dir.Right}`)) {
                // put it back how it was
                grid[row][col] = prevTileVal;
                continue;
            }
            // walk this new path and see if a cycle emerges
            const cycle = this.walkPath([guardRow, guardCol], dir, grid, newVisited);
            // put it back how it was
            grid[row][col] = prevTileVal;
            if (cycle) {
                candidates.add(`${row}_${col}`);
            }
        }
        return (String(candidates.size));
    }
    walkPath(guard, initDir, grid, visited) {
        let dir = initDir;
        while (true) {
            let [nextRow, nextCol] = guard;
            switch (dir) {
                case Dir.Up:
                    nextRow--;
                    break;
                case Dir.Down:
                    nextRow++;
                    break;
                case Dir.Left:
                    nextCol--;
                    break;
                case Dir.Right:
                    nextCol++;
                    break;
            }
            // gone off grid
            if (nextRow < 0 || nextRow >= grid.length || nextCol < 0 || nextCol >= grid[0].length) {
                break;
                // we've found a cycle
            }
            else if (visited.has(`${nextRow}_${nextCol}_${dir}`)) {
                return true;
                // hit an obstacle, rotate 90 deg
            }
            else if (grid[nextRow][nextCol] === '#') {
                switch (dir) {
                    case Dir.Up:
                        dir = Dir.Right;
                        break;
                    case Dir.Down:
                        dir = Dir.Left;
                        break;
                    case Dir.Left:
                        dir = Dir.Up;
                        break;
                    case Dir.Right:
                        dir = Dir.Down;
                        break;
                }
                // nothing there. Keep going.
            }
            else {
                guard[0] = nextRow;
                guard[1] = nextCol;
                visited.add(`${guard.join('_')}_${dir}`);
            }
        }
        return false;
    }
}
//     // Convert input to 2D Grid
//     let grid = stringTo2D(input);
//     let rows = grid.length;
//     let cols = grid[0].length;
//     let start: string;
//     let startCoord: number[];
//     let startVal: Direction;
//     let md5 = (contents: string[]) => crypto.createHash('md5').update(contents.toString()).digest("hex");
//     let visited = 0;
//       let dfs = (r: number, c: number, dir: Direction) => {
//       if(r >= rows || c >= cols || r < 0 || c < 0){
//         return ;
//       }
//       //check if visited, otherewise don't increment
//       if (grid[r][c] != 'X'){
//         grid[r][c] = 'X';
//       };
//       //find next direction to go
//       let move = moveDirection(dir);
//       if (r+move[0] < rows && c+move[1] < cols) {
//         if(grid[r+move[0]][c+move[1]] === '#') {
//           dir = goRight(dir);
//           move = moveDirection(dir);
//         }
//       }
//       dfs(r+move[0], c+move[1], dir);
//     }
//     for (let r = 0; r < rows; r++) {
//       for (let c = 0; c < cols; c++) {
//         let val = grid[r][c];
//         if (Object.entries(Direction).find(([key, val1]) => val1 === val)){
//           startCoord = [r,c]
//           startVal = getEnumKeyByValue(grid[r][c])
//           start = md5([String(r), String(c), startVal])
//           dfs(r,c, getEnumKeyByValue(grid[r][c]));
//         }
//       }
//     }
//     grid[startCoord![0]][startCoord![1]] = String(startVal!);
//     // console.log(grid);
//     // Do iterative dfs
//     let iterativeDfs = (r: number, c: number, dir: Direction) => {
//       let visitedNodes: Record<string, number> = {};
//       while (r < rows && c < cols && r >= 0 && c >= 0) {
//         let cur = md5([String(r), String(c), dir]);
//         if (cur in visitedNodes) {
//           if (visitedNodes[cur] > 2 ){
//             visited++;
//             return;
//           } else {
//             visitedNodes[cur]++;
//           }
//         } else {
//             visitedNodes[cur] = 0;
//         }
//         let move = moveDirection(dir);
//         // console.log(`r: ${r} c ${c} move ${move}`);
//         if (r+move[0] < rows && c+move[1] < cols && r+move[0] >=0 && c+move[1] >= 0) {
//           if(grid[r+move[0]][c+move[1]] === '#') {
//             dir = goRight(dir);
//             move = moveDirection(dir);
//           }
//         }
//         r+=move[0];
//         c+=move[1];
//       }
//     }
//     for (let r = 0; r < rows; r++) {
//       for (let c = 0; c < cols; c++) {
//         let current = grid[r][c];
//           grid[r][c] = "#";
//           iterativeDfs(startCoord![0], startCoord![1], startVal!)
//           grid[r][c] = current;
//       }
//     }
//     return String(visited);
//     }
// }
exports.default = new Day6;
//# sourceMappingURL=index.js.map
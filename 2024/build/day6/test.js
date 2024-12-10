"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const perf_hooks_1 = require("perf_hooks");
var Dir;
(function (Dir) {
    Dir[Dir["Up"] = 0] = "Up";
    Dir[Dir["Down"] = 1] = "Down";
    Dir[Dir["Left"] = 2] = "Left";
    Dir[Dir["Right"] = 3] = "Right";
})(Dir || (Dir = {}));
class Solution {
    sampleInput = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;
    parseInput(input) {
        if (!input) {
            input = this.sampleInput;
        }
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
    }
    solve(input) {
        const performanceStart = perf_hooks_1.performance.now();
        const { grid, guard } = this.parseInput(input);
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
        return {
            performance: perf_hooks_1.performance.now() - performanceStart,
            result: candidates.size
        };
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
exports.default = Solution;
//# sourceMappingURL=test.js.map
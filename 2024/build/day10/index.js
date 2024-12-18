"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const day_1 = require("../day");
const bfs_1 = require("../utils/bfs");
class Day10 extends day_1.Day {
    constructor() {
        super(10);
    }
    solveForPartOne(input) {
        let result = 0;
        //ingest grid
        let grid = (0, bfs_1.stringTo2D)(input);
        let rows = grid.length;
        let cols = grid[0].length;
        let moves = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
        ];
        let bfs = (row, col) => {
            let queue = [];
            let visited = new Set();
            //populate the queue
            queue.push({ row: row, col: col, level: 0 });
            visited.add(JSON.stringify({ row: row, col: col, level: 0 }));
            while (queue.length) {
                let cur = queue.shift();
                if (cur.level === 9) {
                    result++;
                }
                for (let coord of moves) {
                    let nextR = cur.row + coord[0];
                    let nextC = cur.col + coord[1];
                    let next = { row: nextR, col: nextC, level: cur.level + 1 };
                    let has = visited.has(JSON.stringify(next));
                    if (nextR >= 0 &&
                        nextR < rows &&
                        nextC >= 0 &&
                        nextC < cols &&
                        grid[nextR][nextC] === String(cur.level + 1) &&
                        !visited.has(JSON.stringify(next))) {
                        queue.push(next);
                        visited.add(JSON.stringify(next));
                    }
                }
            }
        };
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (grid[i][j] === "0") {
                    bfs(i, j);
                }
            }
        }
        return String(result);
    }
    solveForPartTwo(input) {
        let result = 0;
        //ingest grid
        let grid = (0, bfs_1.stringTo2D)(input);
        let rows = grid.length;
        let cols = grid[0].length;
        let moves = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
        ];
        let bfs = (row, col) => {
            let queue = [];
            //populate the queue
            queue.push({ row: row, col: col, level: 0 });
            while (queue.length) {
                let cur = queue.shift();
                if (cur.level === 9) {
                    result++;
                }
                for (let coord of moves) {
                    let nextR = cur.row + coord[0];
                    let nextC = cur.col + coord[1];
                    let next = { row: nextR, col: nextC, level: cur.level + 1 };
                    if (nextR >= 0 &&
                        nextR < rows &&
                        nextC >= 0 &&
                        nextC < cols &&
                        grid[nextR][nextC] === String(cur.level + 1)) {
                        queue.push(next);
                    }
                }
            }
        };
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (grid[i][j] === "0") {
                    bfs(i, j);
                }
            }
        }
        return String(result);
    }
}
exports.default = new Day10();
//# sourceMappingURL=index.js.map
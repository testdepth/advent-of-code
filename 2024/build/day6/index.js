"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const day_1 = require("../day");
const bfs_1 = require("../utils/bfs");
const crypto = __importStar(require("crypto"));
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
    solveForPartTwo(input) {
        // Convert input to 2D Grid
        let grid = (0, bfs_1.stringTo2D)(input);
        let rows = grid.length;
        let cols = grid[0].length;
        let start;
        let startCoord;
        let startVal;
        let md5 = (contents) => crypto.createHash("md5").update(contents.toString()).digest("hex");
        let visited = 0;
        let dfs = (r, c, dir) => {
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
        grid[startCoord[0]][startCoord[1]] = String(startVal);
        // console.log(grid);
        // Do iterative dfs
        let iterativeDfs = (r, c, dir) => {
            let visitedNodes = {};
            while (r < rows && c < cols && r >= 0 && c >= 0) {
                let cur = md5([String(r), String(c), dir]);
                if (cur in visitedNodes) {
                    if (visitedNodes[cur] > 2) {
                        visited++;
                        return;
                    }
                    else {
                        visitedNodes[cur]++;
                    }
                }
                else {
                    visitedNodes[cur] = 0;
                }
                let move = moveDirection(dir);
                // console.log(`r: ${r} c ${c} move ${move}`);
                if (r + move[0] < rows &&
                    c + move[1] < cols &&
                    r + move[0] >= 0 &&
                    c + move[1] >= 0) {
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
                iterativeDfs(startCoord[0], startCoord[1], startVal);
                grid[r][c] = current;
            }
        }
        return String(visited);
    }
}
exports.default = new Day6();
//# sourceMappingURL=index.js.map
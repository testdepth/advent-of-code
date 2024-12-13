"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const day_1 = require("../day");
const bfs_1 = require("../utils/bfs");
function printGrid(grid) {
    let result = "";
    for (let r of grid) {
        for (let s of r) {
            result += s;
        }
        result += '\n';
    }
    return result;
}
function getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}
function getSlope(p1, p2) {
    return { x: -(p2.x - p1.x), y: -(p2.y - p1.y) };
}
function onGrid(point, rows, cols) {
    return (point.x >= 0 && point.y >= 0 && point.x < rows && point.y < cols);
}
class Day8 extends day_1.Day {
    constructor() {
        super(8);
    }
    solveForPartOne(input) {
        let grid = (0, bfs_1.stringTo2D)(input);
        let rows = grid.length;
        let cols = grid[0].length;
        let antennas = {};
        let antinodes = new Set();
        // Collect antennas
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (grid[r][c].match(/(\d|\w)/g)) {
                    let point = { x: r, y: c };
                    if (antennas[grid[r][c]] === undefined) {
                        antennas[grid[r][c]] = [point];
                    }
                    else {
                        antennas[grid[r][c]].push({ x: r, y: c });
                    }
                }
            }
        }
        for (let val of Object.values(antennas)) {
            while (val.length) {
                let p1 = val.pop();
                for (let p2 of val) {
                    let slope = getSlope(p1, p2);
                    let leftPoint;
                    let rightPoint;
                    let leftString;
                    let rightString;
                    if (p1.x < p2.x) {
                        leftPoint = [(p1.x - slope.x), (p1.y - slope.y)];
                        leftString = `x${(p1.x - slope.x)}y${(p1.y - slope.y)}`;
                        rightPoint = [(p2.x + slope.x), (p2.y + slope.y)];
                        rightString = `x${(p2.x + slope.x)}y${(p2.y + slope.y)}`;
                    }
                    else {
                        rightPoint = [(p1.x + slope.x), (p1.y + slope.y)];
                        rightString = `x${(p1.x + slope.x)}y${(p1.y + slope.y)}`;
                        leftPoint = [(p2.x - slope.x), (p2.y - slope.y)];
                        leftString = `x${(p2.x - slope.x)}y${(p2.y - slope.y)}`;
                    }
                    console.log(`lp ${leftPoint} rp ${rightPoint}`);
                    if (onGrid({ x: leftPoint[0], y: leftPoint[1] }, rows, cols)) {
                        grid[leftPoint[0]][leftPoint[1]] = '#';
                        antinodes.add(leftString);
                    }
                    if (onGrid({ x: rightPoint[0], y: rightPoint[1] }, rows, cols)) {
                        grid[rightPoint[0]][rightPoint[1]] = '#';
                        antinodes.add(rightString);
                    }
                }
            }
        }
        // console.log(antinodes);
        // console.log(printGrid(grid))
        return String(antinodes.size);
    }
    solveForPartTwo(input) {
        let grid = (0, bfs_1.stringTo2D)(input);
        let rows = grid.length;
        let cols = grid[0].length;
        let antennas = {};
        let antinodes = new Set();
        // Collect antennas
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (grid[r][c].match(/(\d|\w)/g)) {
                    let point = { x: r, y: c };
                    if (antennas[grid[r][c]] === undefined) {
                        antennas[grid[r][c]] = [point];
                    }
                    else {
                        antennas[grid[r][c]].push({ x: r, y: c });
                    }
                }
            }
        }
        for (let val of Object.values(antennas)) {
            if (val.length > 1) {
                for (let p of val) {
                    antinodes.add(`x${p.x}y${(p.y)}`);
                }
            }
            while (val.length) {
                let p1 = val.pop();
                for (let p2 of val) {
                    let slope = getSlope(p1, p2);
                    let leftPoint;
                    let rightPoint;
                    let leftString;
                    let rightString;
                    if (p1.x < p2.x) {
                        leftPoint = [(p1.x - slope.x), (p1.y - slope.y)];
                        leftString = `x${leftPoint[0]}y${(leftPoint[1])}`;
                        rightPoint = [(p2.x + slope.x), (p2.y + slope.y)];
                        rightString = `x${rightPoint[0]}y${(rightPoint[1])}`;
                    }
                    else {
                        rightPoint = [(p1.x + slope.x), (p1.y + slope.y)];
                        rightString = `x${rightPoint[0]}y${(rightPoint[1])}`;
                        leftPoint = [(p2.x - slope.x), (p2.y - slope.y)];
                        leftString = `x${leftPoint[0]}y${(leftPoint[1])}`;
                    }
                    console.log(`lp ${leftPoint} rp ${rightPoint}`);
                    while (onGrid({ x: leftPoint[0], y: leftPoint[1] }, rows, cols)) {
                        grid[leftPoint[0]][leftPoint[1]] = '#';
                        antinodes.add(leftString);
                        leftPoint[0] = leftPoint[0] - slope.x;
                        leftPoint[1] = leftPoint[1] - slope.y;
                        leftString = `x${leftPoint[0]}y${(leftPoint[1])}`;
                    }
                    while (onGrid({ x: rightPoint[0], y: rightPoint[1] }, rows, cols)) {
                        grid[rightPoint[0]][rightPoint[1]] = '#';
                        antinodes.add(rightString);
                        rightPoint[0] = rightPoint[0] + slope.x;
                        rightPoint[1] = rightPoint[1] + slope.y;
                        rightString = `x${rightPoint[0]}y${(rightPoint[1])}`;
                    }
                }
            }
        }
        console.log(antinodes);
        console.log(printGrid(grid));
        return String(antinodes.size);
    }
}
exports.default = new Day8();
//# sourceMappingURL=index.js.map
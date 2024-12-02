"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Day = void 0;
const fs_1 = __importDefault(require("fs"));
class Day {
    id;
    constructor(id) {
        this.id = id;
    }
    async partOne() {
        const content = await fs_1.default.promises.readFile(`./inputs/day${this.id}/part1.txt`);
        const result = this.solveForPartOne(content.toString());
        return result;
    }
    async partTwo() {
        const content = await fs_1.default.promises.readFile(`./inputs/day${this.id}/part2.txt`);
        const result = this.solveForPartTwo(content.toString());
        return result;
    }
}
exports.Day = Day;

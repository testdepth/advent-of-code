"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const day_1 = require("../day");
class Day11 extends day_1.Day {
    constructor() {
        super(11);
    }
    solveForPartOne(input) {
        let stones = input.split(" ");
        let applyRules = (stone) => {
            let stoneNumber = Number(stone);
            if (stoneNumber === 0) {
                return ["1"];
            }
            else if (stone.length % 2 === 0) {
                let half = stone.length / 2;
                return [String(Number(stone.slice(0, half))), String(Number(stone.slice(half, stone.length)))];
            }
            return [String(stoneNumber * 2024)];
        };
        let ruleRound = (stoneList) => {
            let output = [];
            for (let stone of stoneList) {
                output.push(...applyRules(stone));
            }
            ;
            return output;
        };
        for (let i = 0; i < 25; i++) {
            stones = ruleRound(stones);
            // console.log(stones)
        }
        return String(stones.length);
    }
    solveForPartTwo(input) {
        let stones = input.split(" ");
        const cache = new Map();
        // Track growth patterns
        const growthHistory = [stones.length];
        const ratioHistory = [];
        let applyRules = (stone) => {
            const cached = cache.get(stone);
            if (cached)
                return cached;
            const stoneNumber = Number(stone);
            let result;
            if (stoneNumber === 0) {
                result = ["1"];
            }
            else if (stone.length % 2 === 0) {
                const half = stone.length / 2;
                result = [
                    String(Number(stone.slice(0, half))),
                    String(Number(stone.slice(half)))
                ];
            }
            else {
                result = [String(stoneNumber * 2024)];
            }
            cache.set(stone, result);
            return result;
        };
        let ruleRound = (stoneList) => {
            const output = [];
            for (const stone of stoneList) {
                const rules = applyRules(stone);
                output.push(...rules);
            }
            return output;
        };
        try {
            for (let i = 0; i < 20; i++) { // Reduced iterations to analyze pattern
                stones = ruleRound(stones);
                growthHistory.push(stones.length);
                // Calculate growth ratio
                if (i > 0) {
                    const ratio = stones.length / growthHistory[i];
                    ratioHistory.push(ratio);
                    console.log(`Iteration ${i}: Size=${stones.length}, Ratio=${ratio}`);
                }
                // If we detect a stable pattern, we can project forward
                if (ratioHistory.length >= 3) {
                    const lastThreeRatios = ratioHistory.slice(-3);
                    if (lastThreeRatios.every(r => Math.abs(r - lastThreeRatios[0]) < 0.0001)) {
                        console.log("Stable ratio detected:", lastThreeRatios[0]);
                        // Project forward to iteration 75
                        const remainingIterations = 75 - i - 1;
                        const projectedSize = stones.length * Math.pow(lastThreeRatios[0], remainingIterations);
                        return `Projected size after 75 iterations: ${Math.floor(projectedSize)}`;
                    }
                }
            }
            return String(stones.length);
        }
        catch (error) {
            return `Error analyzing growth pattern: ${stones.length} stones`;
        }
    }
}
exports.default = new Day11;
//# sourceMappingURL=index.js.map
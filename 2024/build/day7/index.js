"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const day_1 = require("../day");
function parseInput(input) {
    let lines = input.split(/\n/g);
    let result = [];
    for (let line of lines) {
        let split = line.split(":");
        result.push({
            solution: Number(split[0]),
            equation: split[1].trim().split(" ").map((input) => Number(input)).reverse(),
        });
    }
    return result;
}
class Day7 extends day_1.Day {
    constructor() {
        super(7);
    }
    solveForPartOne(input) {
        let parsed = parseInput(input);
        let result = 0;
        let flag = false;
        let solve = (operator, sum) => {
            if (!operator.equation.length) {
                if (operator.solution === sum && !flag) {
                    result += operator.solution;
                    flag = true;
                }
                return;
            }
            let cur = operator.equation.pop();
            if (sum == undefined) {
                solve({ solution: operator.solution, equation: [...operator.equation] }, cur);
            }
            else {
                //add
                solve({ solution: operator.solution, equation: [...operator.equation] }, cur + sum);
                //multiply
                solve({ solution: operator.solution, equation: [...operator.equation] }, cur * sum);
            }
        };
        for (let operator of parsed) {
            flag = false;
            solve(operator, undefined);
        }
        return (String(result));
    }
    solveForPartTwo(input) {
        let parsed = parseInput(input);
        let result = 0;
        let flag = false;
        let solve = (operator, sum) => {
            if (!operator.equation.length) {
                if (operator.solution === sum && !flag) {
                    result += operator.solution;
                    flag = true;
                }
                return;
            }
            let cur = operator.equation.pop();
            if (sum == undefined) {
                solve({ solution: operator.solution, equation: [...operator.equation] }, cur);
            }
            else {
                //add
                solve({ solution: operator.solution, equation: [...operator.equation] }, cur + sum);
                //multiply
                solve({ solution: operator.solution, equation: [...operator.equation] }, cur * sum);
                //concat
                solve({ solution: operator.solution, equation: [...operator.equation] }, Number(String(sum).concat(String(cur))));
            }
        };
        for (let operator of parsed) {
            flag = false;
            solve(operator, undefined);
        }
        return (String(result));
    }
}
exports.default = new Day7;
//# sourceMappingURL=index.js.map
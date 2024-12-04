"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const day_1 = require("../day");
class Day1 extends day_1.Day {
    constructor() {
        super(1);
    }
    solveForPartOne(input) {
        // Split on newlines
        const intermediate = input.split('\n');
        var left = [];
        var right = [];
        // iterate through and append to left and right arrays
        for (var pair in intermediate) {
            var splitted = intermediate[pair].trim().split(/\s+/);
            left.push(Number(splitted[0]));
            right.push(Number(splitted[1]));
        }
        ;
        // sort arrays
        left.sort();
        right.sort();
        var sum = 0;
        while (left.length && right.length) {
            sum += Math.abs(left.pop() - right.pop());
        }
        return String(sum);
    }
    solveForPartTwo(input) {
        // Split on newlines
        const intermediate = input.split('\n');
        var left = [];
        //use dictionary objects to count
        var leftCounts = {};
        var rightCounts = {};
        var right = [];
        // iterate through and append to left and right arrays
        for (var pair in intermediate) {
            let splitted = intermediate[pair].trim().split(/\s+/);
            let leftVal = Number(splitted[0]);
            let rightVal = Number(splitted[1]);
            leftCounts[leftVal] = (leftCounts[leftVal] || 0) + 1;
            rightCounts[rightVal] = (rightCounts[rightVal] || 0) + 1;
            left.push(leftVal);
            right.push(rightVal);
        }
        ;
        var sum = 0;
        while (left.length) {
            let leftVal = left.pop();
            sum += (leftVal * (rightCounts[leftVal] || 0));
        }
        ;
        return String(sum);
    }
}
exports.default = new Day1;
//# sourceMappingURL=index.js.map
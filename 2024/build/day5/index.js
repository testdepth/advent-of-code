"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const day_1 = require("../day");
class Day5 extends day_1.Day {
    constructor() {
        super(5);
    }
    solveForPartOne(input) {
        //Split rules and updates
        let rules;
        let updates;
        let result = 0;
        [rules, updates] = input.split(/\n\n/g).map((val) => {
            return val.split(/\n/g);
        });
        let splitUpdates = updates.map((val) => { return val.split(","); });
        let splitRules = rules.map((val) => { return val.split("|"); });
        // iterate throgh updates
        for (let update of splitUpdates) {
            let length = update.length;
            let passing = true;
            for (let rule of splitRules) {
                let cur;
                cur = rule[0];
                let curIndex;
                if ((curIndex = update.indexOf(cur)) != -1) {
                    let firstHalf;
                    let secondHalf;
                    firstHalf = update.slice(0, curIndex);
                    secondHalf = update.slice(curIndex);
                    if (firstHalf.includes(rule[1]) && !secondHalf.includes(rule[1])) {
                        passing = false;
                        break;
                    }
                }
                ;
            }
            ;
            if (passing) {
                let middle = Math.floor(length / 2);
                result += Number(update[middle]);
            }
            passing = true;
        }
        ;
        return String(result);
    }
    solveForPartTwo(input) {
        //Split rules and updates
        let rules;
        let updates;
        let result = 0;
        [rules, updates] = input.split(/\n\n/g).map((val) => {
            return val.split(/\n/g);
        });
        let sortFn = (a, b) => {
            for (let rule of splitRules) {
                if (rule.includes(a)) {
                    if (rule.includes(b)) {
                        if (rule[0] === a) {
                            return (-1);
                        }
                        ;
                        return (1);
                    }
                }
            }
            return (0);
        };
        let splitUpdates = updates.map((val) => { return val.split(","); });
        let splitRules = rules.map((val) => { return val.split("|"); });
        // iterate throgh updates
        for (let update of splitUpdates) {
            let sorted = [...update].sort(sortFn);
            if ([...sorted].toString() != [...update].toString()) {
                result += Number(sorted[Math.floor(sorted.length / 2)]);
            }
        }
        ;
        return String(result);
    }
}
exports.default = new Day5;
//# sourceMappingURL=index.js.map
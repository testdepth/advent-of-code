"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const day_1 = require("../day");
function dotArray(n) {
    let result = [];
    for (let i = 0; i < n; i++) {
        result.push(".");
    }
    return result;
}
class Day9 extends day_1.Day {
    constructor() {
        super(9);
    }
    solveForPartOne(input) {
        let counter = 0;
        let arrayInput = input.split("").reverse();
        let map = [];
        while (arrayInput.length) {
            let file = Number(arrayInput.pop());
            for (let i = 0; i < file; i++) {
                map.push(String(counter));
            }
            counter++;
            let space = Number(arrayInput.pop());
            for (let i = 0; i < space; i++) {
                map.push(".");
            }
        }
        for (let i = 0; i < map.length; i++) {
            if (map[i] === ".") {
                let next = map.pop();
                while (!next?.match(/\d|\w/g)) {
                    next = map.pop();
                }
                map[i] = next;
            }
        }
        let result = 0;
        for (let i = 0; i < map.length; i++) {
            result += i * Number(map[i]);
        }
        return String(result);
    }
    solveForPartTwo(input) {
        let counter = 0;
        let arrayInput = input.split("").reverse();
        let map = [];
        while (arrayInput.length) {
            let file = Number(arrayInput.pop());
            let fileArray = [];
            for (let i = 0; i < file; i++) {
                fileArray.push(String(counter));
            }
            map.push(fileArray);
            counter++;
            let space = Number(arrayInput.pop());
            if (space > 0) {
                let spaceArray = [];
                for (let i = 0; i < space; i++) {
                    spaceArray.push(".");
                }
                map.push(spaceArray);
            }
        }
        //iterate backwards
        for (let i = map.length - 1; i >= 0; i--) {
            if (map[i][0].match(/\d/g)) {
                let fileLen = map[i].length;
                for (let j = 0; j < map.length && j <= i; j++) {
                    let test = map[j][0];
                    if (map[j][0] === ".") {
                        let dotLength = map[j].length;
                        let diff = dotLength - fileLen;
                        if (dotLength >= fileLen) {
                            //modify array with files in place
                            map[j] = [...map[i]];
                            map[i] = dotArray(fileLen);
                            if (diff > 0) {
                                map.splice(j + 1, 0, dotArray(diff));
                                i += 1;
                            }
                            break;
                        }
                    }
                }
            }
        }
        //deconstruct array, and then add
        let final = [];
        for (let item of map) {
            final = final.concat(item);
        }
        counter = 0;
        for (let i = 0; i < final.length; i++) {
            if (final[i] != ".") {
                let inc = i * Number(final[i]);
                counter += inc;
            }
        }
        return String(counter);
    }
}
exports.default = new Day9();
//# sourceMappingURL=index.js.map
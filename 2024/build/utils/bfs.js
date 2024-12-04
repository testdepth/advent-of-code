"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringTo2D = void 0;
function stringTo2D(input) {
    //split on newlines
    let result = [];
    let lines = input.split('\n');
    for (let line of lines) {
        result.push(line.trim().split(''));
    }
    return result;
}
exports.stringTo2D = stringTo2D;
//For now dont use template, migrate here if needed later in challenge
// export function bfs(grid: string[][], x: number, y: number)
//# sourceMappingURL=bfs.js.map
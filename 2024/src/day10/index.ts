import { Day } from "../day";
import { stringTo2D } from "../utils/bfs";

type Move = {
  row: number;
  col: number;
  level: number
}

class Day10 extends Day {

    constructor(){
        super(10);
    }

    solveForPartOne(input: string): string {
      let result = 0;
      
      //ingest grid
      let grid = stringTo2D(input);
      let rows = grid.length;
      let cols = grid[0].length;

      let moves = [[1,0],[-1,0], [0,1], [0,-1]]

      let bfs = (row: number, col: number) => {
        let queue: Move[] = [];
        let visited: Set<String> = new Set();

        //populate the queue 
        queue.push({row: row, col: col, level: 0});
        visited.add(JSON.stringify({row: row, col: col, level: 0}));
        
        while (queue.length){
          let cur = queue.shift()!;
          if (cur.level === 9){
            result++;
          }
          for (let coord of moves) {
            let nextR = cur.row + coord[0];
            let nextC = cur.col + coord[1];
            let next = {row: nextR, col: nextC, level: cur.level+1}
            let has = visited.has(JSON.stringify(next));
            if (nextR >= 0 && nextR < rows && nextC >=0 && nextC < cols && grid[nextR][nextC] === String(cur.level+1) && !visited.has(JSON.stringify(next))) {
              queue.push(next);
              visited.add(JSON.stringify(next));
            }
          }
        }
      }

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++){
          if (grid[i][j] === "0") {
            bfs(i,j);
          }
        }
      }
      
      return String(result);
    }

    solveForPartTwo(input: string): string {
      let result = 0;
      
      //ingest grid
      let grid = stringTo2D(input);
      let rows = grid.length;
      let cols = grid[0].length;

      let moves = [[1,0],[-1,0], [0,1], [0,-1]]

      let bfs = (row: number, col: number) => {
        let queue: Move[] = [];

        //populate the queue 
        queue.push({row: row, col: col, level: 0});
        
        while (queue.length){
          let cur = queue.shift()!;
          if (cur.level === 9){
            result++;
          }
          for (let coord of moves) {
            let nextR = cur.row + coord[0];
            let nextC = cur.col + coord[1];
            let next = {row: nextR, col: nextC, level: cur.level+1}
            if (nextR >= 0 && nextR < rows && nextC >=0 && nextC < cols && grid[nextR][nextC] === String(cur.level+1)) {
              queue.push(next);
            }
          }
        }
      }

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++){
          if (grid[i][j] === "0") {
            bfs(i,j);
          }
        }
      }
      
      return String(result);
    }
}

export default new Day10;
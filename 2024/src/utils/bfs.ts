export function stringTo2D(input: string): string[][] {
  //split on newlines
  let result = [];
  let lines = input.split('\n');

  for (let line of lines) {
    result.push(line.trim().split(''));
  }

  return result;
}


//For now dont use template, migrate here if needed later in challenge
// export function bfs(grid: string[][], x: number, y: number)
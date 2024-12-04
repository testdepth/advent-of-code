import { stringTo2D } from "./bfs"

describe('BFS Testing', () =>{
  it(`Ingestion and transforms`, ()=>{
      expect(stringTo2D(`AA
        BB`)).toStrictEqual([['A','A'],['B','B']]);
  })
});
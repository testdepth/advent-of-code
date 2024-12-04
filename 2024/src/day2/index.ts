import { Day } from "../day";

class Day2 extends Day {

    constructor(){
        super(2);
    }

    solveForPartOne(input: string): string {
        //Parse input string into reports
        let reports = input.split('\n');
        let sum = reports.reduce((accumulator ,report) => {
          let val = checkSafety(report.trim(), false);
          return accumulator += val;
        }, 0)
        return String(sum);
    }
    solveForPartTwo(input: string): string {
        //Parse input string into reports
        let reports = input.split('\n');
        // let sum = reports.reduce((accumulator ,report) => {
        //   let val = checkSafety(report.trim(), true);
        //   return accumulator += val;
        // }, 0)
        let sum = 0;
        for (let i of reports) {
          let res = checkSafety(i.trim(), true);
          if (res===0){
          };
          sum += res;
        }
        return String(sum);
    }
}

export default new Day2;

enum Polarity {
  Positive = 1,
  Unset = 2,
  Negative = -1,
  Zero = 0,
}
export function checkSafety(report: string, removable: boolean): number {
      let polarity = Polarity.Unset;
      let original = report.split(" ").map(Number).slice();
      let arrayReport = original.slice().reverse();
      if (arrayReport.length <= 1) {
        return(0);
      }
      let checkPolarity = (num1:number, num2: number): Polarity => {
        if ((num1-num2) > 0) {
          return(Polarity.Positive);
        } else if(num1-num2 < 0) {
          return(Polarity.Negative);
        };
        return(Polarity.Zero)
      }
      let index = 0;
      let last = arrayReport.pop()!;
      
      while (arrayReport.length) {
        let next = arrayReport.pop()!;

        if (polarity === Polarity.Unset) {
          polarity = checkPolarity(last!, next!);
        }
        if (polarity != checkPolarity(last!, next! )) {
          if (removable) {
            for (let i=0; i<original.length; i++) {
              let copy = original.slice()
              copy.splice(i, 1)
              let output = checkSafety(copy.join(" "), false);
              if (output === 1) {
                return(1)
              }
            };
            return(0);
          } else {
            return(0);
          }; 
        } else if ((Math.abs(next - last) > 3) || (Math.abs(next-last) < 1)) {
          if (removable) {

            for (let i=0; i<original.length; i++) {
              let copy = original.slice()
              copy.splice(i, 1)
              let output = checkSafety(copy.join(" "), false);
              if (output === 1) {
                return(1)
              }
            };
            return(0);
          } else {
            return(0);
          }; 
        }

        last = next;
        index+=1;
      };
      return 1;
}


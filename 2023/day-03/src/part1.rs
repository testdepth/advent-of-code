use std::{collections::BTreeMap, arch::aarch64::vabal_high_s16, thread::current};
use lazy_static::lazy_static;
use crate::custom_error::AocError;

lazy_static! {
    static ref DIRECTIONS: Vec<(i32, i32)> = vec![(-1,1), (-1,0), (0,1), (1,1), (1,0), (1,-1), (0,-1), (-1,-1)];
}


#[derive(Debug)]
enum GridLoc {
    Dot,
    Symbol(char),
    Number(char),
}

#[derive(Debug)]
struct GridNum {
    x: i32,
    y: i32,
    chars: Vec<char>
}


impl GridNum{


    fn to_num(&self) -> i32 {
        self.chars.clone().into_iter().collect::<String>().to_string().parse::<i32>().unwrap()
    }

    fn validate_num(&self, grid: &BTreeMap<(i32, i32), GridLoc>) -> i32{
        let mut start = self.x;
        let end = self.x + self.chars.len() as i32 - 1;
        println!("NUMBER: {}, start_x {} , start_y {}, end {}", self.to_num(), self.x, self.y, end);
        while start <= end {
            println!("start: {}", start);
            for (offset_x, offset_y) in DIRECTIONS.iter() {
                let cur_x = offset_x + start;
                let cur_y = offset_y + self.y;
                println!("x: {}, y {}", cur_x, cur_y);
                match grid.get(&(cur_y, cur_x)) {
                    Some(loc) => if let GridLoc::Symbol(x) = loc {
                            println!("FOUND: {}, {}, x: {}, y: {}",self.to_num(), x, cur_x, cur_y);
                            println!("GRID: {:?}", grid.get(&(cur_x, cur_y)).expect("."));
                            return self.to_num()
                        },
                    None => ()
                }
            }
            start += 1;
        };
        0
    }
}

#[tracing::instrument]
pub fn process(
    input: &str,
) -> miette::Result<String, AocError> {
    // load schematic into BtreeMap of indices
    let schematic = input.lines().enumerate().flat_map(|(row, line)| {
        line.trim().chars().enumerate().map( move |(col, pos)| {
            ((row as i32, col as i32),
            match pos {
                '.' => GridLoc::Dot,
                c if c.is_ascii_digit() => GridLoc::Number(c),
                c => GridLoc::Symbol(c),
            },)
        })
    }).collect::<BTreeMap<(i32, i32), GridLoc>>();
    // dbg!(&schematic);
    let mut total: i32 = 0;
    let mut nums: Vec<GridNum> = vec![];
    let mut curnum: Option<GridNum> = None;

    // iterate through map
    for ((row, col), loc) in schematic.iter() {
        // Find number
        match loc {
            GridLoc::Number(c) => match curnum {
                Some(ref mut cur) => {
                    cur.chars.push(*c)
                },
                _ => curnum = Some(GridNum {x: *col, y: *row, chars: vec![*c] }),
            },
            _ => match curnum {
                Some(cur) => {
                    nums.push(cur);
                    curnum = None;
                },
                _ => ()
            },
        }
    }
    dbg!(&nums);
    for num in nums {
        total += num.validate_num(&schematic);
    }

    Ok(total.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_process() -> miette::Result<()> {
        let input = "467..114..
        ...*......
        ..35..633.
        ......#...
        617*......
        .....+.58.
        ..592.....
        ......755.
        ...$.*....
        .664.598..";
        assert_eq!("4361".to_string(), process(input)?);
        Ok(())
    }

    #[test]
    fn test_gridnum_to_num() -> miette::Result<()>{
        let num: GridNum = GridNum{ x: 0, y: 0, chars: vec!['1', '2', '3'] };
        assert_eq!(num.to_num(), 123);
        Ok(())
    }
}

use crate::custom_error::AocError;
use lazy_static::lazy_static;
use std::collections::BTreeMap;

lazy_static! {
    static ref DIRECTIONS: Vec<(i32, i32)> = vec![
        (-1, 1),
        (-1, 0),
        (0, 1),
        (1, 1),
        (1, 0),
        (1, -1),
        (0, -1),
        (-1, -1)
    ];
}

#[derive(Debug)]
enum GridLoc {
    Dot,
    Symbol(char),
    Number(char),
}

#[derive(Debug)]
struct Gear {
    x: i32,
    y: i32,
    valid: bool,
    adjacent: Vec<GridNum>,
}

impl Gear {
    fn new(x: i32, y: i32) -> Gear {
        Gear {
            x: x,
            y: y,
            valid: false,
            adjacent: vec![],
        }
    }

    fn valid_sum(&self) -> i32 {
        if self.adjacent.len() != 2 {
            return 0;
        };
        self.adjacent[0].to_num() * self.adjacent[1].to_num()
    }
}
#[derive(Debug, Clone, PartialEq)]
struct GridNum {
    x: i32,
    y: i32,
    chars: Vec<char>,
}

impl GridNum {
    fn to_num(&self) -> i32 {
        self.chars
            .clone()
            .into_iter()
            .collect::<String>()
            .to_string()
            .parse::<i32>()
            .unwrap()
    }

    fn populate_gears(
        &self,
        gears: &mut BTreeMap<(i32, i32), Gear>,
        grid: &BTreeMap<(i32, i32), GridLoc>,
    ) -> i32 {
        let mut start = self.x;
        let end = self.x + self.chars.len() as i32 - 1;
        while start <= end {
            for (offset_x, offset_y) in DIRECTIONS.iter() {
                let cur_x = offset_x + start;
                let cur_y = offset_y + self.y;
                match grid.get(&(cur_y, cur_x)) {
                    Some(loc) => {
                        if let GridLoc::Symbol(x) = loc {
                            if *x == '*' {
                                if let Some(gear) = gears.get_mut(&(cur_x, cur_y)) {
                                    if !gear.adjacent.contains(self) {
                                        gear.adjacent.push(self.clone());
                                    };
                                };
                            };
                        }
                    }
                    None => (),
                }
            }
            start += 1;
        }
        0
    }
}

#[tracing::instrument]
pub fn process(input: &str) -> miette::Result<String, AocError> {
    // load schematic into BtreeMap of indices
    let schematic = input
        .lines()
        .enumerate()
        .flat_map(|(row, line)| {
            line.trim().chars().enumerate().map(move |(col, pos)| {
                (
                    (row as i32, col as i32),
                    match pos {
                        '.' => GridLoc::Dot,
                        c if c.is_ascii_digit() => GridLoc::Number(c),
                        c => GridLoc::Symbol(c),
                    },
                )
            })
        })
        .collect::<BTreeMap<(i32, i32), GridLoc>>();
    let mut total: i32 = 0;
    let mut nums: Vec<GridNum> = vec![];
    let mut gears: BTreeMap<(i32, i32), Gear> = BTreeMap::new();
    let mut curnum: Option<GridNum> = None;

    // iterate through map
    for ((row, col), loc) in schematic.iter() {
        // Find number
        match loc {
            GridLoc::Number(c) => match curnum {
                Some(ref mut cur) => cur.chars.push(*c),
                _ => {
                    curnum = Some(GridNum {
                        x: *col,
                        y: *row,
                        chars: vec![*c],
                    })
                }
            },
            GridLoc::Symbol(c) => {
                if *c == '*' {
                    gears.insert((*col, *row), Gear::new(*col, *row));
                    if let Some(cur) = curnum {
                        nums.push(cur);
                        curnum = None;
                    };
                }
            }
            _ => {
                if let Some(cur) = curnum {
                    nums.push(cur);
                    curnum = None;
                }
            }
        }
    }

    for num in nums {
        num.populate_gears(&mut gears, &schematic);
    }

    for gear in gears.values() {
        total += gear.valid_sum()
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
        assert_eq!("467835".to_string(), process(input)?);
        Ok(())
    }

    #[test]
    fn test_gridnum_to_num() -> miette::Result<()> {
        let num: GridNum = GridNum {
            x: 0,
            y: 0,
            chars: vec!['1', '2', '3'],
        };
        assert_eq!(num.to_num(), 123);
        Ok(())
    }
}

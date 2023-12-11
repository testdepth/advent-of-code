use itertools::Itertools;

use crate::custom_error::AocError;


fn calculate_final(numlist: Vec<i64>) -> i64 {
    let mut lastnum: Vec<i64> = vec![];
    let mut calcs: Vec<Vec<i64>> = vec![];
    calcs.push(numlist);
    loop {
        let mut diffs: Vec<i64> = calcs.last().expect("should exist").windows(2).map(
            | window | window[1] - window[0]
        ).collect();
        let alleq = diffs.iter().all_equal();
        calcs.push(diffs);

        if alleq {
            break;
        }
    }

    calcs.iter().rev().fold(
        0, | mut acc:i64, nums | {
            acc += nums.last().expect("should exist");
            acc
        })
}

#[tracing::instrument]
pub fn process(
    _input: &str,
) -> miette::Result<String, AocError> {
    let oasis: i64 = _input
        .lines()
        .map(| line | {
            let mut numlist = line 
                .split_whitespace()
                .map(| num | num.parse::<i64>().unwrap())
                .collect::<Vec<i64>>();
            calculate_final(numlist)
        }).collect::<Vec<i64>>().iter().sum();

    Ok(oasis.to_string())   
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_calcs() -> miette::Result<()>{
        let mut input: Vec<i64> = vec![0, 3, 6, 9, 12, 15];
        assert_eq!(18, calculate_final(input));
        input = vec![1, 3, 6, 10, 15, 21];
        assert_eq!(28, calculate_final(input));
        Ok(())
    }

    #[test]
    fn test_process() -> miette::Result<()> {
        let input = "0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45";
        assert_eq!("114", process(input)?);
        Ok(())
    }
}

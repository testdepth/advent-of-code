use std::collections::HashMap;

use crate::custom_error::AocError;
use nom::{
    self,
    bytes::complete::tag,
    character::complete::{alpha1, alphanumeric1, multispace0, multispace1},
    multi::fold_many1,
    sequence::{preceded, separated_pair, terminated},
    IResult,
};
use num::Integer;

#[derive(Debug)]
struct Node<'a> {
    left: &'a str,
    right: &'a str,
}


fn node(input: &str) -> IResult<&str, (&str, Node)> {
    let (input, position) = terminated(alphanumeric1, tag(" = "))(input)?;

    let (input, (left, right)) = separated_pair(
        preceded(tag("("), alphanumeric1),
        tag(", "),
        terminated(alphanumeric1, tag(")")),
    )(input)?;

    Ok((input, (position, Node { left, right })))
}

fn process_input(input: &str) -> IResult<&str, (&str, HashMap<&str, Node>)> {
    let (input, directions) = terminated(alpha1, multispace1)(input)?;
    let (input, nodes) = fold_many1(
        terminated(node, multispace0),
        HashMap::new,
        |mut acc, (position, node)| {
            acc.insert(position, node);
            acc
        },
    )(input)?;
    Ok((input, (directions, nodes)))
}

#[tracing::instrument]
pub fn process(_input: &str) -> miette::Result<String, AocError> {
    let (_input, (directions, nodes)) = process_input(_input).expect("should parse");

    let curnodes: Vec<&str> = nodes.keys().filter(|x| x.ends_with('A')).copied().collect();
    let results: Vec<_> = curnodes.iter().map( |&(mut curnode)| {
        let mut steps: u32 = 0;
        let inter_result = directions.chars().cycle().find_map(|dir| {
            let next = nodes.get(curnode).expect("should contain value");

            curnode = match dir {
                'L' => next.left,
                'R' => next.right,
                _ => panic!("Should never get here"),
            };
            steps += 1;
            if curnode.ends_with("Z") {
                return Some(steps);
            }
            None
        }).expect("should find a value");
        inter_result
    }).collect();
    let lcm = results.iter().fold(1, |acc: u64, num | {
        acc.lcm(&(*num as u64))
    });

    Ok(lcm.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_process() -> miette::Result<()> {
        let input = "LR

        11A = (11B, XXX)
        11B = (XXX, 11Z)
        11Z = (11B, XXX)
        22A = (22B, XXX)
        22B = (22C, 22C)
        22C = (22Z, 22Z)
        22Z = (22B, 22B)
        XXX = (XXX, XXX)";
        assert_eq!("6", process(input)?);
        Ok(())
    }
}

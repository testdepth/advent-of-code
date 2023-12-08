use std::collections::HashMap;

use crate::custom_error::AocError;
use nom::{
    self,
    bytes::complete::tag,
    character::complete::{alpha1, multispace0, multispace1},
    multi::fold_many1,
    sequence::{preceded, separated_pair, terminated},
    IResult,
};

#[derive(Debug)]
struct Node<'a> {
    left: &'a str,
    right: &'a str,
}


fn node(input: &str) -> IResult<&str, (&str, Node)> {
    let (input, position) = terminated(alpha1, tag(" = "))(input)?;

    let (input, (left, right)) = separated_pair(
        preceded(tag("("), alpha1),
        tag(", "),
        terminated(alpha1, tag(")")),
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

    let mut steps: u32 = 0;
    let mut curnode: &str = "AAA";

    let _ = directions.chars().cycle().find_map(|dir| {
        let next = nodes.get(curnode).expect("should contain value");

        curnode = match dir {
            'L' => next.left,
            'R' => next.right,
            _ => panic!("Should never get here"),
        };
        steps += 1;
        if curnode == "ZZZ" {
            return Some(1);
        }
        None
    });

    Ok(steps.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_process() -> miette::Result<()> {
        let mut input = "RL

        AAA = (BBB, CCC)
        BBB = (DDD, EEE)
        CCC = (ZZZ, GGG)
        DDD = (DDD, DDD)
        EEE = (EEE, EEE)
        GGG = (GGG, GGG)
        ZZZ = (ZZZ, ZZZ)";
        assert_eq!("2", process(input)?);

        input = "LLR

        AAA = (BBB, BBB)
        BBB = (AAA, ZZZ)
        ZZZ = (ZZZ, ZZZ)";
        assert_eq!("6", process(input)?);
        Ok(())
    }
}

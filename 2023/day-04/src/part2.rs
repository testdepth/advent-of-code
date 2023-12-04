use std::collections::HashSet;

use crate::custom_error::AocError;
use nom::{
    self,
    bytes::complete::tag,
    character::complete::{self, line_ending, space1, digit1, space0},
    multi::{separated_list1, fold_many1},
    sequence::{terminated, delimited, tuple, separated_pair},
    IResult, Parser,
};

#[derive(Debug, PartialEq)]
struct Card {
    // id: u32,
    winning_numbers: HashSet<u32>,
    drawn_numbers: HashSet<u32>,
}
impl Card {
    fn calculate(&self) -> i32 {
        let mut result = 0;
        for num in self.winning_numbers.iter() {
            match self.drawn_numbers.get(&num) {
                Some(_) => {
                    if result == 0 {
                    result = 1
                    } else {
                        result *= 2
                    }
                },
                None => ()
        
            }
        }
        result
    }
}

fn set(input: &str) -> IResult<&str, HashSet<u32>> {
    fold_many1(
        terminated(complete::u32, space0),
        HashSet::new,
        |mut acc: HashSet<_>, item| {
            acc.insert(item);
            acc
        },
    )(input)
}

fn card(input: &str) -> IResult<&str, Card> {
    let (input, _) = delimited(
        tuple((tag("Card"), space1)),
        digit1,
        tuple((tag(":"), space1)),
    )(input)?;
    separated_pair(set, tuple((tag("|"), space1)), set)
        .map(|(winning_numbers, drawn_numbers)| Card {
            winning_numbers,
            drawn_numbers,
        })
        .parse(input)
}

fn parse_cards(input: &str) -> IResult<&str, Vec<Card>> {
    let (input, cards) = separated_list1(line_ending, card)(input)?;
    Ok((input, cards))
}

#[tracing::instrument]
pub fn process(input: &str) -> miette::Result<String, AocError> {
    let mut result = 0;
    let (_, cards) = parse_cards(&input).expect("should parse");
    for card in cards.iter() {
        result += card.calculate();
    }

    Ok(result.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_card() -> miette::Result<()> {
        let input = "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53";

        assert_eq!(
            card(input),
            Ok((
                "",
                Card {
                    winning_numbers: vec![41, 48, 83, 86, 17].into_iter().collect(),
                    drawn_numbers: vec![83, 86, 6, 31, 17, 9, 48, 53].into_iter().collect()
                }
            ))
        );
        Ok(())
    }

    #[test]
    fn test_process() -> miette::Result<()> {
        let input = "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11";
        assert_eq!("13", process(input)?);
        Ok(())
    }
}

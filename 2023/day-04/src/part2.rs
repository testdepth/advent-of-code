use std::collections::{BTreeMap, HashSet};

use crate::custom_error::AocError;
use nom::{
    self,
    bytes::complete::tag,
    character::complete::{self, digit1, line_ending, space0, space1},
    multi::{fold_many1, separated_list1},
    sequence::{delimited, separated_pair, terminated, tuple},
    IResult, Parser,
};

#[derive(Debug, PartialEq)]
struct Card {
    // id: u32,
    winning_numbers: HashSet<u32>,
    drawn_numbers: HashSet<u32>,
}
impl Card {
    fn total_matches(&self) -> u32 {
        self.winning_numbers
            .intersection(&self.drawn_numbers)
            .count() as u32
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
    let (_, cards) = parse_cards(&input).expect("should parse");

    //collect matches into vec
    let matches: Vec<_> = cards.iter().map(|card| card.total_matches()).collect();
    // dict like object to hold matches + pointsd
    let holder: BTreeMap<usize, u32> = (0..cards.len()).map(|idx| (idx, 1)).collect();

    let final_counts: u32 = matches
        .iter()
        .enumerate()
        .fold(holder, |mut acc, (idx, cardnum)| {
            let step = *acc.get(&idx).unwrap();

            for i in (idx + 1)..(idx + 1 + *cardnum as usize) {
                acc.entry(i).and_modify(|val| {
                    *val += step;
                });
            }
            acc
        })
        .values()
        .sum();
    Ok(final_counts.to_string())
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
        assert_eq!("30", process(input)?);
        Ok(())
    }
}

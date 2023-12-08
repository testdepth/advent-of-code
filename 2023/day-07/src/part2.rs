use std::ops::Deref;

use crate::custom_error::AocError;
use itertools::{Itertools, Position};
use nom::{
    self,
    character::complete::{self, alphanumeric1, multispace1, space1},
    multi::fold_many1,
    sequence::{pair, terminated},
    IResult,
};
// enum Card {
//     A=14, K=13, Q=12, J=11, T=10, Nine=9, Eight=8, Seven=7, Six=6, Five=5, Four=4, Three=3, Two=2
// }

#[derive(Debug)]
struct Hand<'a> {
    cards: &'a str,
    bid: u32,
}

impl<'a> Hand<'a> {
    fn card_val(card: char) -> u32 {
        match card {
            'A' => 14,
            'K' => 13,
            'Q' => 12,
            'J' => 1,
            'T' => 10,
            value => value.to_digit(10).unwrap(),
        }
    }

    fn score_hand(&self) -> (TypeHand, (u32, u32, u32, u32, u32), u32) {
        let card_counts = self.cards.chars().counts();
        let values = if let Some(joker_count) = card_counts.get(&'J') {
            if *joker_count == 5 {
                "5".to_string()
            } else {
                card_counts
                    .iter()
                    .filter_map(|(key, value)| (key != &'J').then_some(value))
                    .sorted()
                    .with_position()
                    .map(|(position, value)| match position {
                        Position::Last | Position::Only => value + joker_count,
                        _ => *value,
                    })
                    .join("")
            }
        } else {
            card_counts.values().sorted().join("")
        };
        let type_hand = match values.deref() {
            "5" => TypeHand::FIVEKIND,
            "14" => TypeHand::FOURKIND,
            "23" => TypeHand::FULLHOUSE,
            "113" => TypeHand::THREEKIND,
            "122" => TypeHand::TWOPAIR,
            "1112" => TypeHand::ONEPAIR,
            "11111" => TypeHand::HIGHCARD,
            _ => panic!("Failed to classify hand"),
        };

        // // guard edge case for unsafe transmute operation
        // if self.cards != "JJJJJ" {
        //     if has_joker {
        //         joker_count = self.cards.chars().filter(|x| *x == 'J').count() as i8;
        //         let inc = match type_hand {
        //             TypeHand::THREEKIND | TypeHand::TWOPAIR | TypeHand::ONEPAIR => 1,
        //             _ => 0
        //         };
        //         type_hand =  unsafe {
        //             std::mem::transmute(type_hand as i8 + joker_count + inc)
        //     } };
        // } else {
        //     type_hand = TypeHand::FIVEKIND;
        // }
        let cardvals = self
            .cards
            .chars()
            .map(|c| Hand::card_val(c))
            .collect_tuple()
            .unwrap();
        (type_hand, cardvals, self.bid)
    }
}

#[derive(PartialEq, Debug, PartialOrd, Clone, Copy)]
#[repr(u8)]
enum TypeHand {
    FIVEKIND = 6,
    FOURKIND = 5,
    FULLHOUSE = 4,
    THREEKIND = 3,
    TWOPAIR = 2,
    ONEPAIR = 1,
    HIGHCARD = 0,
}

fn process_input(input: &str) -> IResult<&str, Vec<Hand>> {
    let (input, hands) = fold_many1(
        pair(
            terminated(alphanumeric1, space1),
            terminated(complete::u32, multispace1),
        ),
        Vec::new,
        |mut acc: Vec<_>, (cards, bid)| {
            acc.push(Hand { cards, bid });
            acc
        },
    )(input)?;
    Ok((input, hands))
}

#[tracing::instrument]
pub fn process(_input: &str) -> miette::Result<String, AocError> {
    let (_, hands) = process_input(_input).expect("should parse");

    let result: Vec<_> = hands
        .iter()
        .map(|hand| hand.score_hand())
        .sorted_by_key(|tup| (tup.0 as u8, tup.1))
        .enumerate()
        .collect();
    let summed = result
        .iter()
        .map(|(idx, tup)| (idx + 1) as u32 * tup.2)
        .sum::<u32>();

    Ok(summed.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_score_hand() -> miette::Result<()> {
        let mut hand = Hand {
            cards: "22222",
            bid: 483,
        };
        assert_eq!(
            hand.score_hand(),
            (TypeHand::FIVEKIND, (2, 2, 2, 2, 2), 483)
        );

        hand.cards = "22223";
        assert_eq!(
            hand.score_hand(),
            (TypeHand::FOURKIND, (2, 2, 2, 2, 3), 483)
        );
        hand.cards = "QQQJA";
        assert_eq!(
            hand.score_hand(),
            (TypeHand::FOURKIND, (12, 12, 12, 1, 14), 483)
        );
        hand.cards = "33322";
        assert_eq!(
            hand.score_hand(),
            (TypeHand::FULLHOUSE, (3, 3, 3, 2, 2), 483)
        );
        hand.cards = "KK677";
        assert_eq!(
            hand.score_hand(),
            (TypeHand::TWOPAIR, (13, 13, 6, 7, 7), 483)
        );
        hand.cards = "32T3K";
        assert_eq!(
            hand.score_hand(),
            (TypeHand::ONEPAIR, (3, 2, 10, 3, 13), 483)
        );
        hand.cards = "2345J";
        assert_eq!(hand.score_hand(), (TypeHand::ONEPAIR, (2, 3, 4, 5, 1), 483));
        Ok(())
    }

    #[test]
    fn test_card_val() -> miette::Result<()> {
        assert_eq!(Hand::card_val('A'), 14);
        assert_eq!(Hand::card_val('T'), 10);
        assert_eq!(Hand::card_val('9'), 9);
        assert_eq!(Hand::card_val('2'), 2);

        Ok(())
    }

    #[test]
    fn test_process() -> miette::Result<()> {
        let input = "32T3K 765
        T55J5 684
        KK677 28
        KTJJT 220
        QQQJA 483
        ";
        assert_eq!("5905", process(input)?);
        Ok(())
    }
}

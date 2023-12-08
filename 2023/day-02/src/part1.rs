use crate::custom_error::AocError;

use std::collections::HashMap;

use nom::{
    bytes::complete::tag,
    character::complete::{self, alpha1, line_ending},
    multi::separated_list1,
    sequence::{preceded, separated_pair},
    IResult,
};

#[tracing::instrument]
pub fn process(input: &str) -> miette::Result<String, AocError> {
    let map: HashMap<&str, u32> = HashMap::from([("red", 12), ("green", 13), ("blue", 14)]);

    let mut result = 0;
    let games = parse_games(input).expect("should parse");

    for game in games.1 {
        let mut valid: bool = true;
        'outer: for round in game.rounds {
            for cube in round {
                if cube.value > *map.get(cube.kind).expect("found val") {
                    valid = false;
                    break 'outer;
                };
            }
        }
        if valid {
            result += game.id
        }
    }
    Ok(result.to_string())
}

#[derive(Debug, PartialEq)]
struct Cube<'a> {
    kind: &'a str,
    value: u32,
}

#[derive(Debug, PartialEq)]
struct Game<'a> {
    id: u32,
    rounds: Vec<Vec<Cube<'a>>>,
}

fn cube(input: &str) -> IResult<&str, Cube> {
    let (input, (num, color)) = separated_pair(complete::u32, tag(" "), alpha1)(input)?;
    Ok((
        input,
        Cube {
            kind: color,
            value: num,
        },
    ))
}

fn round(input: &str) -> IResult<&str, Vec<Cube>> {
    let (input, cubes) = separated_list1(tag(", "), cube)(input)?;
    Ok((input, cubes))
}

fn parse_game(input: &str) -> IResult<&str, Game> {
    let (input, id) = preceded(tag("Game "), complete::u32)(input)?;
    let (input, rounds) = preceded(tag(": "), separated_list1(tag("; "), round))(input)?;
    Ok((
        input,
        Game {
            id: id,
            rounds: rounds,
        },
    ))
}
fn parse_games(input: &str) -> IResult<&str, Vec<Game>> {
    let (input, games) = separated_list1(line_ending, parse_game)(input)?;
    Ok((input, games))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_process() -> miette::Result<()> {
        let input = "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green";
        assert_eq!("8", process(input)?);
        Ok(())
    }
}

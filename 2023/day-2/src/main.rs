extern crate aoc_util;

use std::collections::HashMap;

use nom::{
    bytes::complete::tag, character::{complete::{digit1, alpha1, self}}, multi::separated_list1, sequence::{preceded, separated_pair},
    IResult,
};

use aoc_util::read_lines;

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

fn main() {
    // Part 1
    // let result = load_and_parse_games("input.txt");
    // println!("Part 1 Result: {}", result)

    let result = load_and_parse_games_min_cubes("input.txt");
    println!("Part 2 Result: {}", result)
}

fn cube(input: &str) -> IResult<&str, Cube> {
    let (input, (num, color)) =
        separated_pair(complete::u32, tag(" "), alpha1)(input)?;
    Ok((input, Cube {
        kind: color,
        value: num,
    }))
}

fn round(input: &str) -> IResult<&str, Vec<Cube>> {
    let (input, cubes) = 
        separated_list1(tag(", "), cube)(input)?;
    Ok((input, cubes))
}

fn parse_game(input: &str) -> IResult<&str, Game> {
    let (input, id) = preceded(tag("Game "), complete::u32)(input)?;
    let (input, rounds) = preceded(tag(": "), separated_list1(tag("; "), round))(input)?;
    Ok((input, Game{
        id: id,
        rounds: rounds,
    }))
}

fn load_and_parse_games(filename: &str) -> u32 {
    let map: HashMap<&str, u32> = HashMap::from([
        ("red", 12),
        ("green", 13),
        ("blue", 14),
    ]);
    
    let mut result = 0;
    if let Ok(lines) = read_lines(filename){
        for line in lines {
            if let Ok(ip) = line {
                let (_, game )= parse_game(ip.as_str()).expect("should parse");
                let mut valid: bool = true; 
                'outer: for round in game.rounds {
                    for cube in round {
                        if cube.value > *map.get(cube.kind).expect("found val"){
                            valid = false;
                            break 'outer;
                        };
                    };
                };
                if valid == true{
                    result += game.id
                }
            };
        };
    }
    result
}

fn load_and_parse_games_min_cubes(filename: &str) -> u32 {
    let mut result = 0;
    if let Ok(lines) = read_lines(filename){
        for line in lines {
            if let Ok(ip) = line {
                let mut map: HashMap<&str, u32> = HashMap::from([
                    ("red", 0),
                    ("green", 0),
                    ("blue", 0),
                ]);
                let (_, game )= parse_game(ip.as_str()).expect("should parse");
                for round in game.rounds {
                    for cube in round {
                        if cube.value > *map.get(cube.kind).expect("found val"){
                            *map.get_mut(cube.kind).unwrap() = cube.value;
                        };
                    };
                };
                let mut intermediate: u32 = 1;
                for val in map.values() {
                    intermediate *= val
                }
                result += intermediate;
            };
        };
    }
    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_game(){
        let input = "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green";
        let game = parse_game(input);

        let expected = Game{
            id: 1,
            rounds: Vec::from([
                        Vec::from([Cube{kind: "blue", value: 3}, Cube{kind:"red", value: 4}]),
                        Vec::from([Cube{kind: "red", value: 1}, Cube{kind:"green", value: 2}, Cube{kind: "blue", value: 6}]),
                        Vec::from([Cube{kind: "green", value: 2}]),
                    ])
        };
        assert_eq!(
            Ok(("", expected)), game
        );
    }

    #[test]
    fn test_load_and_parse() {
        let output = load_and_parse_games("test.txt");
        assert_eq!(output, 8);
    }
    #[test]
    fn test_load_and_parse_min_cubes() {
        let output: u32 = load_and_parse_games_min_cubes("test.txt");
        assert_eq!(output, 2286)
    }
}
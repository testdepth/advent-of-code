use crate::custom_error::AocError;
use nom::{
    self,
    bytes::complete::tag,
    character::complete::{self, multispace0, multispace1, not_line_ending, space0, space1},
    multi::fold_many1,
    sequence::{terminated, tuple},
    IResult,
};
use std::ops::Range;

use rayon::iter::{IntoParallelIterator, ParallelIterator};

#[derive(Debug)]
struct Mapping {
    seedmap: Vec<(Range<u64>, Range<u64>)>,
}

impl Mapping {
    fn traverse(&self, num: u64) -> u64 {
        let valid_range = self
            .seedmap
            .iter()
            .find(|(source, _)| source.contains(&num));
        let Some((source, dest)) = valid_range else {
            return num;
        };

        let offset = num - source.start;
        offset + dest.start
    }
}

fn map(input: &str) -> IResult<&str, (Range<u64>, Range<u64>)> {
    let (input, (dest_start, source_start, length)) = tuple((
        terminated(complete::u64, space0),
        terminated(complete::u64, space0),
        terminated(complete::u64, space0),
    ))(input)?;
    let dest_range = Range {
        start: dest_start,
        end: dest_start + length,
    };
    let source_range = Range {
        start: source_start,
        end: source_start + length,
    };
    Ok((input, (source_range, dest_range)))
}

fn parse_maps(input: &str) -> IResult<&str, Mapping> {
    let (input, _test) = tuple((not_line_ending, multispace1))(input)?;
    let (input, maps) = // separated_list1(newline, map)(input)?;
        fold_many1(
            terminated(map, multispace1),
            Vec::new,
            |mut acc: Vec<_>, item:(Range<u64>, Range<u64>) | {
                acc.push(item);
                acc
            },
        )(input)?;
    Ok((input, Mapping { seedmap: maps }))
}

fn seed_range(input: &str) -> IResult<&str, Range<u64>> {
    let (input, (start, _, range, _)) =
        tuple((complete::u64, space1, complete::u64, space0))(input)?;

    Ok((
        input,
        Range {
            start: start,
            end: start + range,
        },
    ))
}

fn parse_input(input: &str) -> IResult<&str, (Vec<Range<u64>>, Vec<Mapping>)> {
    // drop "Seeds: "
    let (input, _) = tag("seeds: ")(input)?;

    let (input, seeds) = fold_many1(
        terminated(seed_range, space0),
        Vec::new,
        |mut acc: Vec<_>, item: Range<_>| {
            acc.push(item);
            acc
        },
    )(input)?;
    let (input, _) = multispace1(input)?;
    let (input, mappings) = // separated_list1(multispace1, parse_maps)(input)?;    
        fold_many1(
            terminated(parse_maps, multispace0),
            Vec::new,
            |mut acc: Vec<_>, item: Mapping| {
                acc.push(item);
                acc
            },
        )(input)?;
    Ok((input, (seeds, mappings)))
}

#[tracing::instrument]
pub fn process(_input: &str) -> miette::Result<String, AocError> {
    let (_, (seed_ranges, mappings)) = parse_input(_input).expect("should parse");
    let seeds = seed_ranges.iter().fold(Vec::new(), |mut acc, range| {
        // let inter: Vec<u64> = range.collect();
        let mut fullrange = range.clone().collect::<Vec<u64>>();
        acc.append(&mut fullrange);
        acc
    });

    let result: Vec<u64> = seeds
        .into_par_iter()
        .map(|num| {
            mappings
                .iter()
                .fold(num, |num: u64, map: &Mapping| map.traverse(num))
        })
        .collect();
    Ok(result
        .iter()
        .min()
        .expect("should have a minimum location value")
        .to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_traverse_seedmap() -> miette::Result<()> {
        let mapping = Mapping {
            seedmap: vec![(
                Range { start: 50, end: 98 },
                Range {
                    start: 52,
                    end: 100,
                },
            )],
        };
        assert_eq!(mapping.traverse(3), 3);
        assert_eq!(mapping.traverse(79), 81);
        Ok(())
    }

    #[test]
    fn test_process() -> miette::Result<()> {
        let input = "seeds: 79 14 55 13

        seed-to-soil map:
        50 98 2
        52 50 48
        
        soil-to-fertilizer map:
        0 15 37
        37 52 2
        39 0 15
        
        fertilizer-to-water map:
        49 53 8
        0 11 42
        42 0 7
        57 7 4
        
        water-to-light map:
        88 18 7
        18 25 70
        
        light-to-temperature map:
        45 77 23
        81 45 19
        68 64 13
        
        temperature-to-humidity map:
        0 69 1
        1 0 69
        
        humidity-to-location map:
        60 56 37
        56 93 4";
        assert_eq!("46", process(input)?);
        Ok(())
    }
}

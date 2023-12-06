use std::iter::zip;

use crate::custom_error::AocError;
use nom::{self, sequence::terminated, bytes::complete::tag, character::complete::{multispace0, self}, multi::fold_many1, IResult};

#[derive(Debug)]
struct Race {
    time: u32,
    distance: u32
}

impl Race {
    fn get_range_of_good_runs(&self) -> u32 {
        // upper
        let upper: f32 = (-(self.time as f32) - f32::sqrt(f32::powf(self.time as f32, 2.0) - 4.0 * self.distance as f32))/(-2.0);

        let lower: f32 = (-(self.time as f32) + f32::sqrt(f32::powf(self.time as f32, 2.0) - 4.0 * self.distance as f32))/(-2.0);
        let result = (f32::ceil(upper) - f32::floor(lower)) as u32 - 1;
        result
    }
}

fn parse_vec_nums(input: &str) -> IResult<&str, Vec<u32>>{
    fold_many1(terminated(complete::u32, multispace0),
                            Vec::new,
                            | mut acc: Vec<_>, item | {
                                acc.push(item);
                                acc
                            })(input)
}

fn parse_input(input: & str) -> IResult<&str,Vec<Race>> {
    let (input, _) = terminated(tag("Time:"), multispace0)(input)?;
    let (input, times) = parse_vec_nums(input)?;

    let (input, _) = terminated(tag("Distance:"), multispace0)(input)?;
    let (input, distances) = parse_vec_nums(input)?;

    Ok((input, zip(times, distances).into_iter().fold(Vec::new(),
                        | mut acc: Vec<Race>, (time, distance) | {
                            acc.push(Race{ time, distance });
                            acc
                        })))
                    
}

#[tracing::instrument]
pub fn process(
    input: &str,
) -> miette::Result<String, AocError> {
    let (_, races) = parse_input(input).expect("should parse");
    let result: u32 = races.iter().map(|race| {
        race.get_range_of_good_runs()
    }).product();
    Ok(result.to_string())

}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_range_of_good_runs() -> miette::Result<()> {
        let race = Race {
            time: 7,
            distance: 9,
        };
        assert_eq!(race.get_range_of_good_runs(), 4);

        let race =     Race {
            time: 15,
            distance: 40,
        };
        assert_eq!(race.get_range_of_good_runs(), 8);
        
        let race =     Race {
            time: 30,
            distance: 200,
        };
        assert_eq!(race.get_range_of_good_runs(), 9);   
        Ok(())
    }

    #[test]
    fn test_process() -> miette::Result<()> {
        let input = "Time:      7  15   30
        Distance:  9  40  200";
        assert_eq!("288", process(input)?);
        Ok(())
    }
}

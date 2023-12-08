use crate::custom_error::AocError;
use nom::{
    self,
    bytes::complete::tag,
    character::complete::{digit1, multispace0, multispace1},
    multi::{separated_list0, separated_list1},
    sequence::{terminated, tuple},
    IResult,
};

#[derive(Debug)]
struct Race {
    time: u64,
    distance: u64,
}

impl Race {
    fn get_range_of_good_runs(&self) -> u64 {
        // upper
        let upper: f64 = (-(self.time as f64)
            - f64::sqrt(f64::powf(self.time as f64, 2.0) - 4.0 * self.distance as f64))
            / (-2.0);

        let lower: f64 = (-(self.time as f64)
            + f64::sqrt(f64::powf(self.time as f64, 2.0) - 4.0 * self.distance as f64))
            / (-2.0);
        let result = (f64::ceil(upper) - f64::floor(lower)) as u64 - 1;
        result
    }
}

fn parse_input(input: &str) -> IResult<&str, Race> {
    let (input, _) = terminated(tag("Time:"), multispace0)(input)?;
    let (input, times) = separated_list1(multispace0, digit1)(input)?;
    let (input, (_, _, _)) = tuple((multispace0, tag("Distance:"), multispace1))(input)?;
    let (input, distances) = separated_list0(multispace0, digit1)(input)?;
    Ok((
        input,
        Race {
            time: times.join("").parse::<u64>().unwrap(),
            distance: distances.join("").parse::<u64>().unwrap(),
        },
    ))
}

#[tracing::instrument]
pub fn process(input: &str) -> miette::Result<String, AocError> {
    let (_, races) = parse_input(input).expect("should parse");
    let result: u64 = races.get_range_of_good_runs();

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

        let race = Race {
            time: 15,
            distance: 40,
        };
        assert_eq!(race.get_range_of_good_runs(), 8);

        let race = Race {
            time: 30,
            distance: 200,
        };
        assert_eq!(race.get_range_of_good_runs(), 9);
        Ok(())
    }

    #[test]
    fn test_process() -> miette::Result<()> {
        let input = "Time:      7  15   30
        Distance:  9  40  200 ";
        assert_eq!("71503", process(input)?);
        Ok(())
    }
}

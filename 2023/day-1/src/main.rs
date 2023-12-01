use std::{io::{self, BufRead}, fs::File, path::Path, result, collections::HashMap};
use lazy_static::lazy_static;

lazy_static! {
    static ref NUMS: HashMap<&'static str, &'static str> = {
        HashMap::from([
            ("one", "1"),
            ("two", "2"),
            ("three", "3"),
            ("four", "4"),
            ("five", "5"),
            ("six", "6"),
            ("seven", "7"),
            ("eight", "8"),
            ("nine","9"),
        ])
    };
}
const MAXLEN: usize = 5;

fn main() {
    let calculation: u32 = load_and_calculate("input.txt");

    println!("Final Calibration: {} ", calculation)

}

fn load_and_calculate(input_file: &str) -> u32 {
    let mut sum: u32 = 0;
    if let Ok(lines) = read_lines(input_file) {
        for line in lines{
            if let Ok(ip) = line {
                sum += decode(ip)
            }
        }
    }
    sum
}

#[test]
fn test_load_and_calculate(){
    let mut result: u32 = load_and_calculate("test.txt");
    assert_eq!(result, 142);

    result = load_and_calculate("test_2.txt");
    assert_eq!(result, 281);

}

fn read_lines<P>(filename: P) -> io::Result<io::Lines<io::BufReader<File>>> where P: AsRef<Path>, {
    let file = File::open(filename)?;
    Ok(io::BufReader::new(file).lines())
}

fn decode(value: String) -> u32 {
    // Remove non-numeric
    let mut result = word_to_num(value);
    let decoded_str: String;
    if result.len() == 0 {
        return 0
    }
    else if result.len() == 1 {
        decoded_str = result.clone() + &result;
    }
    else{
        let length = result.len() - 1;
        result.replace_range(1..length, "");
        decoded_str = result;
    }
    decoded_str.parse::<u32>().unwrap_or(0)
}

#[test]
fn test_decode(){
    let mut result = decode(String::from("1abc2"));
    assert_eq!(result, 12);

    result = decode(String::from("pqr3stu8vwx"));
    assert_eq!(result, 38);

    result = decode(String::from("a1b2c3d4e5f"));
    assert_eq!(result, 15);

    result = decode(String::from("treb7uchet"));
    assert_eq!(result, 77);
    
    result = decode(String::from("two1nine"));
    assert_eq!(result, 29);
    
    result = decode(String::from("eightwothree"));
    assert_eq!(result, 83);
    
    result = decode(String::from("abcone2threexyz"));
    assert_eq!(result, 13);
    
    result = decode(String::from("xtwone3four"));
    assert_eq!(result, 24);
    
    result = decode(String::from("4nineeightseven2"));
    assert_eq!(result, 42);
    
    result = decode(String::from("zoneight234"));
    assert_eq!(result, 14);
    
    result = decode(String::from("7pqrstsixteen"));
    assert_eq!(result, 76);

    result = decode(String::from("6twodndmhcgxlgbqbqndbbthnngblfgtzh5fouroneightrjp"));
    assert_eq!(result, 68);
    
    result = decode(String::from("eighthree"));
    assert_eq!(result, 83);
    
    result = decode(String::from("sevenine"));
    assert_eq!(result, 79);
    
}

fn word_to_num(input_string: String) -> String {
    let mut result = String::new(); 
    let mut current = String::new();
    
    for c in input_string.chars() {
        if c.is_alphabetic() {
            current.push(c);
            if current.len() > MAXLEN {
                current.remove(0);
            }
            match NUMS.keys().find(|&key| current.contains(key)) {
                Some(key) => {
                    result += NUMS[key];
                    //retain the last char for overlap to next number
                    current = (&key[key.len()-1..]).to_string();

                }
                None => {}
            }
        }
        else{
            result.push(c);
            current.clear();
        }
    }
    result
}

#[test]
fn test_word_to_num() {
    let mut result = word_to_num(String::from("1sevenine1"));
    assert_eq!(result, "1791");

    result = word_to_num(String::from("two1nine"));
    assert_eq!(result, "219");

    result = word_to_num(String::from("eighttwothree"));
    assert_eq!(result, "823");
    
    result = word_to_num(String::from("abcone2threexyz"));
    assert_eq!(result, "123"); 
        
    result = word_to_num(String::from("abcone2threexyz"));
    assert_eq!(result, "123");
    
    result = word_to_num(String::from("xtwone3four"));
    assert_eq!(result, "2134");
    
    result = word_to_num(String::from("4nineeightseven2"));
    assert_eq!(result, "49872");
    
    result = word_to_num(String::from("zoneight234"));
    assert_eq!(result, "18234");
    
    result = word_to_num(String::from("7pqrstsixteen"));
    assert_eq!(result, "76");

    result = word_to_num(String::from("eighthree"));
    assert_eq!(result, "83");


}

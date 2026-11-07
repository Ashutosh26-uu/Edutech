import type { BankQuestion } from "@/lib/bank";

/** Number Series (Reasoning): 29 questions. Append new ones at the end with the next id; never reuse or renumber an id. */
const questions: BankQuestion[] = [
  {"id":"reason-series-1","question":"Find the next number: 4, 8, 12, 16, ?","options":["18","20","24","22"],"answer":1,"explanation":"Each term increases by 4: 16 + 4 = 20.","difficulty":"easy"},
  {"id":"reason-series-2","question":"Find the next number: 3, 9, 27, 81, ?","options":["162","243","324","216"],"answer":1,"explanation":"Each term is multiplied by 3: 81 × 3 = 243.","difficulty":"easy"},
  {"id":"reason-series-3","question":"Find the next number: 2, 3, 5, 7, 11, ?","options":["12","13","15","17"],"answer":1,"explanation":"These are consecutive prime numbers; the next is 13.","difficulty":"easy"},
  {"id":"reason-series-4","question":"Find the next number: 1, 4, 9, 16, 25, ?","options":["30","36","49","35"],"answer":1,"explanation":"These are perfect squares: 6² = 36.","difficulty":"moderate"},
  {"id":"reason-series-5","question":"Find the next number: 2, 6, 12, 20, 30, ?","options":["40","42","44","36"],"answer":1,"explanation":"The terms are n(n + 1): 1×2, 2×3, … 6×7 = 42.","difficulty":"moderate"},
  {"id":"reason-series-6","question":"Find the next number: 5, 11, 23, 47, ?","options":["94","95","96","93"],"answer":1,"explanation":"Each term is (previous × 2) + 1: 47 × 2 + 1 = 95.","difficulty":"moderate"},
  {"id":"reason-series-7","question":"Find the missing number: 3, 7, 15, 31, ?","options":["47","63","62","56"],"answer":1,"explanation":"Each term is (previous × 2) + 1: 31 × 2 + 1 = 63.","difficulty":"hard"},
  {"id":"reason-series-8","question":"Find the next number: 1, 1, 2, 3, 5, 8, ?","options":["11","12","13","15"],"answer":2,"explanation":"Fibonacci series: each term is the sum of the previous two, 5 + 8 = 13.","difficulty":"hard"},
  {"id":"reason-series-9","question":"Find the next number: 2, 5, 10, 17, 26, ?","options":["35","37","36","39"],"answer":1,"explanation":"The terms are n² + 1: 1+1, 4+1, 9+1, 16+1, 25+1, 36+1 = 37.","difficulty":"hard"},
  {"id":"reason-series-10","question":"Find the wrong number in the series: 2, 6, 12, 20, 30, 42, 58","options":["12","30","42","58"],"answer":3,"explanation":"The pattern is n(n + 1): the seventh term should be 7 × 8 = 56, not 58.","difficulty":"very-hard"},
  {"id":"reason-series-11","question":"Find the next term: 1, 8, 27, 64, 125, ?","options":["196","216","225","256"],"answer":1,"explanation":"These are perfect cubes: 6³ = 216.","difficulty":"very-hard"},
  {"id":"reason-series-12","question":"Find the next number: 7, 12, 19, 28, 39, ?","options":["50","52","51","54"],"answer":1,"explanation":"Differences are 5, 7, 9, 11, so the next difference is 13: 39 + 13 = 52.","difficulty":"very-hard"},
  {"id":"reason-series-13","question":"Find the next term: 3, 6, 9, 12, ?","options":["13","14","15","18"],"answer":2,"explanation":"Each term increases by 3.","difficulty":"easy","source":"RRB Group D · SSC CHSL"},
  {"id":"reason-series-14","question":"Find the next term: 1, 4, 9, 16, 25, ?","options":["30","35","36","49"],"answer":2,"explanation":"Squares of 1 to 6; next is 6² = 36.","difficulty":"easy","source":"SSC CGL · RRB NTPC"},
  {"id":"reason-series-15","question":"Find the next term: 2, 3, 5, 8, 12, 17, ?","options":["21","22","23","24"],"answer":2,"explanation":"Differences 1, 2, 3, 4, 5, 6 ⇒ 17 + 6 = 23.","difficulty":"moderate","source":"SSC CGL · IBPS Clerk"},
  {"id":"reason-series-16","question":"Find the next term: AZ, BY, CX, DW, ?","options":["EU","EV","FV","EW"],"answer":1,"explanation":"First letter moves forward (A, B, C, D, E) and second moves backward (Z, Y, X, W, V).","difficulty":"moderate","source":"SSC CGL · SSC CHSL"},
  {"id":"reason-series-17","question":"Find the next term: 5, 11, 23, 47, 95, ?","options":["185","190","191","195"],"answer":2,"explanation":"Each term is doubled and 1 added: 95 × 2 + 1 = 191.","difficulty":"hard","source":"SSC CGL · RRB NTPC"},
  {"id":"reason-series-18","question":"Find the next term: 7, 26, 63, 124, 215, ?","options":["342","343","344","350"],"answer":0,"explanation":"n³ − 1 for n = 2…7: 7³ − 1 = 342.","difficulty":"very-hard","source":"SSC CGL · SSC CPO"},
  {"id":"reason-series-19","question":"Find the next term: 2, 6, 30, 210, ?","options":["2,100","2,310","2,520","1,890"],"answer":1,"explanation":"Products of the first primes: 2, 2×3, ×5, ×7, ×11 = 2,310.","difficulty":"hard"},
  {"id":"reason-series-20","question":"Find the next term: B2, E5, H8, K11, ?","options":["M13","N14","N13","O15"],"answer":1,"explanation":"Letters move 3 steps and the number is the letter’s position: N = 14.","difficulty":"hard"},
  {"id":"reason-series-21","question":"Find the next term: 4, 9, 25, 49, 121, ?","options":["144","169","196","225"],"answer":1,"explanation":"Squares of primes 2, 3, 5, 7, 11, 13; 13² = 169.","difficulty":"very-hard"},
  {"id":"reason-series-22","question":"Find the next term: 3, 7, 16, 35, 74, ?","options":["148","151","153","155"],"answer":2,"explanation":"×2 + 1, ×2 + 2, ×2 + 3, ×2 + 4, so 74 × 2 + 5 = 153.","difficulty":"very-hard"},
  {"id":"reason-series-23","question":"Find the next term: 6, 11, 21, 36, 56, ?","options":["76","81","86","91"],"answer":1,"explanation":"Differences grow by 5: +5, +10, +15, +20, +25, so 56 + 25 = 81.","difficulty":"very-hard"},
  {"id":"reason-series-24","question":"Find the next term: 120, 99, 80, 63, 48, ?","options":["35","33","36","39"],"answer":0,"explanation":"Each term is n² − 1 for n = 11, 10, 9, 8, 7, so the next is 6² − 1 = 35.","difficulty":"very-hard"},
  {"id":"reason-series-25","question":"Find the next term: 1, 2, 6, 15, 31, ?","options":["56","52","48","63"],"answer":0,"explanation":"The differences are 1, 4, 9, 16, i.e. squares; the next is 25, so 31 + 25 = 56.","difficulty":"very-hard"},
  {"id":"reason-series-26","question":"Find the next term: 2, 3, 10, 15, 26, 35, ?","options":["50","48","49","63"],"answer":0,"explanation":"The terms are n² + 1 for odd n and n² − 1 for even n: 1+1, 4−1, 9+1, 16−1, 25+1, 36−1, so next is 49 + 1 = 50.","difficulty":"very-hard"},
  {"id":"reason-series-27","question":"Find the wrong term: 5, 10, 17, 26, 37, 50, 64","options":["37","50","64","26"],"answer":2,"explanation":"The terms are n² + 1 for n = 2 to 8. The last should be 8² + 1 = 65, not 64.","difficulty":"very-hard"},
  {"id":"reason-series-28","question":"Find the next term: 3, 4, 7, 16, 43, ?","options":["124","130","121","118"],"answer":0,"explanation":"The differences are 1, 3, 9, 27, powers of 3, so the next difference is 81 and the term is 43 + 81 = 124. (Equivalently each term is 3 × previous − 5.)","difficulty":"very-hard","source":"SSC CGL · IBPS PO"},
  {"id":"reason-series-29","question":"Find the wrong term: 8, 13, 21, 34, 55, 88, 144","options":["88","55","34","144"],"answer":0,"explanation":"Each term is the sum of the two before it (a Fibonacci-type series): 34 + 55 = 89, not 88, and 55 + 89 = 144 confirms it.","difficulty":"very-hard","source":"SSC CGL · SSC CHSL"},
];

export default questions;

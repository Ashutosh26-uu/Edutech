import type { BankQuestion } from "@/lib/bank";

/** Number System, LCM and HCF (Quantitative Aptitude): 16 questions. Append new ones at the end with the next id; never reuse or renumber an id. */
const questions: BankQuestion[] = [
  {"id":"quant-number-system-1","question":"The LCM of 12 and 18 is:","options":["6","36","72","216"],"answer":1,"explanation":"12 = 2² × 3 and 18 = 2 × 3², so LCM = 2² × 3² = 36.","difficulty":"easy"},
  {"id":"quant-number-system-2","question":"The HCF of 36 and 48 is:","options":["6","8","12","144"],"answer":2,"explanation":"36 = 2² × 3², 48 = 2⁴ × 3; HCF = 2² × 3 = 12.","difficulty":"easy"},
  {"id":"quant-number-system-3","question":"Which of these numbers is divisible by 9?","options":["4,518","3,725","6,142","7,231"],"answer":0,"explanation":"4 + 5 + 1 + 8 = 18, a multiple of 9.","difficulty":"easy","source":"SSC CHSL · RRB Group D"},
  {"id":"quant-number-system-4","question":"The product of two numbers is 2,160 and their HCF is 12. Their LCM is:","options":["120","144","180","216"],"answer":2,"explanation":"LCM = product ÷ HCF = 2,160 ÷ 12 = 180.","difficulty":"moderate","source":"SSC CGL · RRB NTPC"},
  {"id":"quant-number-system-5","question":"What is the unit digit of 7³⁵?","options":["1","3","7","9"],"answer":1,"explanation":"Unit digits of powers of 7 cycle 7, 9, 3, 1. 35 leaves remainder 3 on division by 4, so the unit digit is 3.","difficulty":"moderate"},
  {"id":"quant-number-system-6","question":"The least number which leaves remainder 5 when divided by 12, 15 or 20 is:","options":["60","65","125","185"],"answer":1,"explanation":"LCM(12, 15, 20) = 60; 60 + 5 = 65.","difficulty":"moderate"},
  {"id":"quant-number-system-7","question":"If the three-digit number 7x6 is divisible by 11, the digit x is:","options":["2","3","4","5"],"answer":0,"explanation":"7 − x + 6 must be 0 or 11, so x = 2 (726 = 11 × 66).","difficulty":"hard"},
  {"id":"quant-number-system-8","question":"How many factors does 360 have?","options":["18","20","24","36"],"answer":2,"explanation":"360 = 2³ × 3² × 5, so the count is 4 × 3 × 2 = 24.","difficulty":"hard","source":"SSC CGL · IBPS PO"},
  {"id":"quant-number-system-9","question":"The unit digit of 2⁴³ × 3²² is:","options":["2","4","6","8"],"answer":0,"explanation":"2⁴³ ends in 8 (43 = 4k + 3) and 3²² ends in 9 (22 = 4k + 2); 8 × 9 = 72, so 2.","difficulty":"hard"},
  {"id":"quant-number-system-10","question":"The greatest number that divides 70 and 125 leaving remainders 5 and 8 respectively is:","options":["9","13","15","65"],"answer":1,"explanation":"HCF(70 − 5, 125 − 8) = HCF(65, 117) = 13.","difficulty":"very-hard","source":"SSC CGL · SSC CHSL"},
  {"id":"quant-number-system-11","question":"What is the remainder when 2⁵⁰ is divided by 7?","options":["1","2","4","6"],"answer":2,"explanation":"2³ = 8 leaves 1, so 2⁴⁸ leaves 1 and 2⁵⁰ = 2⁴⁸ × 4 leaves 4.","difficulty":"very-hard"},
  {"id":"quant-number-system-12","question":"How many zeros are there at the end of 100! (100 factorial)?","options":["20","22","24","25"],"answer":2,"explanation":"Count factors of 5: ⌊100/5⌋ + ⌊100/25⌋ = 20 + 4 = 24.","difficulty":"very-hard","source":"SSC CGL · IBPS PO"},
  {"id":"quant-number-system-13","question":"How many numbers from 1 to 300 are divisible by 4 or 6 but not by 5?","options":["80","100","75","85"],"answer":0,"explanation":"Divisible by 4 or 6: 75 + 50 − 25 (by 12) = 100. Of these, divisible by 5 means by 20 or 30: 15 + 10 − 5 (by 60) = 20. So 100 − 20 = 80.","difficulty":"very-hard","source":"SSC CGL · IBPS PO"},
  {"id":"quant-number-system-14","question":"What are the last two digits of 3⁷⁶?","options":["21","61","81","41"],"answer":0,"explanation":"3²⁰ ends in 01 (3¹⁰ = 59049 → 49, and 49² = 2401 → 01). So 3⁷⁶ = (3²⁰)³ × 3¹⁶ ends like 3¹⁶ = 81⁴: 81² → 61, 61² → 21.","difficulty":"very-hard","source":"SSC CGL · SSC CPO"},
  {"id":"quant-number-system-15","question":"Two numbers are in the ratio 4 : 5 and their LCM is 180. Their HCF is:","options":["9","20","36","45"],"answer":0,"explanation":"Let the numbers be 4k and 5k; since 4 and 5 are coprime, their HCF is k and LCM is 20k. 20k = 180 gives k = 9.","difficulty":"very-hard","source":"SSC CGL · SSC CHSL"},
  {"id":"quant-number-system-16","question":"What is the remainder when 1! + 2! + 3! + … + 50! is divided by 12?","options":["9","3","0","6"],"answer":0,"explanation":"4! = 24 and every later factorial is a multiple of 12, so only 1! + 2! + 3! = 1 + 2 + 6 = 9 matters.","difficulty":"very-hard","source":"SSC CGL · IBPS PO"},
];

export default questions;

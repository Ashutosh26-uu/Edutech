import type { BankQuestion } from "@/lib/bank";

/** Compound Interest (Quantitative Aptitude): 4 questions. Append new ones at the end with the next id; never reuse or renumber an id. */
const questions: BankQuestion[] = [
  {"id":"quant-ci-1","question":"Compound interest on ₹10,000 at 10% per annum for 2 years is:","options":["₹2,000","₹2,100","₹2,200","₹2,310"],"answer":1,"explanation":"10,000 × 1.21 = 12,100, so CI = ₹2,100.","difficulty":"easy"},
  {"id":"quant-ci-2","question":"The difference between CI and SI on ₹5,000 for 2 years at 10% is:","options":["₹25","₹50","₹100","₹500"],"answer":1,"explanation":"P(R/100)² = 5,000 × 0.01 = ₹50.","difficulty":"moderate"},
  {"id":"quant-ci-3","question":"₹8,000 at 5% compound interest for 2 years amounts to:","options":["₹8,400","₹8,800","₹8,820","₹9,000"],"answer":2,"explanation":"8,000 × 1.05² = 8,000 × 1.1025 = ₹8,820.","difficulty":"hard"},
  {"id":"quant-ci-4","question":"A sum doubles in 5 years at compound interest. In how many years will it become 8 times?","options":["10","15","20","40"],"answer":1,"explanation":"8 = 2³, so it takes 3 × 5 = 15 years.","difficulty":"very-hard"},
];

export default questions;

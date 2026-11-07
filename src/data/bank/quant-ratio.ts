import type { BankQuestion } from "@/lib/bank";

/** Ratio, Proportion and Mixtures (Quantitative Aptitude): 4 questions. Append new ones at the end with the next id; never reuse or renumber an id. */
const questions: BankQuestion[] = [
  {"id":"quant-ratio-1","question":"₹700 is divided in the ratio 3 : 4. The larger share is:","options":["₹300","₹350","₹400","₹450"],"answer":2,"explanation":"One part = 700 ÷ 7 = 100, so the larger share is 4 × 100 = ₹400.","difficulty":"easy"},
  {"id":"quant-ratio-2","question":"If A : B = 2 : 3 and B : C = 4 : 5, then A : C is:","options":["8 : 15","2 : 5","5 : 6","3 : 10"],"answer":0,"explanation":"A : C = (2/3) × (4/5) = 8/15.","difficulty":"moderate"},
  {"id":"quant-ratio-3","question":"The ages of A and B are in the ratio 4 : 5. After 5 years the ratio will be 5 : 6. What is A’s present age?","options":["15 years","20 years","25 years","30 years"],"answer":1,"explanation":"(4k + 5)/(5k + 5) = 5/6 gives 24k + 30 = 25k + 25, so k = 5 and A is 20.","difficulty":"hard"},
  {"id":"quant-ratio-4","question":"A 30-litre mixture has milk and water in the ratio 7 : 3. How much water must be added to make it 3 : 2?","options":["3 litres","5 litres","7 litres","9 litres"],"answer":1,"explanation":"Milk = 21 L, water = 9 L. For 3 : 2, water must be 21 × 2/3 = 14 L, so add 5 L.","difficulty":"very-hard"},
];

export default questions;

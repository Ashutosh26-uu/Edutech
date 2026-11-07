import type { BankQuestion } from "@/lib/bank";

/** Percentage (Quantitative Aptitude): 8 questions. Append new ones at the end with the next id; never reuse or renumber an id. */
const questions: BankQuestion[] = [
  {"id":"quant-percentage-1","question":"A price rises by 20% and then falls by 20%. The net change is:","options":["No change","4% decrease","4% increase","2% decrease"],"answer":1,"explanation":"Net change = −x²/100 = −400/100 = −4%.","difficulty":"hard"},
  {"id":"quant-percentage-2","question":"12.5% expressed as a fraction is:","options":["1/4","1/6","1/8","1/12"],"answer":2,"explanation":"12.5% = 12.5/100 = 1/8.","difficulty":"easy"},
  {"id":"quant-percentage-3","question":"If 40% of a number is 80, the number is:","options":["120","160","200","320"],"answer":2,"explanation":"Number = 80 ÷ 40 × 100 = 200.","difficulty":"moderate"},
  {"id":"quant-percentage-4","question":"In an election between two candidates, the winner got 60% of the votes and won by 1,200 votes. The total number of votes was:","options":["3,000","4,800","6,000","7,200"],"answer":2,"explanation":"The margin is 60% − 40% = 20% of the votes, so 20% = 1,200 and total = 6,000.","difficulty":"very-hard"},
  {"id":"quant-percentage-5","question":"If 20% of a number is 60, the number is:","options":["120","240","300","360"],"answer":2,"explanation":"20% × N = 60 ⇒ N = 60 × 5 = 300.","difficulty":"easy","source":"SSC CHSL · RRB Group D"},
  {"id":"quant-percentage-6","question":"A number is increased by 20% and then decreased by 20%. The net change is:","options":["No change","4% increase","4% decrease","2% decrease"],"answer":2,"explanation":"1.2 × 0.8 = 0.96, a 4% decrease. Successive x% up and x% down always loses x²/100 %.","difficulty":"moderate","source":"SSC CGL · IBPS Clerk"},
  {"id":"quant-percentage-7","question":"In an election between two candidates, the winner got 60% of the votes and won by 1,200 votes. Total votes polled:","options":["3,000","4,800","6,000","7,200"],"answer":2,"explanation":"Margin = 60% − 40% = 20% of total = 1,200 ⇒ total = 6,000.","difficulty":"hard","source":"SSC CGL · RRB NTPC"},
  {"id":"quant-percentage-8","question":"The price of sugar rises by 25%. By what percent must a family cut consumption to keep spending unchanged?","options":["20%","25%","30%","33⅓%"],"answer":0,"explanation":"Cut = 25/(100 + 25) × 100 = 20%.","difficulty":"very-hard","source":"SSC CGL · SBI Clerk"},
];

export default questions;

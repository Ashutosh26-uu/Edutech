import type { BankQuestion } from "@/lib/bank";

/** Simple Interest (Quantitative Aptitude): 8 questions. Append new ones at the end with the next id; never reuse or renumber an id. */
const questions: BankQuestion[] = [
  {"id":"quant-simple-interest-1","question":"At what rate of simple interest will a sum double itself in 10 years?","options":["5%","8%","10%","12%"],"answer":2,"explanation":"To double, SI = P, so P = P × R × 10 / 100, giving R = 10%.","difficulty":"moderate"},
  {"id":"quant-simple-interest-2","question":"Amount at simple interest equals:","options":["Principal × Rate","Principal + Simple Interest","Principal − Simple Interest","Rate × Time"],"answer":1,"explanation":"Amount = Principal + SI.","difficulty":"easy"},
  {"id":"quant-simple-interest-3","question":"The simple interest on ₹1,000 at 5% per annum for 2 years is:","options":["₹50","₹100","₹150","₹200"],"answer":1,"explanation":"SI = 1000 × 5 × 2 ÷ 100 = ₹100.","difficulty":"easy"},
  {"id":"quant-simple-interest-4","question":"A sum becomes ₹1,200 in 2 years and ₹1,500 in 5 years at simple interest. The rate of interest is:","options":["5%","8%","10%","12%"],"answer":2,"explanation":"Interest for 3 years = 1,500 − 1,200 = ₹300, so ₹100 per year. Principal = 1,200 − 2 × 100 = ₹1,000; rate = 100 ÷ 1,000 × 100 = 10%.","difficulty":"hard"},
  {"id":"quant-simple-interest-5","question":"Simple interest on ₹5,000 at 8% per annum for 3 years is:","options":["₹1,000","₹1,200","₹1,500","₹2,400"],"answer":1,"explanation":"SI = 5000 × 8 × 3 / 100 = ₹1,200.","difficulty":"easy","source":"RRB Group D · SSC CHSL"},
  {"id":"quant-simple-interest-6","question":"A sum doubles itself in 8 years at simple interest. The rate per annum is:","options":["8%","10%","12.5%","16%"],"answer":2,"explanation":"SI = P in 8 years ⇒ R = 100/8 = 12.5%.","difficulty":"moderate","source":"SSC CGL · IBPS Clerk"},
  {"id":"quant-simple-interest-7","question":"At simple interest a sum amounts to ₹6,500 in 3 years and ₹7,500 in 5 years. The sum is:","options":["₹4,500","₹5,000","₹5,500","₹6,000"],"answer":1,"explanation":"Two years’ interest = 1,000 ⇒ ₹500 per year ⇒ P = 6,500 − 1,500 = ₹5,000.","difficulty":"hard","source":"SSC CGL · RRB NTPC"},
  {"id":"quant-simple-interest-8","question":"A sum at simple interest becomes 3 times itself in 20 years. In how many years will it become 5 times?","options":["30","35","40","50"],"answer":2,"explanation":"Interest of 2P in 20 years ⇒ P per 10 years; 4P needs 40 years.","difficulty":"very-hard","source":"SSC CGL · SBI Clerk"},
];

export default questions;

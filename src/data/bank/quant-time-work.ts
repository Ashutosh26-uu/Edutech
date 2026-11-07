import type { BankQuestion } from "@/lib/bank";

/** Time and Work (Quantitative Aptitude): 7 questions. Append new ones at the end with the next id; never reuse or renumber an id. */
const questions: BankQuestion[] = [
  {"id":"quant-time-work-1","question":"If A can do a piece of work in 8 days, the fraction of work A does in one day is:","options":["1/4","1/8","1/16","8"],"answer":1,"explanation":"One day’s work = 1 ÷ 8 = 1/8.","difficulty":"easy"},
  {"id":"quant-time-work-2","question":"If 6 workers finish a job in 12 days, how many days will 9 workers take at the same rate?","options":["6","8","9","18"],"answer":1,"explanation":"Work = 6 × 12 = 72 worker-days; 72 ÷ 9 = 8 days.","difficulty":"moderate"},
  {"id":"quant-time-work-3","question":"A is twice as efficient as B. If together they finish a job in 12 days, A alone would take:","options":["18 days","24 days","36 days","16 days"],"answer":0,"explanation":"Let B’s rate be 1 and A’s 2: together 3 units/day, total work 36 units; A alone = 36 ÷ 2 = 18 days.","difficulty":"very-hard"},
  {"id":"quant-time-work-4","question":"A can finish a work in 10 days and B in 15 days. Together they finish it in:","options":["5 days","6 days","8 days","12 days"],"answer":1,"explanation":"1/10 + 1/15 = 1/6 ⇒ 6 days.","difficulty":"easy","source":"RRB Group D · SSC CHSL"},
  {"id":"quant-time-work-5","question":"A and B together finish a job in 12 days; A alone takes 20 days. B alone takes:","options":["24 days","30 days","32 days","40 days"],"answer":1,"explanation":"1/12 − 1/20 = 1/30 ⇒ 30 days.","difficulty":"moderate","source":"SSC CGL · IBPS Clerk"},
  {"id":"quant-time-work-6","question":"A can do a work in 12 days. After working 4 days he leaves and B finishes the rest in 16 days. B alone would take:","options":["20 days","24 days","28 days","32 days"],"answer":1,"explanation":"A did 1/3; B did 2/3 in 16 days ⇒ full work in 24 days.","difficulty":"hard","source":"SSC CGL · RRB NTPC"},
  {"id":"quant-time-work-7","question":"12 men complete a work in 18 days. After 6 days, 4 more men join. The remaining work is finished in:","options":["8 days","9 days","10 days","12 days"],"answer":1,"explanation":"Remaining = 12 × 12 = 144 man-days; 16 men ⇒ 9 days.","difficulty":"very-hard","source":"SSC CGL · SSC CPO"},
];

export default questions;

import type { BankQuestion } from "@/lib/bank";

/** Average (Quantitative Aptitude): 8 questions. Append new ones at the end with the next id; never reuse or renumber an id. */
const questions: BankQuestion[] = [
  {"id":"quant-average-1","question":"What is the average of the first 10 natural numbers?","options":["5","5.5","6","10"],"answer":1,"explanation":"Average of 1 to n = (n + 1) / 2 = 11 / 2 = 5.5.","difficulty":"easy"},
  {"id":"quant-average-2","question":"The average of 5 numbers is 20. Their sum is:","options":["4","25","100","120"],"answer":2,"explanation":"Sum = Average × Count = 20 × 5 = 100.","difficulty":"easy"},
  {"id":"quant-average-3","question":"The average of five consecutive odd numbers is 25. The largest of them is:","options":["27","29","31","33"],"answer":1,"explanation":"For consecutive numbers the average is the middle term, 25; the numbers are 21, 23, 25, 27, 29.","difficulty":"moderate"},
  {"id":"quant-average-4","question":"The average weight of 8 people increases by 2.5 kg when a person weighing 65 kg is replaced by a new person. The new person weighs:","options":["75 kg","80 kg","85 kg","90 kg"],"answer":2,"explanation":"Total increase = 8 × 2.5 = 20 kg, so the new person weighs 65 + 20 = 85 kg.","difficulty":"very-hard"},
  {"id":"quant-average-5","question":"The average of the first 10 natural numbers is:","options":["5","5.5","6","10"],"answer":1,"explanation":"Sum = 55; 55/10 = 5.5.","difficulty":"easy","source":"RRB Group D · SSC CHSL"},
  {"id":"quant-average-6","question":"The average of 8 numbers is 20. If each number is multiplied by 3, the new average is:","options":["23","40","60","160"],"answer":2,"explanation":"Multiplying every number by 3 multiplies the average by 3 ⇒ 60.","difficulty":"moderate","source":"SSC CGL · IBPS Clerk"},
  {"id":"quant-average-7","question":"The average weight of 30 students is 40 kg. When the teacher is included the average rises by 1 kg. The teacher’s weight is:","options":["61 kg","66 kg","71 kg","76 kg"],"answer":2,"explanation":"31 × 41 − 30 × 40 = 1,271 − 1,200 = 71 kg.","difficulty":"hard","source":"SSC CGL · RRB NTPC"},
  {"id":"quant-average-8","question":"The average of 11 results is 50. The average of the first six is 49 and of the last six is 52. The sixth result is:","options":["50","54","56","58"],"answer":2,"explanation":"6 × 49 + 6 × 52 − 11 × 50 = 294 + 312 − 550 = 56.","difficulty":"very-hard","source":"SSC CGL · SBI Clerk"},
];

export default questions;

import type { BankQuestion } from "@/lib/bank";

/** Time, Speed and Distance (Quantitative Aptitude): 4 questions. Append new ones at the end with the next id; never reuse or renumber an id. */
const questions: BankQuestion[] = [
  {"id":"quant-tsd-1","question":"72 km/h is equal to:","options":["18 m/s","20 m/s","25 m/s","36 m/s"],"answer":1,"explanation":"72 × 5/18 = 20 m/s.","difficulty":"easy"},
  {"id":"quant-tsd-2","question":"A 150 m long train passes a pole in 9 seconds. Its speed is:","options":["50 km/h","54 km/h","60 km/h","72 km/h"],"answer":2,"explanation":"150 ÷ 9 = 50/3 m/s; × 18/5 = 60 km/h.","difficulty":"moderate"},
  {"id":"quant-tsd-3","question":"Trains 120 m and 180 m long run in opposite directions at 40 km/h and 50 km/h. How long do they take to cross each other?","options":["10 seconds","12 seconds","15 seconds","18 seconds"],"answer":1,"explanation":"Relative speed = 90 km/h = 25 m/s; distance = 300 m; time = 12 s.","difficulty":"hard"},
  {"id":"quant-tsd-4","question":"A boat goes 24 km downstream in 2 hours and returns upstream in 3 hours. What is the speed of the stream?","options":["1 km/h","2 km/h","3 km/h","4 km/h"],"answer":1,"explanation":"Downstream 12 km/h, upstream 8 km/h; stream = (12 − 8) ÷ 2 = 2 km/h.","difficulty":"very-hard"},
];

export default questions;

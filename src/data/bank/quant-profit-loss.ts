import type { BankQuestion } from "@/lib/bank";

/** Profit and Loss (Quantitative Aptitude): 8 questions. Append new ones at the end with the next id; never reuse or renumber an id. */
const questions: BankQuestion[] = [
  {"id":"quant-profit-loss-1","question":"An article bought for ₹500 is sold for ₹600. The profit percentage is:","options":["10%","16.67%","20%","25%"],"answer":2,"explanation":"Profit = ₹100; profit % = 100 / 500 × 100 = 20%.","difficulty":"moderate"},
  {"id":"quant-profit-loss-2","question":"Profit and loss percentages are always calculated on the:","options":["Selling price","Marked price","Cost price","Discount"],"answer":2,"explanation":"Unless stated otherwise, profit % and loss % are on the cost price.","difficulty":"easy"},
  {"id":"quant-profit-loss-3","question":"A shopkeeper allows a 10% discount on a marked price of ₹800. The selling price is:","options":["₹700","₹720","₹780","₹790"],"answer":1,"explanation":"Discount = 10% of 800 = ₹80, so SP = ₹720.","difficulty":"moderate"},
  {"id":"quant-profit-loss-4","question":"The cost price of 20 articles equals the selling price of 16 articles. The profit percentage is:","options":["20%","25%","30%","40%"],"answer":1,"explanation":"Let CP of each article be ₹1: CP = 20, SP of 16 = 20, so SP of each = 1.25. Profit = 25%.","difficulty":"very-hard"},
  {"id":"quant-profit-loss-5","question":"An article bought for ₹400 is sold for ₹500. The profit percent is:","options":["20%","25%","30%","40%"],"answer":1,"explanation":"Profit = 100 on CP 400 ⇒ 25%.","difficulty":"easy","source":"RRB Group D · SSC CHSL"},
  {"id":"quant-profit-loss-6","question":"A shopkeeper marks an article 40% above cost and gives a 20% discount. His profit percent is:","options":["12%","16%","20%","24%"],"answer":0,"explanation":"SP = 1.4 × 0.8 = 1.12 × CP ⇒ 12% profit.","difficulty":"moderate","source":"SSC CGL · IBPS Clerk"},
  {"id":"quant-profit-loss-7","question":"The cost price of 20 articles equals the selling price of 16 articles. The gain percent is:","options":["20%","25%","30%","40%"],"answer":1,"explanation":"SP/CP per article = 20/16 = 1.25 ⇒ 25% gain.","difficulty":"hard","source":"SSC CGL · RRB NTPC"},
  {"id":"quant-profit-loss-8","question":"A dishonest dealer sells at cost price but uses a weight of 800 g for 1 kg. His gain percent is:","options":["20%","25%","30%","40%"],"answer":1,"explanation":"Gain = error/(true − error) = 200/800 = 25%.","difficulty":"very-hard","source":"SSC CGL · SSC CPO"},
];

export default questions;

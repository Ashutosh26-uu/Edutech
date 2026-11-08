import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Three sectors of the economy",
      points: [
        "Primary: uses natural resources directly – agriculture, forestry, fishing, mining and quarrying",
        "Secondary: turns raw material into goods – manufacturing, construction, electricity, gas and water supply",
        "Tertiary (services): trade, transport, banking, insurance, IT, education, health, public administration",
        "Agriculture still employs the largest share of workers, about 46% (PLFS 2023-24)",
        "Services give the largest share of GVA (more than half); agriculture's GVA share is under one-fifth",
      ],
    },
    {
      heading: "MSMEs and core industries",
      points: [
        "MSME criteria (2020, composite of investment AND turnover): micro ≤ ₹1 cr / ₹5 cr, small ≤ ₹10 cr / ₹50 cr, medium ≤ ₹50 cr / ₹250 cr",
        "Limits were raised again from 1 April 2025 (Budget 2025-26); exams set before that still use the 2020 figures",
        "Index of Eight Core Industries: released monthly by the Office of the Economic Adviser, DPIIT; base year 2011-12",
        "Weights in descending order: refinery products 28.04%, electricity 19.85%, steel 17.92%, coal 10.33%, crude oil 8.98%, natural gas 6.88%, cement 5.37%, fertilisers 2.63%",
      ],
    },
    {
      heading: "Farm schemes",
      points: [
        "Kisan Credit Card 1998 – based on the R.V. Gupta Committee; short-term crop credit through banks",
        "Soil Health Card – February 2015, launched at Suratgarh (Rajasthan)",
        "PMFBY 2016 – farmer premium capped at 2% kharif, 1.5% rabi, 5% commercial/horticultural crops",
        "e-NAM April 2016 – online pan-India mandi platform, implemented by SFAC under the Agriculture Ministry",
        "PM-KISAN 2019 – ₹6,000 a year in three ₹2,000 instalments by DBT; fully Centre-funded",
        "PM-KUSUM 2019 – solar pumps and grid-connected solar for farmers; Ministry of New and Renewable Energy",
      ],
    },
    {
      heading: "Financial inclusion and enterprise",
      points: [
        "PM Jan Dhan Yojana – 28 August 2014; zero-balance accounts with RuPay card and overdraft",
        "PMJJBY (life, ₹2 lakh, age 18–50) ₹436/year and PMSBY (accident, ₹2 lakh, age 18–70) ₹20/year – both 2015, premiums revised 2022",
        "Atal Pension Yojana 2015 – administered by PFRDA; pension ₹1,000–₹5,000 a month after 60; join at 18–40",
        "MUDRA April 2015 – Shishu up to ₹50,000, Kishore up to ₹5 lakh, Tarun up to ₹10 lakh (Tarun Plus up to ₹20 lakh added in 2024)",
        "Stand-Up India 5 April 2016 – ₹10 lakh to ₹1 crore for greenfield units of SC/ST and women entrepreneurs",
        "Startup India 16 January 2016 – coordinated by DPIIT; Digital India 1 July 2015 – MeitY",
      ],
    },
    {
      heading: "Welfare and infrastructure schemes",
      points: [
        "MGNREGA 2005 – 100 days of wage work per rural household a year; demand-driven, unemployment allowance if work not given within 15 days; Ministry of Rural Development",
        "Ujjwala 1 May 2016 – free LPG connections to women of poor households; Ministry of Petroleum and Natural Gas",
        "Ayushman Bharat PM-JAY September 2018 – ₹5 lakh per family per year for hospital care; run by the National Health Authority; all citizens 70+ covered from 2024",
        "Jal Jeevan Mission 2019 – tap water to every rural home; Ministry of Jal Shakti",
        "SVAMITVA 24 April 2020 – drone survey and property cards for village homes; Ministry of Panchayati Raj",
        "PM SVANidhi June 2020 – collateral-free working-capital loans for street vendors; Ministry of Housing and Urban Affairs",
        "PM Vishwakarma 17 September 2023 – artisans in 18 trades; Ministry of MSME",
        "PM Surya Ghar Muft Bijli 2024 – rooftop solar for 1 crore households, up to 300 free units a month",
      ],
    },
  ],
  formulas: [
    "Launch order: KCC 1998 → MGNREGA 2005 → Jan Dhan 2014 → MUDRA/APY/PMJJBY/PMSBY 2015 → Stand-Up, Ujjwala, PMFBY, e-NAM 2016 → PM-JAY 2018 → PM-KISAN, PM-KUSUM, JJM 2019 → SVANidhi 2020 → Vishwakarma 2023 → Surya Ghar 2024",
    "PMJJBY + PMSBY together = ₹456 a year",
    "Nodal ministries: PMAY-G – Rural Development; PM MITRA parks – Textiles; PM-JAY – Health; Ujjwala – Petroleum",
  ],
  traps: [
    "Confusing employment share with GVA share: agriculture leads in jobs, services lead in output",
    "Treating MSME limits as 'either' when deciding the lower class – the unit must satisfy both investment and turnover limits to stay in a category",
    "Writing PMJJBY/PMSBY premiums as ₹330/₹12 – those were the pre-2022 figures",
    "Putting construction in the tertiary sector or mining in the secondary sector",
  ],
  examTips: [
    "SSC, RRB NTPC and state exams ask direct launch year, amount or ministry; UPSC-style papers use 'how many statements are correct' and match-the-ministry formats",
    "Chronology questions are common – memorise the launch-order line above",
  ],
};

export default notes;

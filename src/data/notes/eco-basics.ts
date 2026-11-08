import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "National income",
      points: [
        "GDP: market value of all final goods and services produced within a country’s borders in a year.",
        "GNP = GDP + net factor income from abroad (counts nationals, not territory).",
        "Net = Gross − depreciation; factor cost = market price − net indirect taxes (indirect taxes − subsidies).",
        "National income = NNP at factor cost. Per capita income = national income ÷ population.",
        "Three methods: production (value added), income, expenditure. Only final goods are counted to avoid double counting.",
        "Nominal GDP uses current prices; real GDP uses base-year prices. GDP deflator = nominal ÷ real × 100.",
        "In India, GDP estimates are released by the National Statistical Office (NSO), Ministry of Statistics.",
      ],
    },
    {
      heading: "RBI and monetary policy",
      points: [
        "RBI set up on 1 April 1935 under the RBI Act, 1934 (Hilton Young Commission); nationalised in 1949; HQ Mumbai.",
        "First Governor: Sir Osborne Smith; first Indian Governor: C. D. Deshmukh.",
        "Repo rate: rate at which RBI lends short-term to banks against securities. Reverse repo: rate at which RBI absorbs money from banks.",
        "CRR: share of deposits banks keep as cash with the RBI. SLR: share kept in liquid assets (cash, gold, government securities) by the bank itself.",
        "MSF: emergency overnight borrowing by banks above the repo rate. Bank rate: longer-term lending rate with no repurchase agreement; kept aligned to MSF.",
        "Higher repo/CRR/SLR = tight money (fights inflation); lower = cheap money (boosts growth).",
        "Monetary Policy Committee (since 2016): 6 members, 3 from RBI, Governor has the casting vote; decides the repo rate.",
        "Inflation target (RBI Act amended 2016): CPI inflation 4% with a band of 2%–6%, reviewed every five years.",
      ],
    },
    {
      heading: "Money, inflation and budget",
      points: [
        "M1 (narrow money) = currency with public + demand deposits + other deposits with RBI. M3 (broad money) = M1 + time deposits.",
        "WPI is released by the Office of the Economic Adviser (DPIIT); CPI (Combined) by the NSO. RBI targets CPI.",
        "Core inflation excludes volatile food and fuel. Inflation hurts lenders and fixed-income earners, helps borrowers.",
        "Phillips curve: short-run inverse relation between inflation and unemployment.",
        "Revenue deficit = revenue expenditure − revenue receipts.",
        "Fiscal deficit = total expenditure − (revenue receipts + non-debt capital receipts) = government’s borrowing need.",
        "Primary deficit = fiscal deficit − interest payments.",
      ],
    },
    {
      heading: "Institutions and reforms",
      points: [
        "NITI Aayog replaced the Planning Commission (1950) on 1 January 2015; the Prime Minister is its chairperson.",
        "GST launched 1 July 2017 via the 101st Amendment (2016); GST Council (Art 279A) chaired by the Union Finance Minister.",
        "GST rates were rationalised to mainly 5% and 18% (plus 40% on sin/luxury goods) from 22 September 2025.",
        "“Hindu rate of growth” (about 3.5% in 1950–80) was coined by Raj Krishna.",
        "Disguised unemployment is most common in agriculture.",
        "Reports: Human Development Report – UNDP; World Development Report – World Bank; World Economic Outlook – IMF.",
      ],
    },
  ],
  formulas: [
    "GDP (expenditure) = C + I + G + (X − M).",
    "NDP = GDP − depreciation; GNP = GDP + NFIA; GDP at FC = GDP at MP − indirect taxes + subsidies.",
    "Money multiplier = 1 ÷ reserve ratio. 20% reserve → ×5, so ₹1,000 crore new reserves → up to ₹5,000 crore deposits.",
    "Primary deficit = fiscal deficit − interest payments.",
  ],
  traps: [
    "Repo = RBI lends to banks; reverse repo = RBI borrows from banks — do not swap.",
    "CRR is held with the RBI; SLR is held by the bank itself.",
    "GDP counts production within borders; GNP counts production by nationals anywhere.",
    "WPI is not released by the RBI or NSO but by the Office of the Economic Adviser, DPIIT.",
    "RBI was nationalised in 1949, not founded then.",
  ],
  examTips: [
    "Banking (IBPS, SBI, RBI) exams ask policy rates, MPC, inflation target and money supply measures.",
    "SSC and UPSC ask national income identities, deficit definitions and small numerical cases (expenditure method, multiplier).",
  ],
};

export default notes;

import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Money supply",
      points: [
        "M0 (reserve/high-powered money) = currency in circulation + bankers' deposits with RBI + other deposits with RBI.",
        "M1 (narrow, most liquid) = currency with public + demand deposits with banks + other deposits with RBI; cash in hand with banks is excluded.",
        "M2 = M1 + post office savings deposits; M3 (broad money) = M1 + time deposits with banks; M4 = M3 + all post office deposits (except NSCs).",
        "₹1 notes and all coins are issued by the Government (Ministry of Finance); other notes by the RBI; ₹1-and-above coins are legal tender up to ₹1,000 (Coinage Act 2011).",
        "Minimum Reserve System 1957: RBI holds ₹200 crore in gold and forex, of which ₹115 crore in gold.",
        "₹ symbol adopted 2010; ₹2,000 notes withdrawn from circulation 19 May 2023 (still legal tender); retail e-rupee pilot from 1 December 2022.",
      ],
    },
    {
      heading: "Inflation",
      points: [
        "Inflation: sustained rise in the general price level. Demand-pull: demand exceeds supply. Cost-push: input costs rise, can coexist with unemployment (stagflation).",
        "By speed: creeping (2–3%), walking, galloping (double/triple digit), hyperinflation (often >50% a month).",
        "Disinflation: slower rise; deflation: fall in prices; reflation: deliberate push-up from a slump; skewflation: rise in a few items (e.g. food); shrinkflation: smaller pack, same price.",
        "Base effect: low or high base last year distorts year-on-year inflation. Wage-price spiral: wages and prices chase each other.",
        "Unexpected inflation hurts creditors, pensioners and fixed-income earners; helps borrowers.",
        "WPI: Office of the Economic Adviser, DPIIT (Ministry of Commerce), no services; CPI (Combined): NSO, MoSPI, much bigger food weight; GDP deflator covers all domestic output.",
      ],
    },
    {
      heading: "Monetary policy and the RBI",
      points: [
        "Urjit Patel Committee (2014) → RBI Act 1934 amended 2016 for flexible inflation targeting and the MPC.",
        "Target CPI 4% ± 2%, set by the Government every five years; failure = outside the band for three consecutive quarters.",
        "MPC: six members (three RBI incl. Governor, three Government nominees), quorum four, Governor's casting vote, at least four meetings a year; it fixes the repo rate.",
        "Corridor: SDF floor (since April 2022) < repo < MSF = bank rate (ceiling). CRR kept with RBI as cash; SLR held in liquid assets by the bank itself.",
        "OMO purchase injects liquidity; sale absorbs it. MSS (2004) absorbed surplus liquidity from capital inflows. External benchmark lending from 1 October 2019 speeds transmission.",
        "Qualitative tools: moral suasion, margin requirements. Bimal Jalan Committee set the Economic Capital Framework; RBI's year became April–March from 2020–21.",
      ],
    },
    {
      heading: "BoP and the rupee",
      points: [
        "Current account = merchandise trade + invisibles (services, primary income, transfers/remittances).",
        "Capital account: FDI, FPI, external commercial borrowing, external aid, NRI deposits; overall balance changes forex reserves.",
        "Forex reserves: foreign currency assets, gold, SDRs, reserve tranche with the IMF.",
        "LERMS 1992 → unified market rate 1993 → current account convertibility 1994 → FEMA replaced FERA (in force 2000); Tarapore committees on capital account convertibility.",
        "Regime: managed float. Depreciation is market-driven; devaluation is official. Appreciation makes exports costlier and cuts imported inflation.",
        "REER: trade-weighted, inflation-adjusted rupee value.",
      ],
    },
  ],
  formulas: [
    "Money multiplier = M3 ÷ M0 (e.g. 240 ÷ 40 = 6); simple deposit multiplier = 1 ÷ CRR.",
    "Fisher: MV = PT (M money, V velocity, P price level, T transactions).",
    "Inflation % = (new index − old index) ÷ old index × 100; fall in purchasing power = rise ÷ new index × 100.",
    "Real interest ≈ nominal − inflation; post-tax real = nominal × (1 − tax rate) − inflation.",
    "Rule of 70: years for prices to double ≈ 70 ÷ inflation rate.",
    "PPP: rupee depreciates ≈ Indian inflation − foreign inflation.",
  ],
  traps: [
    "M1 is the most liquid; M3 is broad money — don't reverse them.",
    "Selling securities through OMOs reduces money supply; buying increases it.",
    "Cost-push inflation is not cured well by rate hikes; that mainly tames demand-pull.",
    "Merchandise exports are not 'invisibles'; external borrowing is capital account, not current.",
  ],
  examTips: [
    "Bank PO and SSC: M0–M4 definitions, tool effects and who publishes WPI/CPI.",
    "UPSC: statement traps on the MPC and BoP plus short numericals on multipliers, real rates and index changes.",
  ],
};

export default notes;

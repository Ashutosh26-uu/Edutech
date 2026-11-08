import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "RBI basics",
      points: [
        "Set up under the RBI Act, 1934; began operations on 1 April 1935.",
        "Nationalised on 1 January 1949; central office moved from Kolkata to Mumbai in 1937.",
        "Functions: monetary policy, issuing currency (except ₹1 notes and coins, issued by the Government), banker to government, banker’s bank, regulator, forex manager.",
        "RBI does NOT accept deposits from or lend to the general public.",
        "Monetary Policy Committee: 6 members; inflation target 4% with a band of ±2% (CPI).",
      ],
    },
    {
      heading: "Monetary tools",
      points: [
        "CRR: share of deposits kept as cash with the RBI; earns no interest.",
        "SLR: share of deposits kept by banks themselves in liquid assets (cash, gold, approved securities).",
        "Repo rate: rate at which RBI lends short-term to banks against securities.",
        "Reverse repo / SDF: rate RBI pays banks for parking surplus funds; SDF sits below repo.",
        "MSF: emergency overnight borrowing for banks, priced above the repo rate.",
        "Since October 2019, new floating retail loans must be linked to an external benchmark (mostly the repo rate).",
      ],
    },
    {
      heading: "Banking history",
      points: [
        "Banking Regulation Act: 1949.",
        "SBI formed on 1 July 1955 from the Imperial Bank of India.",
        "14 major banks nationalised in July 1969; 6 more in 1980.",
        "Regional Rural Banks: 1975. NABARD: 1982. SIDBI: 1990.",
        "Mergers in 2019–20 cut public sector banks to 12 (effective April 2020).",
      ],
    },
    {
      heading: "Payment systems",
      points: [
        "NEFT: National Electronic Funds Transfer, settles in half-hourly batches, 24×7 since December 2019.",
        "RTGS: Real Time Gross Settlement, minimum ₹2 lakh, 24×7 since December 2020.",
        "IMPS: instant 24×7 transfer run by NPCI.",
        "NPCI set up in 2008; runs UPI (2016), RuPay, IMPS, NACH, AePS and FASTag (NETC).",
        "IFSC: 11 characters (4 letters for bank, 0, 6-character branch code); MICR: 9 digits.",
      ],
    },
    {
      heading: "Bank types, safety and schemes",
      points: [
        "Payments banks: no loans or credit cards; deposits up to ₹2 lakh per customer (since 2021).",
        "Small finance banks: lend mainly to small businesses, farmers and the unorganised sector.",
        "DICGC (wholly owned RBI subsidiary) insures deposits up to ₹5 lakh per depositor per bank (since 2020).",
        "CRAR minimum for Indian banks: 9%, plus a 2.5% capital conservation buffer.",
        "Priority sector lending target for domestic scheduled commercial banks: 40% of ANBC.",
        "Pradhan Mantri Jan Dhan Yojana launched in August 2014 for financial inclusion.",
      ],
    },
    {
      heading: "Instruments and terms",
      points: [
        "Cheque valid for 3 months from its date; bounce for insufficient funds is an offence under Section 138, NI Act 1881.",
        "Certificate of Deposit: issued by banks; Commercial Paper: issued by companies.",
        "KYC: Know Your Customer; NPA: loan overdue for more than 90 days.",
        "ATM: Automated Teller Machine; CBS: Core Banking Solution.",
      ],
    },
  ],
  formulas: [
    "CRR → with RBI, no interest; SLR → with the bank itself",
    "SDF < Repo < MSF (corridor)",
    "Deposit insurance ₹5 lakh; payments bank deposit cap ₹2 lakh; RTGS minimum ₹2 lakh",
    "CRAR 9% + CCB 2.5%; PSL 40% of ANBC",
  ],
  traps: [
    "Saying CRR is kept with the bank; it is with the RBI. SLR stays with the bank.",
    "Thinking MSF is cheaper than repo; it is a penalty-style higher rate.",
    "Believing payments banks can give loans.",
    "Confusing RBI’s start (1935) with its Act (1934) and nationalisation (1949).",
    "Rates like repo and CRR change often; check the latest RBI policy before the exam.",
  ],
  examTips: [
    "IBPS/SBI PO and Clerk mains and RBI Assistant/Grade B ask the most banking awareness.",
    "Statement-count and assertion–reason forms are common in recent papers.",
    "Current policy rates and newly launched schemes are asked from the last 6 months of news.",
  ],
};

export default notes;

import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Planning in India",
      points: [
        "Pre-independence plans: Bombay Plan 1944 (industrialists), Gandhian Plan 1944 (S.N. Agarwal), People's Plan 1945 (M.N. Roy), Sarvodaya Plan 1950 (J.P. Narayan).",
        "Planning Commission: March 1950 by Cabinet resolution; PM chairs; first Deputy Chairman Gulzarilal Nanda.",
        "1st (1951–56) Harrod–Domar, agriculture; 2nd (1956–61) Mahalanobis, heavy industry; 3rd hit by wars and drought → Plan Holiday 1966–69 (Annual Plans).",
        "5th ended a year early in 1978; Rolling Plan 1978–80 by the Janata government; two Annual Plans 1990–92; 8th (1992–97) first after the 1991 reforms.",
        "11th (2007–12) 'faster and more inclusive growth'; 12th (2012–17) 'faster, more inclusive and sustainable growth' was the last.",
        "NITI Aayog 1 January 2015 (Cabinet resolution; PM chairs; first Vice-Chairperson Arvind Panagariya); a think tank with no power to allot funds; 15-year vision, 7-year strategy, 3-year action agenda.",
      ],
    },
    {
      heading: "Budget and the Constitution",
      points: [
        "Art 112 Annual Financial Statement; 113 demands for grants; 114 Appropriation Bill; 115 supplementary, additional and excess grants; 116 vote on account, vote of credit, exceptional grants.",
        "Art 110 Money Bill (only in Lok Sabha); Art 265 no tax without law; Art 266 Consolidated Fund and Public Account; Art 267 Contingency Fund (at the President's disposal).",
        "Charged expenditure (not voted): President's emoluments, SC judges' salaries, CAG, interest and debt charges.",
        "Rajya Sabha does not vote on demands for grants; tax proposals pass through the Finance Bill.",
        "Cut motions: policy cut (reduce to ₹1), economy cut (by a stated sum), token cut (by ₹100).",
        "Firsts: budget 26 Nov 1947 (R.K. Shanmukham Chetty); Railway Budget separated 1924 (Acworth), merged from 2017–18; Gender and Outcome Budgets 2005–06; financial year 1 April–31 March.",
      ],
    },
    {
      heading: "Receipts and deficits",
      points: [
        "Revenue receipts: tax and non-tax (interest, dividends, fees). Capital receipts: borrowings, loan recoveries, disinvestment.",
        "Fiscal deficit shows total borrowing need; a primary surplus (negative primary deficit) arises when interest payments exceed the fiscal deficit.",
        "Monetised deficit: part of borrowing met by the RBI; automatic ad hoc T-bills ended 1 April 1997.",
        "Union Budget 2025–26 fiscal deficit target: 4.4% of GDP (BE).",
      ],
    },
    {
      heading: "Taxes and GST",
      points: [
        "Direct: income, corporate tax; indirect: GST, customs. Progressive (rate rises with income), proportional (flat), regressive (heavier on the poor); indirect taxes tend to be regressive.",
        "GST: 101st Amendment 2016 (Art 246A, 269A, 279A), from 1 July 2017; destination-based; CGST + SGST within a state, IGST inter-state.",
        "GST Council: Union FM chairs; Centre one-third of votes, states two-thirds; decisions need three-fourths; states' compensation promised for five years.",
        "Outside GST: alcohol for human consumption, basic customs duty; crude, petrol, diesel, ATF and natural gas stay out until the Council recommends a date.",
        "Rate rationalisation from 22 September 2025: two main slabs, 5% and 18%.",
        "Laffer curve: tax rate vs revenue; Pigouvian tax corrects harmful externalities (e.g. carbon tax).",
      ],
    },
    {
      heading: "FRBM and devolution",
      points: [
        "FRBM Act 2003, in force 2004; N.K. Singh Committee (2017): general government debt 60% of GDP (Centre 40, states 20), fiscal deficit 3%.",
        "80th Amendment (2000): states get a share of the divisible pool of all Union taxes; 15th Finance Commission: 41% to states.",
      ],
    },
  ],
  formulas: [
    "Revenue deficit = revenue expenditure − revenue receipts.",
    "Fiscal deficit = total expenditure − (revenue receipts + non-debt capital receipts).",
    "Primary deficit = fiscal deficit − interest payments.",
    "Effective revenue deficit = revenue deficit − grants for creation of capital assets (since 2011–12).",
    "Tax buoyancy = % change in tax revenue ÷ % change in GDP (e.g. 15% ÷ 10% = 1.5).",
  ],
  traps: [
    "Interest received is a revenue receipt; recovery of loans is a capital receipt.",
    "Borrowing does not reduce the fiscal deficit; it finances it.",
    "Contingency Fund advances must later be approved by Parliament and recouped from the Consolidated Fund.",
    "NITI Aayog, like the Planning Commission, is non-statutory; neither was set up by an Act.",
  ],
  examTips: [
    "Bank and SSC papers ask plan models, Article numbers and GST basics.",
    "UPSC adds statement traps on NITI, FRBM and the GST Council, and short deficit numericals; practise the formulas with numbers.",
  ],
};

export default notes;

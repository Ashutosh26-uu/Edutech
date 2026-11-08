import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "President: election and removal",
      points: [
        "Art 52: there shall be a President; Art 53: executive power and supreme command of the Defence Forces vest in the President.",
        "Art 54: electoral college of elected MPs and elected MLAs of States, Delhi and Puducherry (UTs added by the 70th Amendment, 1992); nominated members and MLCs do not vote.",
        "Art 55: proportional representation by single transferable vote, secret ballot; State population taken from the 1971 Census (frozen until the first census after 2026).",
        "Art 56: five-year term from entering office; resignation addressed to the Vice-President. Art 57: eligible for re-election.",
        "Art 58: citizen, at least 35, qualified for the Lok Sabha, no office of profit. Art 60: oath administered by the Chief Justice of India.",
        "Art 61 impeachment: only for 'violation of the Constitution'; either House; 14 days' notice signed by one-fourth of its members; two-thirds of total membership of each House.",
        "Art 62: vacancy filled within six months. Art 71: election disputes decided by the Supreme Court.",
        "Droupadi Murmu has been President since July 2022.",
      ],
    },
    {
      heading: "President: powers",
      points: [
        "Art 72: pardon, commutation, remission, respite, reprieve — covers court-martial, Union-law offences and death sentences.",
        "Pardon removes sentence and conviction; commutation swaps a lighter form; remission cuts the period; respite lessens it for a special reason (e.g. pregnancy); reprieve stays it temporarily.",
        "Art 123 ordinance: only when Parliament (either House) is not in session; lapses six weeks after reassembly, so the maximum life is about six months and six weeks.",
        "Veto: absolute, suspensive (return once, except Money Bills) and pocket veto (Zail Singh, 1986, Indian Post Office Bill); assent to Constitutional Amendment Bills is compulsory (24th Amendment).",
        "Nominates 12 members to the Rajya Sabha (Art 80); nomination of two Anglo-Indians to the Lok Sabha ended with the 104th Amendment (2020).",
      ],
    },
    {
      heading: "Vice-President",
      points: [
        "Art 63: office created; Art 64: ex-officio Chairman of the Rajya Sabha; Art 65: acts as President for up to six months in a vacancy.",
        "Art 66: elected by all members (elected and nominated) of both Houses; STV by secret ballot; at least 35 and qualified for the Rajya Sabha.",
        "Art 67: five-year term; removed by a Rajya Sabha resolution passed by a majority of all its then members and agreed to by the Lok Sabha; 14 days' notice; no grounds stated.",
        "Art 69: oath before the President. While acting as President he does not act as Rajya Sabha Chairman.",
        "C. P. Radhakrishnan became Vice-President in September 2025 after Jagdeep Dhankhar resigned.",
      ],
    },
    {
      heading: "Prime Minister and Council of Ministers",
      points: [
        "Art 74(1): Council of Ministers headed by the PM aids and advises the President; advice binding (42nd Amendment), may be sent back once for reconsideration (44th).",
        "Art 75(1): PM appointed by the President, other ministers on the PM's advice; 75(1A): ministry capped at 15% of Lok Sabha strength (91st Amendment, 2003).",
        "Art 75(3): collective responsibility to the Lok Sabha (borrowed from Britain); 75(5): a non-member can be minister for six months.",
        "Art 78: PM must communicate Cabinet decisions and furnish information to the President. Art 88: ministers may speak in both Houses but vote only in their own.",
        "Narendra Modi has been PM since 2014 (third term from 2024).",
      ],
    },
  ],
  formulas: [
    "Value of an MLA's vote = State population (1971) ÷ (elected MLAs × 1000)",
    "Value of an MP's vote = total value of all MLAs' votes ÷ total elected MPs",
    "Ordinance maximum life = 6 months (gap between sessions) + 6 weeks",
    "Ministry size ≤ 15% of Lok Sabha strength, including the PM",
  ],
  traps: [
    "Impeachment ground is 'violation of the Constitution', not 'misbehaviour or incapacity' (that is for judges).",
    "The Vice-President's electoral college includes nominated members but no MLAs.",
    "The President resigns to the Vice-President; the Vice-President resigns to the President.",
    "Collective responsibility is to the Lok Sabha only, not to Parliament as a whole.",
  ],
  examTips: [
    "SSC, RRB and State PSC papers ask direct Article numbers (52, 54, 61, 72, 74, 75, 123).",
    "UPSC Prelims prefers statement-count and assertion–reason items on the electoral college, ordinances, pardon types and vote-value arithmetic.",
  ],
};

export default notes;

import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Composition",
      points: [
        "Art 79: Parliament = President + Rajya Sabha (Council of States) + Lok Sabha (House of the People).",
        "Lok Sabha: 543 elected seats at present; the 2 nominated Anglo-Indian seats ended under the 104th Amendment (2019).",
        "Rajya Sabha: maximum 250 = 238 elected + 12 nominated by the President (art, literature, science, social service).",
        "Rajya Sabha members are elected by elected MLAs by proportional representation with single transferable vote.",
        "Minimum age: 25 years for Lok Sabha, 30 years for Rajya Sabha.",
      ],
    },
    {
      heading: "Tenure and presiding officers",
      points: [
        "Lok Sabha: 5-year term; can be dissolved earlier; can be extended one year at a time during a National Emergency.",
        "Rajya Sabha: permanent House, never dissolved; one-third of members retire every two years; member’s term 6 years.",
        "Speaker is elected by Lok Sabha members; resigns by writing to the Deputy Speaker.",
        "Vice-President is the ex-officio Chairman of the Rajya Sabha (not a member of it).",
        "Pro tem Speaker (usually the senior-most member) administers oath to new members.",
      ],
    },
    {
      heading: "Sessions and procedure",
      points: [
        "Art 85: gap between two sessions cannot exceed six months; usually three sessions — Budget, Monsoon, Winter.",
        "Quorum: one-tenth of the total membership of the House.",
        "Question Hour: first hour of a sitting. Starred question = oral answer; unstarred = written answer.",
        "Zero Hour: right after Question Hour; an Indian innovation, not mentioned in the rules.",
        "No-confidence motion: only in Lok Sabha, needs the support of 50 members; no reason has to be stated.",
        "Tenth Schedule (anti-defection) added by the 52nd Amendment (1985).",
      ],
    },
    {
      heading: "Bills and money matters",
      points: [
        "Art 110 Money Bill: deals only with taxes, borrowing, Consolidated/Contingency Fund, appropriation etc.; fines or fees for services do not make a bill a Money Bill.",
        "Money Bill: introduced only in Lok Sabha, with the President’s recommendation; Speaker’s certificate is final.",
        "Rajya Sabha can only recommend changes and must return a Money Bill within 14 days.",
        "Art 108 joint sitting: called by the President to resolve a deadlock on ordinary bills; presided over by the Speaker.",
        "No joint sitting on Money Bills or Constitution Amendment Bills.",
        "Joint sittings held three times: Dowry Prohibition (1961), Banking Service Commission Repeal (1978), POTA (2002).",
        "Art 112: Annual Financial Statement (Budget). Art 114: Appropriation Bill. Art 266: Consolidated Fund; Art 267: Contingency Fund.",
      ],
    },
    {
      heading: "Special powers of the Rajya Sabha",
      points: [
        "Art 249: lets Parliament legislate on a State List subject in national interest, by a resolution backed by two-thirds present and voting.",
        "Art 312: can authorise creation of new All-India Services by a similar two-thirds resolution.",
      ],
    },
  ],
  formulas: [
    "Ages: Lok Sabha 25, Rajya Sabha 30.",
    "Rajya Sabha: 250 max = 238 + 12; one-third retire every 2 years; 6-year term.",
    "Quorum = 1/10 of total membership; max session gap = 6 months.",
    "Money Bill delay in Rajya Sabha: 14 days.",
    "Art 108 joint sitting, Art 110 Money Bill, Art 112 Budget.",
  ],
  traps: [
    "The Speaker, not the Vice-President, presides over a joint sitting.",
    "Constitution Amendment Bills need a special majority in each House separately — no joint sitting.",
    "Rajya Sabha is permanent; only Lok Sabha can be dissolved.",
    "Every Money Bill is a Financial Bill, but not every Financial Bill is a Money Bill.",
    "No-confidence motion cannot be moved in the Rajya Sabha.",
  ],
  examTips: [
    "SSC, Railways and Banking ask numbers: strength, ages, 14 days, quorum and Article numbers.",
    "UPSC tests Money Bill features, joint sitting limits and Rajya Sabha’s special powers in statement form.",
  ],
};

export default notes;

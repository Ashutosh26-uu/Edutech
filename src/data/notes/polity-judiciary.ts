import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Supreme Court: composition",
      points: [
        "Art 124: Supreme Court established; inaugurated 28 January 1950, replacing the Federal Court.",
        "Strength: 34 including the CJI (Supreme Court (Number of Judges) Amendment Act, 2019); originally 7 + CJI.",
        "Qualifications (Art 124(3)): 5 years as a High Court judge, or 10 years as a High Court advocate, or a distinguished jurist in the President's opinion.",
        "Retire at 65 (SC) and 62 (HC, raised from 60 by the 15th Amendment, 1963).",
        "Removal (Art 124(4)): proved misbehaviour or incapacity; special majority in each House; Judges (Inquiry) Act 1968 motion needs 100 Lok Sabha or 50 Rajya Sabha signatures; no judge has been removed so far.",
        "Salaries charged on the Consolidated Fund of India; Parliament cannot discuss a judge's conduct except on a removal motion (Art 121).",
        "Surya Kant became the 53rd Chief Justice of India in November 2025.",
      ],
    },
    {
      heading: "Appointments: the Judges cases",
      points: [
        "First Judges case — S. P. Gupta (1981): executive primacy.",
        "Second Judges case (1993): 'consultation' read as 'concurrence', creating the collegium.",
        "Third Judges case (1998, Presidential reference): collegium of CJI + four senior-most judges for SC; CJI + two for High Courts.",
        "Fourth Judges case (2015): 99th Amendment and NJAC struck down as violating judicial independence.",
      ],
    },
    {
      heading: "Jurisdiction",
      points: [
        "Original (Art 131): exclusive, Centre vs States or State vs State disputes.",
        "Writs: Art 32 (SC, itself a Fundamental Right — 'heart and soul' per Ambedkar) and Art 226 (HC, wider: Fundamental and other legal rights).",
        "Appeals (Arts 132–134); special leave to appeal from any court or tribunal except military ones (Art 136).",
        "Advisory (Art 143), review of its own judgments (Art 137), transfer of cases (Art 139A).",
        "Art 141: SC law binds all courts; Art 142: orders for 'complete justice'; Art 144: all authorities act in aid of the SC.",
        "Court of record with contempt power: SC Art 129, HC Art 215.",
        "Curative petition created in Rupa Ashok Hurra (2002), after a review petition is dismissed.",
      ],
    },
    {
      heading: "Writs",
      points: [
        "Habeas corpus: produce a detained person; lies even against private individuals.",
        "Mandamus: command to perform a public duty; not against the President, Governors or private persons.",
        "Prohibition: higher court stops a lower court before it acts; certiorari: quashes an order already passed; both lie against judicial and quasi-judicial bodies, not legislatures.",
        "Quo warranto: asks by what authority a person holds a public office; anyone can seek it.",
      ],
    },
    {
      heading: "High Courts, PIL, tribunals, judicial review",
      points: [
        "Art 214: High Court for each State; Art 217: appointed by the President after consulting the CJI, the Governor and the HC Chief Justice.",
        "PIL pioneered by Justices P. N. Bhagwati and V. R. Krishna Iyer by relaxing locus standi; Hussainara Khatoon (1979) read speedy trial into Art 21.",
        "Part XIV-A (Arts 323A, 323B) added by the 42nd Amendment (1976); Administrative Tribunals Act 1985.",
        "L. Chandra Kumar (1997): HC review under Arts 226/227 is basic structure; tribunal orders go to an HC division bench (overruling S. P. Sampath Kumar, 1987).",
        "Judicial review rests on Arts 13, 32 and 226 and is part of the basic structure; Ninth Schedule laws added after 24 April 1973 are reviewable (I. R. Coelho, 2007).",
      ],
    },
  ],
  formulas: [
    "SC: Art 124 | HC: Art 214 | SC writs 32, HC writs 226",
    "Retirement: SC 65, HC 62",
    "Removal motion: 100 Lok Sabha or 50 Rajya Sabha signatures",
  ],
  traps: [
    "Art 32 can be suspended during an emergency through Art 359 — no amendment needed.",
    "HC writ jurisdiction is wider than the SC's, because it extends to legal rights other than Fundamental Rights.",
    "Ad hoc judges are appointed by the CJI (with Presidential consent), not by the President.",
    "S. P. Gupta (1981) gave executive primacy; the collegium came in 1993.",
  ],
  examTips: [
    "SSC and RRB ask straight Article numbers, retirement ages and the inauguration date.",
    "UPSC Prelims uses match-the-case items (Judges cases, Chandra Kumar, Hurra, Coelho) and statement-count questions on writs and jurisdiction.",
  ],
};

export default notes;

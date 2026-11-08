import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Governor",
      points: [
        "Art 153: a Governor for each State; one person may serve two or more States (7th Amendment, 1956).",
        "Art 155: appointed by the President by warrant; Art 156: holds office during the President's pleasure, normal term five years; Art 157: citizen, at least 35.",
        "Art 159: oath administered by the Chief Justice of the State High Court.",
        "Art 161: pardon for offences under State law; no power over court-martial sentences; the standard exam line is that only the President can fully pardon a death sentence.",
        "Art 200: on a Bill, the Governor may assent, withhold, return it (not a Money Bill) or reserve it for the President; Art 201: President's decision on reserved Bills.",
        "Art 213: ordinance power, same limits as the President's Art 123.",
        "Art 163: Council of Ministers aids and advises except where the Governor acts in discretion; Art 371H gives the Arunachal Pradesh Governor special responsibility for law and order.",
      ],
    },
    {
      heading: "Chief Minister and legislature",
      points: [
        "Art 164: CM appointed by the Governor, other ministers on the CM's advice; ministry ≤ 15% of the Assembly but not fewer than 12 (91st Amendment).",
        "Art 169: Parliament creates or abolishes a Legislative Council if the Assembly asks by a special majority.",
        "Art 171: Council size between 40 and one-third of the Assembly; members chosen 1/3 by MLAs, 1/3 by local bodies, 1/12 by graduates, 1/12 by teachers, 1/6 nominated by the Governor.",
        "Six States have Councils (2026): Andhra Pradesh, Bihar, Karnataka, Maharashtra, Telangana, Uttar Pradesh.",
        "Art 173: minimum age 25 for the Assembly, 30 for the Council; MLCs serve six years with one-third retiring every two years.",
      ],
    },
    {
      heading: "Panchayati Raj (73rd Amendment)",
      points: [
        "Committees: Balwant Rai Mehta 1957 (three tiers), Ashok Mehta 1977 (two tiers), G. V. K. Rao 1985 (district as key unit), L. M. Singhvi 1986 (constitutional status).",
        "73rd Amendment (1992) in force 24 April 1993 (National Panchayati Raj Day); Part IX, Arts 243–243O; Eleventh Schedule with 29 subjects.",
        "Gram Sabha (243A); three tiers (243B), intermediate tier optional for States under 20 lakh population; minimum age 21.",
        "243D: SC/ST seats in proportion to population, at least one-third for women including chairperson posts.",
        "243E: five-year term, fresh elections within six months of dissolution.",
        "243I: State Finance Commission every five years; 243K: State Election Commission, appointed by the Governor, removable only like a High Court judge.",
        "PESA 1996 (Bhuria Committee) extends Part IX to Fifth Schedule areas in ten States, with strong Gram Sabha powers.",
      ],
    },
    {
      heading: "Municipalities (74th Amendment) and tribal areas",
      points: [
        "74th Amendment (1992) in force 1 June 1993; Part IX-A, Arts 243P–243ZG; Twelfth Schedule with 18 subjects.",
        "Three bodies: Nagar Panchayat (transitional area), Municipal Council (smaller urban area), Municipal Corporation (larger urban area, headed by a Mayor).",
        "Ward committees where population is 3 lakh or more (243S); District Planning Committee (243ZD); Metropolitan Planning Committee for 10 lakh+ areas (243ZE).",
        "Part IX-B (co-operatives, 97th Amendment 2011) was struck down in 2021 to the extent it covered State co-operatives.",
        "Fifth Schedule: Scheduled Areas with a Tribes Advisory Council; Sixth Schedule (Art 244(2)): autonomous district councils in Assam, Meghalaya, Tripura and Mizoram.",
      ],
    },
  ],
  formulas: [
    "Panchayats: Part IX, Schedule 11, 29 subjects | Municipalities: Part IX-A, Schedule 12, 18 subjects",
    "Ward committee: 3 lakh+ | Metropolitan Planning Committee: 10 lakh+",
    "Legislative Council: 40 ≤ size ≤ one-third of the Assembly",
    "Women's reservation in local bodies: at least one-third",
  ],
  traps: [
    "The Governor is appointed by the President, not elected; the oath is given by the HC Chief Justice, not the CJI.",
    "The State Election Commissioner is appointed by the Governor but cannot be removed by the Governor.",
    "Balwant Rai Mehta recommended three tiers; Ashok Mehta recommended two.",
    "The Sixth Schedule covers only four north-eastern States; Fifth Schedule areas are elsewhere.",
  ],
  examTips: [
    "SSC and RRB ask Articles, Parts, Schedule subject counts and the Nagaur 1959 fact.",
    "UPSC and State PSCs use chronological ordering of committees and statement-count items on the Governor, SEC, PESA and district councils.",
  ],
};

export default notes;

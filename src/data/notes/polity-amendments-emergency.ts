import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Amendment procedure (Art 368, Part XX)",
      points: [
        "Bill may start in either House, by a minister or a private member; no prior Presidential sanction; no joint sitting.",
        "Special majority: majority of total membership and two-thirds of members present and voting, in each House separately.",
        "Federal provisions (election of the President, Union/State executive powers, SC and HCs, Seventh Schedule, States' representation in Parliament, Art 368 itself) also need ratification by half the States.",
        "President must assent (24th Amendment, 1971).",
      ],
    },
    {
      heading: "Basic structure cases",
      points: [
        "Shankari Prasad (1951) and Sajjan Singh (1965): Parliament can amend Fundamental Rights.",
        "Golaknath (1967, 11 judges): Fundamental Rights cannot be amended; reversed by the 24th Amendment.",
        "Kesavananda Bharati (1973, 13 judges, 7–6): Parliament can amend any part but not the basic structure.",
        "Minerva Mills (1980): limited amending power and the FR–DPSP balance are basic structure.",
        "Kihoto Hollohan (1992): Speaker's decisions under the Tenth Schedule are open to judicial review.",
        "S. R. Bommai (1994): federalism and secularism are basic; majority tested on the floor; Art 356 is reviewable.",
      ],
    },
    {
      heading: "Landmark amendments",
      points: [
        "1st (1951): Ninth Schedule, Arts 31A/31B, new restrictions on free speech. 7th (1956): States reorganised on linguistic lines.",
        "36th (1975): Sikkim became a full State. 39th (1975): elections of President, VP, PM and Speaker placed beyond courts (partly struck down).",
        "42nd (1976, 'mini-Constitution'): socialist, secular, integrity in the Preamble; Fundamental Duties (Art 51A); tribunals; five subjects to the Concurrent List; Emergency for part of India.",
        "44th (1978): property removed from Fundamental Rights (now Art 300A); 'armed rebellion' replaced 'internal disturbance'; written Cabinet advice for Art 352; Arts 20 and 21 cannot be suspended.",
        "52nd (1985) Tenth Schedule (anti-defection); 61st (1988) voting age 21 → 18; 73rd/74th (1992) local bodies.",
        "86th (2002) Art 21A, education for ages 6–14; 91st (2003) 15% ministry cap; 97th (2011) co-operatives.",
        "99th (2014) NJAC; 101st (2016) GST; 102nd (2018) NCBC; 103rd (2019) 10% EWS quota; 104th (2020) SC/ST reservation extended, Anglo-Indian seats ended; 106th (2023) one-third seats for women.",
      ],
    },
    {
      heading: "Emergency provisions (Part XVIII)",
      points: [
        "Art 352: war, external aggression or armed rebellion; on written Cabinet advice; approved by both Houses by special majority within one month; lasts six months per approval, renewable without limit.",
        "Lok Sabha can end it by a simple-majority resolution; one-tenth of members can demand a special sitting.",
        "Effects: Parliament legislates on the State List (Art 250); Lok Sabha term extendable one year at a time; Art 358 suspends Art 19 automatically (war/external aggression only); Art 359 suspends enforcement of other rights except Arts 20 and 21.",
        "Proclaimed in 1962 (China), 1971 (Pakistan war) and June 1975 (internal disturbance).",
        "Art 356 (President's Rule): approval within two months by simple majority; six months at a time, three years at most; beyond one year needs a National Emergency and an Election Commission certificate.",
        "Art 360 (Financial Emergency): approval within two months; can cut salaries including judges'; never proclaimed.",
      ],
    },
    {
      heading: "Schedules and Centre–State links",
      points: [
        "12 Schedules: 1 States/UTs, 2 emoluments, 3 oaths, 4 Rajya Sabha seats, 5 Scheduled Areas, 6 north-east tribal areas, 7 three Lists, 8 languages (22), 9 protected laws, 10 anti-defection, 11 Panchayats (29), 12 Municipalities (18).",
        "Residuary powers with the Union (Art 248); Rajya Sabha resolution by two-thirds present and voting lets Parliament legislate on a State subject (Art 249).",
        "Inter-State Council (Art 263); Sarkaria (1983) and Punchhi (2007) Commissions reviewed Centre–State relations.",
      ],
    },
  ],
  formulas: [
    "National Emergency: approval in 1 month, special majority, 6-month renewals",
    "President's Rule: approval in 2 months, simple majority, max 3 years",
    "Financial Emergency: approval in 2 months, no maximum",
  ],
  traps: [
    "There is no joint sitting for a Constitutional Amendment Bill.",
    "A Governor's report is not essential for Art 356; the President may act 'otherwise'.",
    "Art 19 is suspended automatically only for war or external aggression, not armed rebellion.",
    "The Ninth Schedule came with the 1st Amendment; the Tenth with the 52nd.",
    "Financial Emergency has never been imposed, though National Emergency has been proclaimed three times.",
  ],
  examTips: [
    "SSC and RRB ask amendment numbers, the year of the 1st Amendment and the count of Schedules.",
    "UPSC asks statement-count items on 42nd and 44th Amendment changes, Art 368 procedure and emergency timelines.",
  ],
};

export default notes;

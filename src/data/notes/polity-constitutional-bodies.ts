import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Election Commission",
      points: [
        "Art 324: superintendence of elections to Parliament, State legislatures and the offices of President and Vice-President; set up 25 January 1950 (National Voters' Day).",
        "Multi-member briefly in 1989–90, permanently since 1993 (CEC + two Election Commissioners).",
        "2023 Act: CEC and ECs appointed by the President on the advice of a committee of the PM, the Leader of Opposition in the Lok Sabha and a Union Cabinet Minister chosen by the PM.",
        "Term six years or 65; CEC removed only like a Supreme Court judge; other ECs only on the CEC's recommendation.",
        "Recognises parties and allots symbols (Election Symbols Order, 1968). Gyanesh Kumar has been CEC since February 2025.",
      ],
    },
    {
      heading: "Public Service Commissions, CAG, AG",
      points: [
        "UPSC: Arts 315–323; President appoints and fixes the number of members; term six years or 65.",
        "Art 317: removal by the President for misbehaviour after an SC inquiry, or for insolvency, outside paid work or infirmity.",
        "After office the UPSC Chairman cannot take further government jobs; members may become UPSC or SPSC Chairman.",
        "UPSC is not consulted on reservations for backward classes (Art 320(4)).",
        "SPSC: appointed by the Governor but removable only by the President; term six years or 62. Joint PSCs are statutory, created by Parliament on States' request.",
        "CAG (Arts 148–151): appointed by the President, six years or 65, removed like an SC judge, barred from further office; reports go to the President, then Parliament's PAC. K. Sanjay Murthy has been CAG since November 2024.",
        "Attorney General (Art 76): qualified to be an SC judge, holds office at the President's pleasure, no fixed term; can speak in Parliament but not vote (Art 88); right of audience in all Indian courts.",
      ],
    },
    {
      heading: "Finance Commission and other constitutional bodies",
      points: [
        "Finance Commission (Art 280): set up by the President every five years; chairman + four members; recommends tax sharing between Centre and States.",
        "Chairs: K. C. Neogy (1st), Y. V. Reddy (14th), N. K. Singh (15th), Arvind Panagariya (16th, set up 31 December 2023, covering 2026–31).",
        "GST Council (Art 279A, 101st Amendment 2016) is chaired by the Union Finance Minister.",
        "NCSC Art 338; NCST Art 338A (89th Amendment, 2003); NCBC Art 338B (102nd Amendment, 2018); Special Officer for Linguistic Minorities Art 350B.",
      ],
    },
    {
      heading: "Statutory and executive bodies",
      points: [
        "NHRC: Protection of Human Rights Act 1993; chairperson a former CJI or SC judge (2019 amendment); chosen by a committee headed by the PM; term three years or 70.",
        "State Human Rights Commission: appointed by the Governor, removable only by the President.",
        "CIC: RTI Act 2005; selected by the PM, the Leader of Opposition and a Cabinet Minister nominated by the PM.",
        "CVC: set up in 1964 on the Santhanam Committee's advice, statutory since the CVC Act 2003; term four years or 65.",
        "Lokpal: Lokpal and Lokayuktas Act 2013; first Lokpal P. C. Ghose (March 2019); A. M. Khanwilkar since 2024; term five years or 70.",
        "Statutory commissions: NCW (1990 Act), NCM (1992 Act), NCPCR (2005 Act).",
        "NITI Aayog: executive resolution, 1 January 2015, replaced the Planning Commission (1950); PM is chairperson; neither body is constitutional or statutory.",
      ],
    },
  ],
  formulas: [
    "ECI 324 | AG 76 | CAG 148 | UPSC 315 | FC 280 | GST Council 279A | NCSC 338 | NCST 338A | NCBC 338B",
    "Six years or 65: CEC, ECs, UPSC members, CAG | Six years or 62: SPSC members",
    "Removed like an SC judge: CEC, CAG",
  ],
  traps: [
    "The Solicitor General is not a constitutional post; the Attorney General is.",
    "SPSC members are appointed by the Governor but removed by the President.",
    "NCSC and NCST are constitutional; NCW and NCM are statutory; NITI Aayog is neither.",
    "Other Election Commissioners are removed by the President on the CEC's recommendation, not by impeachment-style procedure.",
  ],
  examTips: [
    "SSC and RRB ask Article numbers, first office holders and terms; UPSC asks constitutional vs statutory classification as statement-count items.",
    "Appointment committees and removal procedures (CEC, CIC, CVC, Lokpal, NHRC) are favourite match-the-following material.",
  ],
};

export default notes;

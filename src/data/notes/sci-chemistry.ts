import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Matter and atoms",
      points: [
        "Atomic number (Z) = number of protons = number of electrons in a neutral atom.",
        "Mass number (A) = protons + neutrons; neutrons = A − Z.",
        "Isotopes: same Z, different A (e.g. ¹²C and ¹⁴C). Isobars: same A, different Z (e.g. ⁴⁰Ar and ⁴⁰Ca).",
        "Shell capacity 2n²: K = 2, L = 8, M = 18. Noble gases have a full outer shell (helium has 2, the rest 8).",
        "Mixtures can be separated physically; compounds have fixed composition and need chemical methods.",
      ],
    },
    {
      heading: "Mole concept",
      points: [
        "1 mole = 6.022 × 10²³ particles (Avogadro's number).",
        "Moles = given mass ÷ molar mass (e.g. 22 g CO₂ ÷ 44 = 0.5 mol).",
        "At STP, 1 mole of any gas occupies 22.4 L.",
        "O₂ is diatomic: count molecules first, then multiply by 2 for atoms.",
        "Use the balanced equation's mole ratio: CaCO₃ → CaO + CO₂ (100 g gives 22.4 L CO₂ at STP).",
      ],
    },
    {
      heading: "Acids, bases and salts",
      points: [
        "pH = −log[H⁺]; pure water at 25 °C has pH 7; below 7 acidic, above 7 basic.",
        "At 25 °C, pH + pOH = 14. A fall of 1 pH unit means 10 times more H⁺.",
        "Indicators: litmus red in acid, blue in base; phenolphthalein colourless in acid, pink in base; methyl orange red in acid, yellow in base.",
        "Acid + base → salt + water (neutralisation). Acid + metal carbonate → salt + water + CO₂.",
        "Everyday pH: stomach acid (HCl) about 1–2, blood about 7.4, antacids are mild bases such as Mg(OH)₂.",
      ],
    },
    {
      heading: "Common chemical names",
      points: [
        "Common salt NaCl; baking soda NaHCO₃; washing soda Na₂CO₃·10H₂O.",
        "Quicklime CaO; slaked lime Ca(OH)₂; limestone/marble/chalk CaCO₃.",
        "Bleaching powder CaOCl₂; plaster of Paris CaSO₄·½H₂O; gypsum CaSO₄·2H₂O.",
        "Laughing gas N₂O; dry ice is solid CO₂; heavy water D₂O.",
        "Ores: bauxite (aluminium), haematite (iron), cinnabar (mercury), galena (lead), zinc blende (zinc).",
      ],
    },
    {
      heading: "Reactions, air and alloys",
      points: [
        "Oxidation = gain of oxygen or loss of electrons; reduction is the reverse.",
        "Exothermic releases heat (combustion, respiration); endothermic absorbs heat (photosynthesis, melting ice, dissolving NH₄Cl).",
        "Air: nitrogen ~78%, oxygen ~21%, argon ~0.9%, CO₂ ~0.04%.",
        "Brass = Cu + Zn; bronze = Cu + Sn; stainless steel = Fe + Cr + Ni (+ C); solder = Pb + Sn.",
        "Rusting of iron needs both oxygen and water; galvanising coats iron with zinc.",
      ],
    },
  ],
  formulas: [
    "Moles = mass ÷ molar mass = particles ÷ 6.022 × 10²³ = volume (L) at STP ÷ 22.4",
    "pH + pOH = 14 (at 25 °C)",
    "Neutrons = A − Z",
    "Molar masses: H₂O 18, CO₂ 44, NaCl 58.5, CaCO₃ 100, H₂SO₄ 98",
  ],
  traps: [
    "Baking soda (NaHCO₃) and washing soda (Na₂CO₃·10H₂O) are different; do not swap them.",
    "Quicklime is CaO, slaked lime is Ca(OH)₂; heating limestone gives quicklime.",
    "For gases like O₂, N₂, Cl₂, the number of atoms is twice the number of molecules.",
    "pH is logarithmic: pH 2 is 100 times (not twice) as acidic as pH 4.",
    "Phenolphthalein stays colourless in acids; it does not turn red.",
  ],
  examTips: [
    "SSC, RRB and state exams favour one-liners on chemical names, ores, alloys and indicator colours.",
    "Higher-level papers add mole and STP volume calculations and multi-statement questions on pH and atomic structure.",
    "Keep a ready table of formula, common name and use for 15–20 everyday compounds.",
  ],
};

export default notes;

import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Laws and the mole",
      points: [
        "Laws: conservation of mass (Lavoisier), definite proportions (Proust), multiple proportions (Dalton), gaseous volumes (Gay-Lussac), Avogadro's law.",
        "1 mole = 6.022 × 10²³ particles (N_A); 1 amu (u) = 1/12 mass of a ¹²C atom = 1.66 × 10⁻²⁴ g.",
        "Molar volume of an ideal gas: 22.4 L at STP (0 °C, 1 atm); 22.7 L at 0 °C and 1 bar.",
        "Count what is asked: molecules, atoms (× atoms per formula) or electrons (× electrons per formula).",
        "Example: 1.8 mL water = 0.1 mol = 0.1 × 10 = 1 mol electrons = 6.022 × 10²³ electrons.",
      ],
    },
    {
      heading: "Formulae and stoichiometry",
      points: [
        "Empirical formula: % → divide by atomic mass → divide by smallest → round to whole numbers (multiply if ×.5 or ×.33).",
        "Molecular formula = (empirical formula)ₙ, n = molar mass ÷ empirical formula mass.",
        "Glucose (C₆H₁₂O₆) and acetic acid (C₂H₄O₂) share empirical formula CH₂O but are different compounds.",
        "Limiting reagent: compare moles ÷ coefficient for each reactant; smallest value limits the product.",
        "% yield = actual ÷ theoretical × 100; for sequential steps multiply the fractional yields.",
        "POAC: atoms of an element are conserved, useful when the equation is not given.",
        "Gas volumes at the same T and P react in the ratio of coefficients (no need to convert to moles).",
      ],
    },
    {
      heading: "Concentration terms",
      points: [
        "Molarity (M) = mol solute per L solution — changes with temperature.",
        "Molality (m) = mol solute per kg solvent; mole fraction and mass % are temperature independent.",
        "Normality = equivalents per L = M × n-factor; ppm = mass of solute per 10⁶ parts of solution.",
        "Dilution: M₁V₁ = M₂V₂; mixing same solute: M = (M₁V₁ + M₂V₂)/(V₁ + V₂).",
      ],
    },
    {
      heading: "Equivalents and n-factor",
      points: [
        "Equivalent mass = molar mass ÷ n-factor.",
        "Acid n-factor = replaceable H⁺ (basicity): H₃PO₄ 3, H₃PO₃ 2, H₃PO₂ 1; base n-factor = acidity (OH⁻ replaced).",
        "Redox n-factor = total change in oxidation number per formula unit.",
        "KMnO₄: acidic 5 (→ Mn²⁺), neutral/weakly alkaline 3 (→ MnO₂), strongly alkaline 1 (→ MnO₄²⁻); K₂Cr₂O₇ (acidic) 6.",
        "Oxalic acid as reductant: n = 2; Fe₃O₄ → Fe₂O₃: n = 1 (average Fe goes from +8/3 to +3).",
        "At the end point, equivalents of oxidant = equivalents of reductant (N₁V₁ = N₂V₂).",
      ],
    },
  ],
  formulas: [
    "n = m/M = N/N_A = V(L, STP)/22.4.",
    "Molar mass = 2 × vapour density.",
    "M = (10 × d × %w/w)/molar mass (d in g/mL).",
    "m = 1000M/(1000d − M × molar mass of solute).",
    "% water in a hydrate = (mass of water ÷ molar mass of hydrate) × 100; CuSO₄·5H₂O ≈ 36%.",
  ],
  traps: [
    "STP volume 22.4 L applies only to gases; never use it for water or other liquids.",
    "H₃PO₃ is dibasic and H₃PO₂ monobasic: P–H bonds do not ionise.",
    "Molality uses kg of solvent, not of solution.",
    "Limiting reagent is not simply the reactant with fewer moles; divide by the coefficient first.",
    "Air is 20% (or 21%) O₂ by volume; divide O₂ volume by 0.2 to get air volume.",
  ],
  examTips: [
    "JEE and NEET open almost every paper with a one-step mole or concentration calculation.",
    "Redox titration questions need n-factors of KMnO₄, K₂Cr₂O₇ and ferrous compounds.",
    "Statement-counting on n-factors and empirical formula is common in JEE Main.",
  ],
};

export default notes;

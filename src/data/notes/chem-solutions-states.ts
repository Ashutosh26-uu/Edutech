import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Gas laws and kinetic theory",
      points: [
        "Boyle: PV constant (fixed n, T); Charles: V/T constant; Gay-Lussac: P/T constant; Avogadro: V ∝ n.",
        "Ideal gas: PV = nRT, R = 8.314 J mol⁻¹ K⁻¹ = 0.0821 L atm mol⁻¹ K⁻¹; molar volume 22.4 L at 273 K and 1 atm (22.7 L at 1 bar).",
        "Dalton: p(i) = x(i)·P; pressure of a gas collected over water = P(total) − aqueous tension.",
        "Graham: rate of diffusion or effusion ∝ 1/√M at the same P and T.",
        "Average kinetic energy = (3/2)RT per mole; depends only on temperature, not on the gas.",
        "Speeds: u(mp) = √(2RT/M), u(av) = √(8RT/πM), u(rms) = √(3RT/M); ratio 1 : 1.128 : 1.224.",
      ],
    },
    {
      heading: "Real gases",
      points: [
        "Compressibility factor Z = PV/nRT; Z = 1 ideal, Z < 1 attractions dominate (easily liquefied), Z > 1 repulsions dominate.",
        "H₂ and He show Z > 1 at ordinary temperatures; gases behave ideally at high T and low P.",
        "van der Waals: (P + an²/V²)(V − nb) = nRT; a measures attraction, b the excluded volume.",
        "Higher critical temperature or higher a means easier liquefaction.",
      ],
    },
    {
      heading: "Concentration and gas solubility",
      points: [
        "Molality (mol solute per kg solvent) and mole fraction do not change with temperature; molarity does.",
        "Henry: p = K_H·x; larger K_H means lower solubility; gas solubility falls as temperature rises.",
        "Uses of Henry's law: soda bottles sealed under CO₂ pressure, 'bends' in divers, air tanks diluted with helium, anoxia at altitude.",
      ],
    },
    {
      heading: "Raoult's law and deviations",
      points: [
        "Raoult: p(A) = x(A)·p°(A); for two volatile liquids P = x(A)p°(A) + x(B)p°(B).",
        "Ideal solution: ΔH(mix) = 0, ΔV(mix) = 0 — e.g. benzene + toluene, n-hexane + n-heptane.",
        "Positive deviation (weaker A–B forces, ΔH(mix) > 0, ΔV > 0): ethanol + water, ethanol + acetone, CS₂ + acetone → minimum-boiling azeotrope.",
        "Negative deviation (stronger A–B forces, ΔH(mix) < 0, ΔV < 0): chloroform + acetone, HNO₃ + water, phenol + aniline → maximum-boiling azeotrope.",
        "Azeotropes boil at constant composition and cannot be separated by fractional distillation.",
      ],
    },
    {
      heading: "Colligative properties and van 't Hoff factor",
      points: [
        "Depend on the number of solute particles, not their nature.",
        "Relative lowering of vapour pressure: (p° − p)/p° = x(solute).",
        "Boiling-point elevation ΔTb = i·Kb·m; freezing-point depression ΔTf = i·Kf·m (water: Kb = 0.52, Kf = 1.86 K kg mol⁻¹).",
        "Osmotic pressure π = iCRT; preferred for polymers and proteins because it is measurable at room temperature and large even for dilute solutions.",
        "Isotonic solutions have equal π; 0.9% NaCl is isotonic with blood; reverse osmosis (pressure > π) desalinates sea water.",
        "i = observed colligative effect / calculated effect = normal molar mass / observed molar mass.",
        "Dissociation: i > 1, α = (i − 1)/(n − 1); association: i < 1, α = (1 − i)/(1 − 1/n).",
      ],
    },
  ],
  formulas: [
    "PV = nRT; r₁/r₂ = √(M₂/M₁)",
    "u(rms) = √(3RT/M) with M in kg mol⁻¹ for SI units",
    "Tc = 8a/27Rb, Pc = a/27b², Vc = 3b; Boyle temperature T(B) = a/Rb",
    "M(solute) = (Kb × w₂ × 1000)/(ΔTb × w₁), same form for Kf and ΔTf",
    "π = iCRT, so M = wRT/(πV) for a non-electrolyte",
    "Molality from w/w%: m = (w × 1000)/(M × (100 − w))",
  ],
  traps: [
    "Use T in kelvin and the right unit of R (0.0821 with atm and litres).",
    "Higher K_H means less soluble gas, not more.",
    "For a salt, find i from the ions it gives: K₃[Fe(CN)₆] has n = 4, CaCl₂ has n = 3.",
    "Complete dimerisation gives i = 1/2, so the observed molar mass doubles.",
    "Positive deviation gives a minimum-boiling azeotrope (higher vapour pressure), negative gives maximum-boiling.",
  ],
  examTips: [
    "JEE and NEET set numericals on ΔTf, π and i with partial dissociation, plus vapour-pressure problems on ideal mixtures.",
    "Assertion–reason and 'how many statements' items test deviations, azeotropes and Henry's law applications.",
    "Gas questions focus on Z, van der Waals constants, critical constants and speed ratios.",
  ],
};

export default notes;

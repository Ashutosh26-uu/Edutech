import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Cells and electrode potential",
      points: [
        "Galvanic cell: spontaneous redox makes electricity (ΔG < 0, Ecell > 0); electrolytic cell: electricity drives a non-spontaneous change.",
        "Oxidation at the anode, reduction at the cathode in both cells; galvanic anode is −ve, electrolytic anode is +ve.",
        "Cell notation: anode | anode ion || cathode ion | cathode, e.g. Zn | Zn²⁺ || Cu²⁺ | Cu (E° = 1.10 V).",
        "Standard hydrogen electrode (1 bar H₂, 1 M H⁺, 298 K) is taken as 0.00 V; higher reduction potential = stronger oxidising agent.",
        "F₂ is the strongest oxidant (E° = +2.87 V), Li the strongest reductant (E° ≈ −3.04 V); a metal displaces another with higher E° from its salt.",
        "E° is intensive: it does not double when the equation is doubled, but ΔG° does.",
      ],
    },
    {
      heading: "Nernst equation and thermodynamics",
      points: [
        "For a half-reaction with n electrons, E = E° − (0.0591/n) log Q at 298 K (Q written for the reduction as given).",
        "At equilibrium Ecell = 0, so E°cell = (0.0591/n) log K.",
        "Concentration cell: E° = 0; the electrode in the more dilute solution is the anode, and the cell runs until the concentrations become equal.",
        "Combining half-cells to get a new E°: add ΔG° values (−nFE°), never add E° directly.",
        "Corrosion (rusting) is electrochemical: anode Fe → Fe²⁺ + 2e⁻, cathode O₂ + 4H⁺ + 4e⁻ → 2H₂O; galvanising uses sacrificial zinc.",
      ],
    },
    {
      heading: "Electrolysis and conductance",
      points: [
        "Faraday's first law: mass deposited ∝ charge passed; second law: for the same charge, masses ∝ equivalent masses.",
        "Aqueous electrolysis: the species easier to reduce/oxidise reacts; aq. NaCl gives H₂ at cathode and Cl₂ at anode; aq. Na₂SO₄ with Pt gives H₂ and O₂.",
        "Resistance R = ρ(l/A); conductivity κ = 1/ρ (S cm⁻¹); cell constant G* = l/A = κR.",
        "On dilution κ decreases (fewer ions per cm³) but Λm increases (more dissociation and less ion attraction).",
        "Strong electrolyte: Λm = Λ°m − A√c (Debye–Hückel–Onsager); weak electrolyte: Λ°m found only through Kohlrausch's law.",
      ],
    },
    {
      heading: "Chemical kinetics",
      points: [
        "Rate = k[A]^x[B]^y; order x + y is found by experiment and can be zero or fractional; molecularity is always a whole number for an elementary step.",
        "Units of k: (mol L⁻¹)^(1 − n) s⁻¹; zero order mol L⁻¹ s⁻¹, first order s⁻¹, second order L mol⁻¹ s⁻¹.",
        "First-order t½ is independent of initial concentration; after n half-lives the fraction left is (1/2)ⁿ; t(99.9%) ≈ 10 t½.",
        "Pseudo-first-order: one reactant in large excess, e.g. acid hydrolysis of ester or inversion of cane sugar.",
        "A catalyst lowers Ea for both directions equally; it changes k and rate but not ΔH, ΔG or K.",
        "Plot of ln k vs 1/T is a straight line with slope −Ea/R; k changes with temperature and catalyst, not with concentration.",
      ],
    },
  ],
  formulas: [
    "E°cell = E°cathode − E°anode (reduction potentials)",
    "ΔG° = −nFE°cell = −2.303RT log K; 2.303RT/F = 0.0591 V at 298 K",
    "m = ZIt, Z = M/(nF); 1 F = 96500 C mol⁻¹ = charge on 1 mol of electrons",
    "Λm (S cm² mol⁻¹) = κ × 1000/c (c in mol L⁻¹)",
    "Kohlrausch: Λ°m(HAc) = Λ°(HCl) + Λ°(NaAc) − Λ°(NaCl); α = Λm/Λ°m; Ka = cα²/(1 − α)",
    "Zero order: [A] = [A]₀ − kt, t½ = [A]₀/2k",
    "First order: k = (2.303/t) log([A]₀/[A]), t½ = 0.693/k",
    "Arrhenius: k = A e^(−Ea/RT); log(k₂/k₁) = (Ea/2.303R)(T₂ − T₁)/(T₁T₂)",
  ],
  traps: [
    "Writing E°cell = E°anode − E°cathode or adding E° values when combining half-reactions; use ΔG° for that.",
    "Forgetting n in the Nernst term or using natural log with 0.0591 (0.0591 already includes 2.303).",
    "Saying conductivity rises on dilution; it is molar conductivity that rises.",
    "Mixing up order with molecularity, or assuming order equals the stoichiometric coefficient.",
    "Thinking a catalyst shifts equilibrium; it only helps reach it faster.",
  ],
  examTips: [
    "JEE Main and NEET regularly ask a numerical on Nernst/K from E°, a Faraday mass/volume calculation and a first-order half-life problem.",
    "Statement-count and assertion–reason questions test dilution effects on κ and Λm, and catalyst/temperature effects on k.",
    "Arrhenius questions often give the slope of ln k vs 1/T or a two-temperature rate ratio; keep units of R consistent (8.314 J K⁻¹ mol⁻¹).",
  ],
};

export default notes;

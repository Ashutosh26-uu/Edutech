import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Basic terms",
      points: [
        "Open system exchanges matter and energy, closed only energy, isolated neither.",
        "State functions (U, H, S, G, P, V, T) depend only on initial and final states; q and w are path functions.",
        "Extensive (mass, volume, U, H, heat capacity) vs intensive (T, P, density, molar properties, specific heat).",
        "Sign convention (IUPAC): heat absorbed and work done on the system are positive.",
        "Over a complete cycle ΔU = ΔH = 0, but q and w need not be zero (only q = −w).",
      ],
    },
    {
      heading: "First law and enthalpy",
      points: [
        "Isothermal ideal gas: ΔU = 0, so q = −w.",
        "Free expansion into vacuum: w = 0; for an ideal gas also q = 0 and ΔU = 0.",
        "Adiabatic: q = 0, ΔU = w; in expansion between the same volumes, reversible adiabatic work is smaller than reversible isothermal work.",
        "ΔH ≈ ΔU for reactions with only solids and liquids; they differ when gas moles change.",
        "Monoatomic gas: Cv = 3R/2, Cp = 5R/2, γ = 5/3; diatomic: Cv = 5R/2, Cp = 7R/2, γ = 7/5.",
        "1 L atm = 101.3 J; convert P×V work to joules before adding to heat.",
      ],
    },
    {
      heading: "Thermochemistry",
      points: [
        "ΔfH° of an element in its standard state (graphite, O₂ gas) is zero.",
        "Hess's law: ΔH is the same whether the reaction goes in one step or many; equations add like algebra.",
        "Combustion enthalpies are always negative; neutralisation of strong acid by strong base ≈ −57.1 kJ/mol, less for weak ones.",
        "Resonance energy = calculated ΔH − observed ΔH (benzene: 3 × (−119) − (−208) = −149, so 149 kJ/mol).",
        "Lattice enthalpy is found from the Born–Haber cycle.",
      ],
    },
    {
      heading: "Entropy and Gibbs energy",
      points: [
        "Second law: for a spontaneous process ΔS(total) = ΔS(system) + ΔS(surroundings) > 0.",
        "ΔS rises with melting, vaporisation, dissolving, more gas moles and higher temperature.",
        "Third law: entropy of a perfect crystal at 0 K is zero.",
        "ΔH < 0, ΔS > 0: always spontaneous; ΔH > 0, ΔS < 0: never.",
        "ΔH < 0, ΔS < 0: spontaneous below T = ΔH/ΔS; ΔH > 0, ΔS > 0: spontaneous above it.",
        "Heat flow between bodies of equal heat capacity ends at the mean temperature with ΔS(total) > 0.",
      ],
    },
  ],
  formulas: [
    "ΔU = q + w; w = −P(ext)ΔV (irreversible); w = −2.303 nRT log(V₂/V₁) (isothermal reversible).",
    "ΔH = ΔU + Δn(g)RT; Cp − Cv = R; q(p) = nCpΔT, q(v) = nCvΔT, ΔU = nCvΔT for any ideal-gas process.",
    "Reversible adiabatic: PVᵞ = constant, TVᵞ⁻¹ = constant.",
    "ΔH(reaction) = Σ ΔfH(products) − Σ ΔfH(reactants) = Σ BE(bonds broken) − Σ BE(bonds formed).",
    "ΔS = q(rev)/T; phase change ΔS = ΔH/T; heating ΔS = nCp ln(T₂/T₁); isothermal gas ΔS = nR ln(V₂/V₁).",
    "ΔS(surroundings) = −ΔH(system)/T.",
    "ΔG = ΔH − TΔS; ΔG° = −2.303 RT log K; ΔG = ΔG° + RT ln Q; ΔG = −nFE (cells).",
  ],
  traps: [
    "Bond-enthalpy formula is reactants minus products, the opposite order of the formation-enthalpy formula.",
    "Use Δn of gases only, and use R = 8.314 J with kJ values converted.",
    "ΔU = nCvΔT holds for every ideal-gas process, not only at constant volume.",
    "Spontaneous does not mean fast; ΔG says nothing about rate.",
    "ΔS(surroundings) uses ΔH of the system with a minus sign; −60 kJ at 300 K gives +200 J/K.",
  ],
  examTips: [
    "JEE Main asks work and ΔU in expansions, and Hess's-law cycles with given enthalpies.",
    "NEET favours sign of ΔS for processes and ΔH–ΔS spontaneity cases.",
    "ΔG°–K and crossover-temperature numericals are common single-step questions.",
  ],
};

export default notes;

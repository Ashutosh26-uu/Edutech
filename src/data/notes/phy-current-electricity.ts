import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Current and drift",
      points: [
        "Current I = dq/dt = neAv_d; current density J = I/A = σE.",
        "Drift speed is tiny (about mm/s) though the field travels almost at light speed.",
        "v_d = eEτ/m; mobility μ = v_d/E.",
        "In a tapered wire I is the same everywhere, so v_d ∝ 1/A ∝ 1/d².",
        "Heating a metal at fixed V: τ falls, so drift speed and current fall.",
      ],
    },
    {
      heading: "Resistance",
      points: [
        "Ohm's law V = IR; R = ρL/A, ρ = m/(ne²τ) depends on material and temperature, not shape.",
        "Stretching to n times length (volume fixed): R becomes n²R.",
        "R_t = R₀(1 + αΔt): α positive for metals, negative for semiconductors and carbon.",
        "Manganin and constantan have tiny α, so they are used in standard resistors.",
        "Series: R = ΣRᵢ (same current); parallel: 1/R = Σ1/Rᵢ (same voltage).",
        "Infinite ladder with R in each arm: R_eq = R(1 + √5)/2.",
      ],
    },
    {
      heading: "Cells",
      points: [
        "Terminal voltage V = E − Ir when supplying current; V = E + Ir when being charged; V = E on open circuit.",
        "Internal resistance r = (E/V − 1)R.",
        "n identical cells in series: nE, nr; m in parallel: E, r/m.",
        "Maximum power to load when R = r: P_max = E²/4r.",
      ],
    },
    {
      heading: "Kirchhoff's rules and bridges",
      points: [
        "Junction rule (charge conservation): ΣI = 0 at a node.",
        "Loop rule (energy conservation): ΣΔV = 0 round any closed loop.",
        "Wheatstone bridge balanced when P/Q = R/S; the galvanometer arm then carries no current and can be removed.",
        "Metre bridge: R/S = l/(100 − l); interchanging the cell and galvanometer does not shift the null point.",
        "Potentiometer compares emfs: E₁/E₂ = l₁/l₂; draws no current at balance, so it measures true emf.",
        "Potential gradient k = (voltage across wire)/(length); a larger wire length gives better sensitivity.",
      ],
    },
    {
      heading: "Meters, heating and RC circuits",
      points: [
        "Ammeter: shunt S = I_gG/(I − I_g) in parallel; voltmeter: series R = V/I_g − G.",
        "Heat H = I²Rt (Joule's law); P = VI = I²R = V²/R.",
        "Bulbs in series: the lower-wattage (higher R) bulb glows brighter; in parallel the higher-wattage one does.",
        "RC charging: q = Q(1 − e^(−t/RC)); discharging q = Q e^(−t/RC); time constant RC.",
        "At steady state a capacitor carries no current, so its branch acts as an open circuit.",
      ],
    },
  ],
  formulas: [
    "I = neAv_d, R = ρL/A",
    "Parallel cells: E_eq = (E₁r₂ + E₂r₁)/(r₁ + r₂), r_eq = r₁r₂/(r₁ + r₂)",
    "Potentiometer internal resistance: r = R(l₁ − l₂)/l₂",
    "Shunt S = I_gG/(I − I_g)",
    "Hexagon of six R, across opposite corners: R_eq = 1.5R",
    "Bulb rated P at V: R = V²/P",
  ],
  traps: [
    "Stretching changes both length and area; R goes up as n², not n.",
    "In series, the bulb with lower rated wattage is brighter, which surprises many students.",
    "Use E − Ir only for discharging; a cell being charged has V greater than E.",
    "A capacitor branch carries current only during charging; at steady state, ignore it for current but find its voltage.",
    "Temperature coefficient formulas need R₀ at the reference temperature, not at room temperature.",
  ],
  examTips: [
    "NEET asks stretching of wires, cell combinations, Wheatstone and metre-bridge balance and power ratings.",
    "JEE Main adds Kirchhoff networks, RC transients, symmetric networks and non-uniform current density.",
    "Potentiometer questions mostly ask emf comparison and internal resistance from two balance lengths.",
  ],
};

export default notes;

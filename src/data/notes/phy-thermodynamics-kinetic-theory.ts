import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Laws of thermodynamics",
      points: [
        "Zeroth law: bodies in thermal equilibrium with a third are in equilibrium with each other; it defines temperature.",
        "First law: ΔQ = ΔU + ΔW (heat given to gas, work done by gas).",
        "ΔU = nCvΔT for an ideal gas in any process; it depends only on the end states.",
        "Work by gas = ∫P dV = area under the P–V curve; clockwise cycle on P–V gives positive net work.",
        "Second law: no engine converts all heat into work; heat does not flow cold to hot unaided.",
      ],
    },
    {
      heading: "Processes",
      points: [
        "Isochoric: W = 0, Q = ΔU = nCvΔT.",
        "Isobaric: W = PΔV = nRΔT, Q = nCpΔT; diatomic gas puts 5/7 of Q into ΔU.",
        "Isothermal: ΔU = 0, Q = W = nRT ln(V₂/V₁).",
        "Adiabatic: Q = 0, PV^γ, TV^(γ−1) and P^(1−γ)T^γ constant; W = (P₁V₁ − P₂V₂)/(γ − 1).",
        "Slope of adiabatic on P–V is γ times the isothermal slope.",
        "Polytropic PVˣ = const: molar heat capacity C = Cv + R/(1 − x).",
      ],
    },
    {
      heading: "Engines and refrigerators",
      points: [
        "Efficiency η = W/Q₁ = 1 − Q₂/Q₁.",
        "Carnot (reversible) engine: η = 1 − T₂/T₁ (kelvin); the maximum possible between those temperatures.",
        "Refrigerator COP β = Q₂/W = T₂/(T₁ − T₂) for Carnot; β = (1 − η)/η.",
        "A claimed engine with η above the Carnot value is impossible.",
      ],
    },
    {
      heading: "Kinetic theory and specific heats",
      points: [
        "P = (1/3)ρv²_rms; average KE per molecule (3/2)kT, independent of the gas.",
        "v_rms = √(3RT/M), v_avg = √(8RT/πM), v_mp = √(2RT/M); v_rms > v_avg > v_mp.",
        "Equipartition: each degree of freedom gets ½kT per molecule; U = (f/2)nRT.",
        "f = 3 monoatomic, 5 rigid diatomic, 7 diatomic with vibration; linear triatomic with full vibration f = 3 + 2 + 2×4 = 13.",
        "Mean free path λ = 1/(√2 πd²n), so λ ∝ T/P.",
        "Mixture: Cv = Σ nᵢCvᵢ/Σ nᵢ; then γ = Cp/Cv of the mixture.",
      ],
    },
    {
      heading: "Heat transfer, calorimetry and expansion",
      points: [
        "Q = mcΔθ (heating), Q = mL (phase change); latent heat of ice ≈ 80 cal/g, steam ≈ 540 cal/g.",
        "In mixing problems check whether all the ice melts before writing the final temperature.",
        "Conduction rate KAΔθ/L; rods in series add L/KA like resistances.",
        "Stefan–Boltzmann P = σeAT⁴; Wien λ_max T = constant (≈ 2.9 × 10⁻³ m·K); good absorbers are good emitters.",
        "Linear expansion ΔL = αLΔθ; area β = 2α; volume γ = 3α.",
      ],
    },
  ],
  formulas: [
    "Cp − Cv = R; Cv = (f/2)R; γ = 1 + 2/f",
    "γ: monoatomic 5/3, rigid diatomic 7/5",
    "W_isothermal = nRT ln(V₂/V₁); W_adiabatic = nR(T₁ − T₂)/(γ − 1)",
    "η_Carnot = 1 − T₂/T₁; COP = T₂/(T₁ − T₂)",
    "v_rms = √(3RT/M)",
    "Pendulum clock: time lost per day ≈ ½αΔθ × 86400 s",
  ],
  traps: [
    "Temperatures in Carnot and gas formulas must be in kelvin.",
    "ΔU = nCvΔT holds for every process, not just isochoric ones.",
    "Sign convention: in ΔQ = ΔU + ΔW, ΔW is work done by the gas; some books use work on the gas, which flips the sign.",
    "Equal masses of gases are not equal moles; convert before comparing total kinetic energies.",
    "A sudden (fast) compression is adiabatic, a slow one in good thermal contact is isothermal.",
  ],
  examTips: [
    "NEET asks process identification on P–V graphs, Carnot efficiency, γ of mixtures and rms speed ratios.",
    "JEE Main adds cyclic processes with straight-line paths, polytropic heat capacity and calorimetry with ice.",
    "Match-the-column questions pair processes with Q, W, ΔU or molar heat capacity.",
  ],
};

export default notes;

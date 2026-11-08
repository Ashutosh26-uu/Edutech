import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Magnetic field of currents",
      points: [
        "Biot–Savart: dB = (μ₀/4π) I dl sin θ/r², μ₀ = 4π × 10⁻⁷ T·m/A.",
        "Long straight wire B = μ₀I/(2πr); finite wire (μ₀I/4πd)(sin α + sin β).",
        "Centre of a loop of N turns B = μ₀NI/(2R); arc of angle θ (radians) gives μ₀Iθ/(4πR).",
        "Axis of a loop B = μ₀IR²/[2(R² + x²)^(3/2)].",
        "Ampere's law ∮B·dl = μ₀I_enclosed; solenoid B = μ₀nI inside, toroid μ₀NI/(2πr).",
        "Inside a long hollow tube carrying current, B = 0; inside a solid wire B ∝ r.",
        "Current entering a circular loop at any two points gives B = 0 at the centre.",
      ],
    },
    {
      heading: "Forces and moving charges",
      points: [
        "Lorentz force F = q(E + v × B); magnetic force does no work and cannot change speed.",
        "Charge moving parallel to B feels no force.",
        "Perpendicular entry: circle r = mv/qB = √(2mK)/qB; period T = 2πm/qB, independent of speed.",
        "At an angle: helix with pitch = (2πm/qB) v cos θ.",
        "Wire in a field: F = IL × B; parallel currents attract, antiparallel repel.",
        "Loop torque τ = NIAB sin θ = m × B; magnetic moment m = NIA.",
        "Galvanometer to ammeter: low shunt in parallel; to voltmeter: high resistance in series.",
      ],
    },
    {
      heading: "Electromagnetic induction",
      points: [
        "Faraday: ε = −N dΦ/dt; charge flowing Δq = NΔΦ/R, independent of time taken.",
        "Lenz's law: induced current opposes the change causing it (energy conservation).",
        "Motional emf ε = Blv; rod rotating about one end ε = ½Bωl².",
        "Coil rotating in a field: ε = NBAω sin ωt, peak NBAω.",
        "Changing field in a cylindrical region induces E ∝ r inside and ∝ 1/r outside.",
        "Self-induced emf ε = −L dI/dt; energy U = ½LI²; solenoid L = μ₀n²Al.",
        "Mutual induction ε₂ = −M dI₁/dt; eddy currents reduced by laminated cores.",
        "Motor back emf is zero at start, so the starting current is large.",
      ],
    },
    {
      heading: "Transients and AC",
      points: [
        "LR growth I = I₀(1 − e^(−Rt/L)), time constant L/R; inductor acts as an open circuit at t = 0 and a wire at steady state.",
        "LC oscillation ω = 1/√(LC); energy swings between ½CV² and ½LI².",
        "V_rms = V₀/√2; average over a full cycle of a sine wave is zero.",
        "X_L = ωL (rises with frequency), X_C = 1/ωC (falls); capacitor blocks DC.",
        "Series LCR: Z = √(R² + (X_L − X_C)²), tan φ = (X_L − X_C)/R.",
        "Resonance ω₀ = 1/√(LC): Z = R, current maximum, V_L = V_C can exceed the source voltage; Q factor = ω₀L/R.",
        "Power P = V_rms I_rms cos φ; cos φ = R/Z; pure L or C draws no average power (wattless current).",
        "Transformer: V_s/V_p = N_s/N_p = I_p/I_s; works only on AC.",
      ],
    },
  ],
  formulas: [
    "B: wire μ₀I/2πr; loop centre μ₀I/2R; solenoid μ₀nI",
    "F/l = μ₀I₁I₂/(2πd)",
    "r = mv/qB, T = 2πm/qB",
    "ε = Blv; ε = ½Bωl²; ε₀ = NBAω",
    "Z = √(R² + (X_L − X_C)²); ω₀ = 1/√(LC)",
    "Magnetic moment of orbiting electron / angular momentum = e/2m",
  ],
  traps: [
    "Period of circular motion in B does not depend on speed or radius.",
    "Equal kinetic energy and equal momentum give different radius ratios; use r = √(2mK)/qB for equal K.",
    "In an LR circuit, at t = 0 the inductor carries no current; do not treat it as a wire then.",
    "Average power uses rms values and cos φ, not peak values.",
    "Transformers do not step up power; higher voltage means lower current.",
  ],
  examTips: [
    "NEET asks B at loop centres and arcs, radius of charged particles, Lenz's law direction, and LCR resonance.",
    "JEE Main adds Ampere's law for hollow or non-uniform conductors, rods sliding on rails, and LR or LC transients.",
    "Assertion-reason items often target back emf, eddy currents and capacitive reactance.",
  ],
};

export default notes;

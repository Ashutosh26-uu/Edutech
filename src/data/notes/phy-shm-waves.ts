import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "SHM basics",
      points: [
        "Restoring force F = −kx (proportional to displacement, towards the mean); a = −ω²x.",
        "x = A sin(ωt + φ); v = ω√(A² − x²) (max ωA at the mean); a_max = ω²A at the extremes.",
        "x = a sin ωt + b cos ωt is SHM with amplitude √(a² + b²).",
        "KE = ½k(A² − x²), PE = ½kx², total E = ½kA² = ½mω²A²; KE = PE at x = A/√2.",
        "Energy oscillates at twice the frequency of displacement; average KE = average PE = E/2.",
        "Phase difference between two SHMs: find each phase from x = A sin θ, then subtract.",
      ],
    },
    {
      heading: "Springs and pendulums",
      points: [
        "Spring–block: T = 2π√(m/k), independent of g (same on an incline or vertical).",
        "Series 1/k = 1/k₁ + 1/k₂; parallel k = k₁ + k₂; a spring cut to fraction f of its length has constant k/f.",
        "Simple pendulum: T = 2π√(l/g_eff); in a lift accelerating up g_eff = g + a; in free fall or orbit T is infinite.",
        "Seconds pendulum (T = 2 s) is about 1 m long on Earth.",
        "Physical pendulum: T = 2π√(I/mgd), d = distance of pivot from centre of mass.",
        "Damping: amplitude falls as e^(−bt/2m); energy ∝ amplitude², so half amplitude means a quarter of the energy.",
        "Resonance: amplitude is largest when the driving frequency equals the natural frequency.",
      ],
    },
    {
      heading: "Progressive waves",
      points: [
        "y = A sin(kx − ωt) moves along +x; k = 2π/λ, ω = 2πf, v = fλ = ω/k.",
        "String: v = √(T/μ); hanging rope: v = √(gx) at height x above the free end, pulse time up the rope 2√(L/g).",
        "Sound in gas: v = √(γP/ρ) = √(γRT/M); v ∝ √T (kelvin), independent of pressure at fixed T.",
        "Newton's isothermal formula gave too low a value; Laplace used adiabatic γ.",
        "Intensity ∝ A²ω²; sources in phase: constructive when path difference = nλ, destructive at (n + ½)λ (reversed for sources in opposite phase).",
      ],
    },
    {
      heading: "Stationary waves, beats, Doppler",
      points: [
        "y = 2A sin kx cos ωt: nodes λ/2 apart; node to adjacent antinode λ/4; no energy transport.",
        "String fixed at both ends and open pipe: fₙ = nv/2L, all harmonics.",
        "Closed pipe: f = nv/4L with n odd only; end correction ≈ 0.6r per open end.",
        "Rod clamped at the middle: fundamental v/2L, odd harmonics only.",
        "Resonance tube: λ = 2(l₂ − l₁), which removes the end correction.",
        "Beats = |f₁ − f₂| per second; waxing lowers a fork's frequency, filing raises it.",
        "Doppler: f′ = f(v + v₀)/(v − vₛ) with v₀ positive towards the source and vₛ positive towards the observer; wind adds to v.",
      ],
    },
  ],
  formulas: [
    "T = 2π√(m/k); T = 2π√(l/g); ω = 2π/T",
    "v = √(T/μ); v = √(γRT/M); f = (n/2L)√(T/μ)",
    "Closed pipe f₁ = v/4L; open pipe f₁ = v/2L",
    "f′ = f(v ± v₀)/(v ∓ vₛ)",
  ],
  traps: [
    "A spring's period does not change with g; a pendulum's does.",
    "A closed pipe has no even harmonics; count only odd multiples below the given limit.",
    "Speed of sound depends on temperature, not on pressure alone.",
    "When the source moves, wavelength changes; when only the observer moves, it does not.",
    "Energy fraction lost in damping uses amplitude squared.",
  ],
  examTips: [
    "NEET asks spring combinations, pendulum in a lift, organ-pipe harmonics and beats.",
    "JEE Main mixes SHM kinematics with energy and asks Doppler with moving source and observer.",
    "Stationary-wave equations: read node spacing and frequency directly from the given expression.",
  ],
};

export default notes;

import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Charge and Coulomb's law",
      points: [
        "Charge is quantised (q = ne, e = 1.6 × 10⁻¹⁹ C), conserved and additive; 1 C ≈ 6.25 × 10¹⁸ electrons.",
        "F = kq₁q₂/r², k = 1/(4πε₀) = 9 × 10⁹ N·m²/C²; in a medium the force drops by the dielectric constant K.",
        "Forces from several charges add as vectors (superposition).",
        "Two hanging charged balls: tan θ = F_e/mg for each thread.",
      ],
    },
    {
      heading: "Field and potential",
      points: [
        "E = F/q₀; point charge E = kq/r², V = kq/r (scalar, add algebraically).",
        "E = −dV/dr: field points from high to low potential; equipotentials are perpendicular to field lines.",
        "Work by an external agent moving q from A to B = q(V_B − V_A); zero along an equipotential.",
        "Ring of charge Q on its axis: E = kQx/(R² + x²)^(3/2), zero at the centre, maximum at x = R/√2.",
        "Charge −q released on the axis near a ring performs SHM for small displacements.",
        "Oil drop held stationary: qE = mg.",
      ],
    },
    {
      heading: "Gauss's law and conductors",
      points: [
        "Total flux through a closed surface = q_enclosed/ε₀; outside charges change E but not net flux.",
        "Infinite line charge: E = λ/(2πε₀r); infinite sheet: σ/(2ε₀), independent of distance.",
        "Shell or conductor of charge Q: E = 0 inside, kQ/r² outside; potential inside equals the surface value kQ/R.",
        "Solid non-conducting sphere: E = kQr/R³ inside, maximum at the surface.",
        "Just outside a conductor E = σ/ε₀, normal to the surface; outward pressure σ²/(2ε₀).",
        "Charge collects most densely at sharp points (corona discharge, lightning conductors).",
      ],
    },
    {
      heading: "Electric dipole",
      points: [
        "Dipole moment p = q × 2a, directed from −q to +q.",
        "Short dipole: E_axial = 2kp/r³, E_equatorial = kp/r³ (opposite to p); ratio 2 : 1.",
        "V = kp cos θ/r², zero on the equatorial line.",
        "In a uniform field: net force 0, torque τ = pE sin θ, U = −pE cos θ; stable at θ = 0.",
        "Work to rotate a dipole from θ₁ to θ₂ = pE(cos θ₁ − cos θ₂).",
      ],
    },
    {
      heading: "Capacitors",
      points: [
        "C = Q/V; parallel plates C = Kε₀A/d; isolated sphere C = 4πε₀R.",
        "Series: same charge, 1/C = Σ1/Cᵢ; parallel: same voltage, C = ΣCᵢ.",
        "Energy U = ½CV² = Q²/2C = ½QV; energy density ½ε₀E².",
        "Slab of thickness t, constant K: C = ε₀A/(d − t + t/K); metal sheet (K → ∞) gives ε₀A/(d − t).",
        "Half area filled with K: parallel combination; half the gap filled: series combination.",
        "Battery disconnected: Q fixed; inserting dielectric cuts V and U by K.",
        "Battery connected: V fixed; inserting dielectric raises Q and U by K.",
      ],
    },
  ],
  formulas: [
    "E = kq/r², V = kq/r, E = −dV/dr",
    "Line λ/(2πε₀r); sheet σ/(2ε₀); conductor surface σ/ε₀",
    "τ = pE sin θ, U = −pE cos θ",
    "Common potential V = (C₁V₁ + C₂V₂)/(C₁ + C₂); energy lost = C₁C₂(V₁ − V₂)²/[2(C₁ + C₂)]",
    "Plates joined with opposite polarity: V = (C₁V₁ − C₂V₂)/(C₁ + C₂)",
    "Force between capacitor plates F = Q²/(2ε₀A)",
  ],
  traps: [
    "Potential is a scalar; never resolve it into components. Field is a vector; always add as vectors.",
    "Field inside a conductor is zero, but potential inside is not zero; it equals the surface potential.",
    "Equatorial dipole field points opposite to p, not along it.",
    "Charge sharing always loses energy as heat, even with ideal wires.",
    "Check whether the battery stays connected before applying any dielectric-insertion result.",
  ],
  examTips: [
    "NEET asks Coulomb force, dipole field ratios, series-parallel capacitors and energy changes with dielectrics.",
    "JEE Main adds Gauss's law for non-uniform charge, ring and disc fields, and partially filled capacitors.",
    "Statement-count and assertion-reason questions test conductor properties and flux.",
  ],
};

export default notes;

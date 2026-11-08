import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Torque and angular momentum",
      points: [
        "Torque τ = r × F, magnitude rF sin θ (unit N·m); τ_net = Iα about a fixed axis or the centre of mass.",
        "Angular momentum of a particle L = r × p; of a rigid body about its axis L = Iω.",
        "τ = dL/dt, so L is conserved when net external torque is zero (skater, two discs coupling).",
        "When I falls by a factor, ω rises by the same factor and KE = L²/2I rises too.",
        "Rotational KE = ½Iω²; work by torque = τθ; power = τω.",
      ],
    },
    {
      heading: "Moment of inertia",
      points: [
        "I = Σmr² depends on mass distribution and axis; SI unit kg·m².",
        "Ring MR² (axis) and ½MR² (diameter); disc ½MR² (axis) and ¼MR² (diameter).",
        "Solid sphere (2/5)MR²; hollow sphere (2/3)MR²; solid cylinder ½MR².",
        "Rod ML²/12 about the centre, ML²/3 about one end.",
        "Parallel axis: I = I_cm + Md² (d from the centre-of-mass axis only).",
        "Perpendicular axis (planar bodies only): I_z = I_x + I_y.",
        "Radius of gyration k: I = Mk².",
      ],
    },
    {
      heading: "Rolling without slipping",
      points: [
        "Condition: v_cm = Rω; contact point is momentarily at rest, top point moves at 2v.",
        "Total KE = ½Mv²(1 + k²/R²); for a solid sphere 2/7 of it is rotational.",
        "On an incline: a = g sin θ/(1 + k²/R²); order of arrival: solid sphere, disc/cylinder, hollow sphere, ring.",
        "Static friction does no work in pure rolling, so mechanical energy is conserved.",
        "A spinning body placed on a rough floor slides until v = Rω; friction then vanishes.",
        "Massive pulley (disc): add I/R² to the moving mass, e.g. a = (m₁ − m₂)g/(m₁ + m₂ + M/2).",
      ],
    },
    {
      heading: "Gravitation",
      points: [
        "F = Gm₁m₂/r², G = 6.67 × 10⁻¹¹ N·m²/kg²; g = GM/R².",
        "Height h ≪ R: g_h ≈ g(1 − 2h/R); depth d: g_d = g(1 − d/R), zero at the centre.",
        "Potential energy U = −GMm/r; orbital speed v = √(GM/r), independent of satellite mass.",
        "Satellite: KE = GMm/2r, PE = −GMm/r, total E = −GMm/2r.",
        "Escape speed √(2GM/R) = √2 × orbital speed near the surface ≈ 11.2 km/s for Earth.",
        "Kepler's laws: elliptical orbits, equal areas in equal times (L conserved), T² ∝ r³.",
        "Geostationary orbit: period 24 h, radius about 42,000 km from Earth's centre (height ≈ 36,000 km).",
      ],
    },
  ],
  formulas: [
    "τ = Iα, L = Iω, KE = ½Iω² = L²/2I",
    "v = √(2gh/(1 + k²/R²)) at the bottom of an incline",
    "Minimum μ for rolling: μ ≥ tan θ/(1 + R²/k²); solid sphere (2/7) tan θ",
    "Disc placed on a coaxial disc at rest: ω_final = I₁ω₁/(I₁ + I₂); KE is lost",
    "Rod hinged at one end released horizontally: initial α = 3g/2L",
    "T² = (4π²/GM) r³",
  ],
  traps: [
    "Parallel-axis theorem must start from the centre-of-mass axis; you cannot shift between two arbitrary axes directly.",
    "Perpendicular-axis theorem applies only to flat (laminar) bodies.",
    "Angular momentum is conserved in a sticking collision, but kinetic energy is not.",
    "g decreases both above and below the surface; the height formula 1 − 2h/R holds only for h ≪ R.",
    "Escape speed does not depend on the direction of launch or the mass of the body.",
  ],
  examTips: [
    "NEET repeatedly asks moments of inertia, rolling KE fractions, angular-momentum conservation and satellite energy.",
    "JEE Main adds massive pulleys, rods struck by impulses, toppling versus sliding and rolling with friction.",
    "Gravitation questions often compare two satellites using T² ∝ r³ and v ∝ 1/√r.",
  ],
};

export default notes;

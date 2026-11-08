import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Law, field and potential",
      points: [
        "F = Gm₁m₂/r², G = 6.67 × 10⁻¹¹ N m² kg⁻²; always attractive, central, independent of medium.",
        "Field E = F/m; potential V = −W/m with V = 0 at infinity; E = −dV/dr (component-wise E = −∇V).",
        "Point mass or outside a sphere: E = GM/r², V = −GM/r.",
        "Thin shell: inside E = 0 and V = −GM/R (constant).",
        "Solid sphere inside: E = GMr/R³ (linear in r); V = −GM(3R² − r²)/2R³, which is −3GM/2R at the centre.",
        "Ring on its axis at distance x: E = GMx/(R² + x²)^(3/2), V = −GM/√(R² + x²); E is maximum at x = R/√2.",
        "Potential energy of a pair: U = −Gm₁m₂/r; self-energy of a uniform sphere −3GM²/5R.",
      ],
    },
    {
      heading: "Acceleration due to gravity",
      points: [
        "g = GM/R² = (4/3)πGρR.",
        "Height: g_h = g/(1 + h/R)² ≈ g(1 − 2h/R) for h ≪ R.",
        "Depth: g_d = g(1 − d/R); zero at the centre.",
        "For small h, g at height h equals g at depth 2h.",
        "Latitude λ: g′ = g − ω²R cos²λ; maximum at poles, minimum at the equator.",
        "If R shrinks by a small x% at fixed mass, g rises by about 2x%.",
      ],
    },
    {
      heading: "Satellites and escape",
      points: [
        "Orbital speed v₀ = √(GM/r); period T = 2π√(r³/GM); near the surface v₀ ≈ 7.9 km/s, T ≈ 84 min.",
        "For a grazing orbit T = √(3π/Gρ), so T ∝ 1/√ρ.",
        "Energies: K = GMm/2r, U = −GMm/r, E = −GMm/2r; E = −K and U = 2E.",
        "Escape speed vₑ = √(2GM/R) = √(2gR) ≈ 11.2 km/s, independent of the mass and direction of projection.",
        "Energy to move from orbit r₁ to r₂: GMm/2 (1/r₁ − 1/r₂).",
        "Work to lift m from the surface to height h: GMmh/[R(R + h)]; for h = 2R this is (2/3)mgR.",
        "Geostationary: period 24 h, equatorial, west to east, height ≈ 36,000 km (radius ≈ 42,000 km).",
        "Polar satellites are low (hundreds of km) and scan the whole Earth for remote sensing.",
        "Objects in orbit are in free fall: apparent weight zero, a pendulum does not oscillate (T infinite).",
      ],
    },
    {
      heading: "Kepler's laws",
      points: [
        "First: orbits are ellipses with the Sun at one focus.",
        "Second: equal areas in equal times; areal velocity L/2m is constant (angular momentum conservation).",
        "Third: T² ∝ a³ (a = semi-major axis).",
        "Fastest at perihelion: v_max/v_min = r_max/r_min = (1 + e)/(1 − e).",
        "Smooth tunnel through a uniform Earth (any chord): SHM with T = 2π√(R/g) ≈ 84 min.",
      ],
    },
  ],
  formulas: [
    "g = GM/R²; g_h ≈ g(1 − 2h/R); g_d = g(1 − d/R)",
    "v₀ = √(GM/r); vₑ = √2 v₀ (at the surface); T² = 4π²r³/GM",
    "E = −GMm/2r; binding energy of a satellite = GMm/2r",
  ],
  traps: [
    "g(1 − 2h/R) is only for h ≪ R; for heights like R or 2R use the exact form.",
    "Do not take mgh for large heights; use the change in −GMm/r.",
    "Escape speed does not depend on launch angle (ignoring air and rotation).",
    "Inside a shell the field is zero but the potential is not.",
    "Increasing a satellite's energy moves it to a larger orbit where it moves slower.",
  ],
  examTips: [
    "NEET favours g variation, orbital/escape speed ratios and Kepler's laws.",
    "JEE Main adds energy-conservation problems, field from rings/shells and satellite energy changes.",
    "Statement-count questions on planetary motion and g are common in both.",
  ],
};

export default notes;

import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Work",
      points: [
        "Constant force: W = F·s = Fs cos θ; can be positive, negative or zero.",
        "Variable force: W = ∫F dx = area under the F–x graph.",
        "Gravity's work depends only on the change in height: W = mg(h₁ − h₂).",
        "Spring stretched from x₁ to x₂: work done on the spring = ½k(x₂² − x₁²).",
        "Normal force on a fixed surface and centripetal force do no work.",
      ],
    },
    {
      heading: "Energy and the work–energy theorem",
      points: [
        "Net work by all forces = change in kinetic energy (works in any inertial frame, for any force).",
        "KE = ½mv² = p²/2m; for equal momentum the lighter body has more KE.",
        "Conservative force: work is path-independent, zero round a closed loop; F = −dU/dx.",
        "Mechanical energy is conserved only when non-conservative forces do no work.",
        "Work done by friction = loss of mechanical energy (appears as heat).",
        "Equilibrium where dU/dx = 0: stable if d²U/dx² > 0 (U minimum), unstable if < 0 (U maximum).",
      ],
    },
    {
      heading: "Power",
      points: [
        "Average power = W/t; instantaneous P = F·v; 1 hp ≈ 746 W.",
        "Pump lifting mass rate m/t through height h: P = (m/t)gh (plus ½(m/t)v² if exit speed given).",
        "Vehicle at constant power: driving force = P/v; at top speed P/v equals the resistance.",
        "Constant power from rest (no resistance): ½mv² = Pt, so v ∝ √t and s ∝ t^(3/2).",
      ],
    },
    {
      heading: "Collisions",
      points: [
        "Momentum is conserved in every collision when external impulse is negligible.",
        "Elastic: KE also conserved, e = 1; perfectly inelastic: bodies stick, e = 0, maximum KE loss.",
        "Coefficient of restitution e = (velocity of separation)/(velocity of approach) along the line of impact.",
        "1D elastic, m₂ at rest: v₁ = (m₁ − m₂)u/(m₁ + m₂), v₂ = 2m₁u/(m₁ + m₂).",
        "Equal masses, elastic, head-on: velocities exchange; oblique with one at rest: they move at 90°.",
        "Ball dropped from h with restitution e: next height e²h; total time and distance form geometric series.",
        "Ballistic pendulum: momentum conservation in the impact, then energy conservation in the swing.",
      ],
    },
    {
      heading: "Centre of mass",
      points: [
        "x_cm = Σmᵢxᵢ/Σmᵢ; for two bodies it divides the line joining them inversely as the masses.",
        "Internal forces (explosion, man walking on a boat) cannot move the centre of mass.",
        "Explosion of a body at rest: total momentum after = 0, so fragment momenta add vectorially to zero.",
        "Two blocks on a spring: the centre of mass moves uniformly while the blocks oscillate about it.",
      ],
    },
  ],
  formulas: [
    "W_net = ΔKE; KE = p²/2m",
    "F = −dU/dx; stable equilibrium: d²U/dx² > 0",
    "P = F·v",
    "Perfectly inelastic: v = (m₁u₁ + m₂u₂)/(m₁ + m₂); KE lost = ½[m₁m₂/(m₁ + m₂)](u₁ − u₂)²",
    "e = √(h₂/h₁) for a bouncing ball",
    "Spring max compression: ½mv² = ½kx²",
  ],
  traps: [
    "Kinetic energy is not conserved in an inelastic collision even though momentum is.",
    "Gravity's work in a projectile depends only on height change, not the path length.",
    "Work done by a spring from x₁ to x₂ is not ½k(x₂ − x₁)²; use the difference of squares.",
    "For a bullet passing through a block, the bullet's final speed is not zero; conserve momentum with both final speeds.",
    "Unstable equilibrium is a maximum of U, not a minimum; check the second derivative.",
  ],
  examTips: [
    "NEET asks KE–momentum relations, power of pumps and engines, and restitution with bouncing balls.",
    "JEE Main chains a collision (momentum) with a later swing, spring compression or incline climb (energy).",
    "Potential-energy curve questions ask for force direction and stable or unstable points.",
  ],
};

export default notes;

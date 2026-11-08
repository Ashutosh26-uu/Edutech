import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Newton's laws",
      points: [
        "First law (law of inertia): a body keeps its state of rest or uniform motion unless a net external force acts.",
        "Inertia depends only on mass.",
        "Second law: F = dp/dt; for constant mass F = ma; impulse = FΔt = Δp.",
        "Third law: action and reaction are equal, opposite, act on different bodies, so they never cancel.",
        "Catching a ball with hands moving back increases the stopping time and lowers the force.",
        "Variable mass (conveyor belt, rocket): extra force = v dm/dt; rocket thrust = u_rel dm/dt.",
      ],
    },
    {
      heading: "Free-body method",
      points: [
        "Isolate each body, draw all forces (weight, normal, tension, friction, spring), then write ΣF = ma along chosen axes.",
        "Light string: same tension throughout; inextensible string links the accelerations.",
        "Blocks in contact pushed by F: common a = F/(total mass); contact force = (mass ahead) × a.",
        "Train of blocks pulled by F: tension in a string = (mass behind it) × a.",
        "Spring force cannot change instantly; a string force can (useful when a string is cut).",
        "Pulley pulled up with acceleration a₀: replace g by (g + a₀) in the Atwood results.",
      ],
    },
    {
      heading: "Frames and apparent weight",
      points: [
        "In a frame accelerating at a, add a pseudo force −ma on every body; it has no reaction pair.",
        "Lift accelerating up: reading = m(g + a); down: m(g − a); free fall: zero.",
        "Bob in an accelerating car hangs at tan θ = a/g behind the vertical.",
        "Block on a smooth wedge stays at rest relative to it when the wedge accelerates at g tan θ.",
      ],
    },
    {
      heading: "Friction",
      points: [
        "Static friction is self-adjusting: f ≤ μₛN; it equals the applied force until slipping starts.",
        "Kinetic friction fₖ = μₖN with μₖ < μₛ; it does not depend on contact area or speed (to first approximation).",
        "Angle of friction tan λ = μ; angle of repose on an incline tan θ = μₛ.",
        "Block pressed against a wall by F stays up if μF ≥ mg.",
        "Pulling at angle θ above horizontal reduces N to mg − F sin θ; least pulling force at tan θ = μ.",
        "Two stacked blocks: check whether they move together by comparing the required friction with μN.",
      ],
    },
    {
      heading: "Circular motion",
      points: [
        "Centripetal force mv²/r = mω²r always points to the centre; it is supplied by real forces.",
        "Level road: v_max = √(μrg).",
        "Banked road without friction: tan θ = v²/rg; with friction v_max = √(rg(μ + tan θ)/(1 − μ tan θ)).",
        "Conical pendulum: tan θ = v²/rg, period 2π√(L cos θ/g).",
        "Vertical circle on a string: to complete the loop, speed at the bottom ≥ √(5gr).",
      ],
    },
  ],
  formulas: [
    "Atwood: a = (m₁ − m₂)g/(m₁ + m₂), T = 2m₁m₂g/(m₁ + m₂)",
    "Block on smooth incline: a = g sin θ; rough incline sliding down: a = g(sin θ − μ cos θ)",
    "Force to push up a rough incline at constant speed: mg(sin θ + μ cos θ)",
    "Vertical circle: v_top ≥ √(gr), T_bottom − T_top = 6mg",
    "Conveyor belt: F = v(dm/dt)",
  ],
  traps: [
    "Do not write friction as μN when the body is not slipping; static friction may be smaller.",
    "Normal reaction is not always mg (inclines, angled pulls, lifts, vertical circles).",
    "Pseudo force appears only in non-inertial frames; never add it when working from the ground frame.",
    "Action–reaction pairs act on different bodies, so they do not appear in the same free-body diagram.",
    "Monkey-and-block problems: tension is the same on both sides, so equal masses gain equal upward acceleration.",
  ],
  examTips: [
    "NEET asks apparent weight in lifts, Atwood machines, angle of repose and banking of roads.",
    "JEE Main favours two-block friction systems (relative slipping), wedge problems and spring systems after a string is cut.",
    "Statement-count questions test conceptual points such as impulse, inertia and third-law pairs.",
  ],
};

export default notes;

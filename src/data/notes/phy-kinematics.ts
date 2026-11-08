import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Basic quantities",
      points: [
        "Displacement is a vector (shortest path); distance is a scalar and never less than |displacement|.",
        "Average velocity = displacement/time; average speed = distance/time.",
        "Instantaneous velocity v = dx/dt; acceleration a = dv/dt = v dv/dx.",
        "Speed decreases when velocity and acceleration point opposite (retardation).",
        "Angular speed ω = 2π × (revolutions per second); 120 rpm = 4π rad/s.",
      ],
    },
    {
      heading: "Uniform acceleration in 1D",
      points: [
        "v = u + at, s = ut + ½at², v² = u² + 2as, s = (u + v)t/2.",
        "Distance in the nth second: sₙ = u + a(2n − 1)/2.",
        "From rest, distances in successive equal intervals are in ratio 1 : 3 : 5 : 7 …",
        "Free fall: a = g downward; thrown up at u: H = u²/2g, time to top u/g, total time 2u/g.",
        "Body dropped from a moving balloon starts with the balloon's velocity, not zero.",
        "If a depends on t or x, integrate: v = ∫a dt, or use v dv = a dx.",
      ],
    },
    {
      heading: "Motion graphs",
      points: [
        "x–t graph: slope = velocity; a straight line means uniform velocity; curvature shows acceleration.",
        "v–t graph: slope = acceleration; signed area = displacement; total area (all positive) = distance.",
        "a–t graph: area = change in velocity.",
        "An x–t graph can never show two positions at one instant or a vertical segment.",
      ],
    },
    {
      heading: "Projectile motion",
      points: [
        "Horizontal velocity u cos θ stays constant; vertical motion has acceleration −g.",
        "Path is a parabola: y = x tan θ − gx²/(2u² cos² θ).",
        "Maximum range at 45° is u²/g; angles θ and 90° − θ give the same range.",
        "At the top, speed = u cos θ and velocity is perpendicular to g.",
        "Horizontal throw from height h: time √(2h/g), range u√(2h/g); final angle tan α = gt/u.",
        "On an incline, resolve g along and perpendicular to the plane and use those as the two axes.",
      ],
    },
    {
      heading: "Relative velocity",
      points: [
        "v_AB = v_A − v_B; for collision or minimum distance work entirely in one body's frame.",
        "Trains passing: time = (sum of lengths)/(relative speed).",
        "River (width d, river speed u, boat speed v): shortest time = d/v by heading straight across; drift = ud/v.",
        "Shortest path (only if v > u): head upstream at sin θ = u/v from the normal; time = d/√(v² − u²).",
        "If v < u, the boat cannot reach the opposite point; least drift comes from heading upstream at sin θ = v/u from the normal.",
        "Rain–man: the umbrella is held along the velocity of rain relative to the man, v_rain − v_man.",
      ],
    },
  ],
  formulas: [
    "sₙ = u + a(2n − 1)/2",
    "T = 2u sin θ/g, H = u² sin² θ/2g, R = u² sin 2θ/g",
    "R = 4H cot θ; at θ = 45°, R = 4H",
    "Equal distances at v₁, v₂: average speed = 2v₁v₂/(v₁ + v₂); equal times: (v₁ + v₂)/2",
    "Stopping distance ∝ u² for a fixed retardation",
  ],
  traps: [
    "Never use v = u + at when acceleration varies with time; integrate instead.",
    "Average speed for equal distances is the harmonic mean, not the arithmetic mean.",
    "Displacement and distance differ once the body reverses direction; split the motion at v = 0.",
    "Sign convention: take one direction positive and keep g negative (or positive) throughout the whole problem.",
    "Shortest time and shortest path in river problems are different headings; read which one is asked.",
  ],
  examTips: [
    "NEET favours graph reading, nth-second distance and projectile range/height ratios.",
    "JEE Main adds variable acceleration (a = f(t) or f(v)), projectiles on an incline and minimum-distance relative motion.",
    "Tower-last-second and balloon-drop problems are common; set up one equation of motion for the whole flight.",
  ],
};

export default notes;

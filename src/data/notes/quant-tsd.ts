import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core idea",
      points: [
        "Distance = speed × time; keep units consistent.",
        "km/h × 5/18 = m/s; m/s × 18/5 = km/h (36 km/h = 10 m/s, 72 km/h = 20 m/s).",
        "At constant distance, speed and time are inversely proportional.",
        "If speed becomes a/b of usual, time becomes b/a of usual.",
      ],
    },
    {
      heading: "Average speed",
      points: [
        "Average speed = total distance ÷ total time, never the plain average of speeds.",
        "Equal distances at u and v: 2uv/(u + v) (40 and 60 → 48 km/h).",
        "Equal times at u and v: (u + v)/2.",
        "Stoppages: stop time per hour = (speed without − speed with)/speed without × 60 min.",
      ],
    },
    {
      heading: "Relative speed and trains",
      points: [
        "Opposite directions: add speeds; same direction: subtract speeds.",
        "Train passing a pole or person: distance = train length.",
        "Train passing a platform, bridge or another train: distance = sum of both lengths.",
        "Meeting time from opposite ends = gap ÷ (sum of speeds); catching up = lead ÷ (difference of speeds).",
        "If one starts later, first find the head start distance, then use relative speed.",
      ],
    },
    {
      heading: "Boats and streams",
      points: [
        "Downstream speed D = b + s; upstream speed U = b − s (b = boat in still water, s = stream).",
        "b = (D + U)/2; s = (D − U)/2.",
        "Round trip of distance d each way: total time = d/(b + s) + d/(b − s).",
      ],
    },
    {
      heading: "Circular tracks and races",
      points: [
        "Same direction: first meeting time = track length ÷ (difference of speeds).",
        "Opposite directions: first meeting time = track length ÷ (sum of speeds).",
        "Meeting at the start point: LCM of the individual lap times.",
        "A beats B by x m in a race of L m: when A runs L, B runs L − x.",
      ],
    },
  ],
  formulas: [
    "1 km/h = 5/18 m/s",
    "Average speed (equal distances) = 2uv/(u + v)",
    "Still water = (D + U)/2; stream = (D − U)/2",
    "Crossing time = (L₁ + L₂)/(relative speed)",
    "Late/early: d = (product of speeds/difference of speeds) × time difference",
  ],
  traps: [
    "Converting units: mixing metres with km/h is the most common error.",
    "For a pole only the train's own length counts; for a platform add both lengths.",
    "Average speed for equal distances is the harmonic mean, not (u + v)/2.",
    "Upstream and downstream are swapped easily: downstream is the faster one.",
  ],
  examTips: [
    "Heavy weightage in SSC, railway (RRB NTPC/Group D) and bank exams; trains and boats appear almost every paper.",
    "Common types: crossing time, meeting point of two travellers, late/early arrival, circular track meetings.",
    "Convert everything to m/s for train-length questions and to km/h for travel questions before solving.",
  ],
};

export default notes;

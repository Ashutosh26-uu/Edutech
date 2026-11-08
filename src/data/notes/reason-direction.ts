import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core idea",
      points: [
        "Sketch every move on rough paper with north at the top, east to the right.",
        "Left and right depend on the direction the person is currently facing.",
        "Answer “how far from start” with net displacement, not total path walked.",
      ],
    },
    {
      heading: "The eight directions",
      points: [
        "Main: N, E, S, W; corners: NE, SE, SW, NW (each 45° from the main ones).",
        "Opposite pairs: N–S, E–W, NE–SW, NW–SE.",
        "Facing N: right = E, left = W. Facing S: right = W, left = E.",
        "Facing E: right = S, left = N. Facing W: right = N, left = S.",
      ],
    },
    {
      heading: "Turns and rotation",
      points: [
        "Right turn = 90° clockwise; left turn = 90° anticlockwise.",
        "180° turn: face the opposite direction, whichever way you rotate.",
        "Clockwise order: N → NE → E → SE → S → SW → W → NW → N.",
        "Net rotation trick: add clockwise turns, subtract anticlockwise ones, then reduce mod 360°.",
      ],
    },
    {
      heading: "Distance from start",
      points: [
        "Step 1: total all east moves minus west moves (net horizontal).",
        "Step 2: total all north moves minus south moves (net vertical).",
        "Step 3: distance = √(horizontal² + vertical²).",
        "Final direction: combine the two signs, e.g. net east and net north ⇒ north-east of start.",
        "If one net is zero, the person is due N/S/E/W of the start.",
      ],
    },
    {
      heading: "Shadows and clocks",
      points: [
        "Morning: sun in the east, shadow falls west. Evening: sun in the west, shadow falls east.",
        "At noon (in India) the shadow is almost absent; questions avoid noon.",
        "Morning shadow to your left ⇒ you face north; to your right ⇒ you face south.",
        "Evening shadow to your right ⇒ you face north; to your left ⇒ you face south.",
        "Clock questions: fix the direction of one numeral (e.g. 3 points east), then rotate the dial 30° per hour mark.",
      ],
    },
  ],
  formulas: [
    "Distance = √(net E–W² + net N–S²)",
    "Pythagorean triples: 3-4-5, 6-8-10, 5-12-13, 8-15-17, 9-12-15, 7-24-25",
    "Diagonal of a square of side a = a√2",
    "One clock mark = 30°; minute hand moves 6° per minute",
  ],
  traps: [
    "Using total distance walked instead of shortest distance from start.",
    "Taking “left” as west regardless of facing direction.",
    "Mixing the shadow rule: morning shadow points west, not east.",
    "Reporting the start’s direction from the person when asked the person’s direction from the start (they are opposite).",
    "Forgetting that repeated left turns can bring the person back on a parallel line.",
  ],
  examTips: [
    "SSC, railway and bank prelims ask 1–3 questions: plain walks, turns, shadows and point-to-point grids.",
    "Bank papers use “point P is 4 m north of Q…” grids with 6–8 points; draw the whole grid once.",
    "Learn the common triples so the √ step takes no time.",
  ],
};

export default notes;

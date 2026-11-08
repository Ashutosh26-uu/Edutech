import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core method",
      points: [
        "Step 1: draw the frame (row, circle, table, floors, boxes, calendar) before reading clues.",
        "Step 2: place definite clues first (an end seat, a given floor, a fixed day, 'opposite').",
        "Step 3: link clues that share a person; write each uncertain clue as two cases side by side.",
        "Step 4: apply negative clues ('not adjacent', 'not on an even floor') to kill cases.",
        "Step 5: when one case survives, fill the rest and re-check every clue once.",
        "Count unknown 'some persons' puzzles only after fixing everyone named.",
      ],
    },
    {
      heading: "Linear arrangement",
      points: [
        "Facing north: your right is the observer's right (east). Facing south: your right is the observer's left (west).",
        "'Immediate right' means the adjacent seat; 'second to the right' leaves one seat between.",
        "'Between' counts only those strictly in between.",
        "Total in a row: position from left + position from right − 1.",
        "If X is pth from the left and Y is q places right of X (facing north), Y is (p + q)th from the left.",
        "Two parallel rows facing each other: the person opposite you has your right as their left.",
        "Mixed facing: mark an arrow on each person, then read left/right from that arrow.",
      ],
    },
    {
      heading: "Circular and square tables",
      points: [
        "Facing the centre: left = clockwise, right = anticlockwise; facing outward, reverse.",
        "In a circle of n, 'opposite' needs n even; seats are n/2 apart.",
        "If A is m-th to the left and n-th to the right of B, there are m + n persons (when counting from the same person each way).",
        "Square table: corner and side-middle seats may face different ways; read left/right from each person's own facing.",
        "Fix one person at the top of the diagram; rotating the whole circle does not create a new arrangement.",
      ],
    },
    {
      heading: "Floors, boxes, days and attributes",
      points: [
        "Floors and boxes are counted from the bottom (1 = lowest) unless stated.",
        "'Immediately above' means the very next floor; 'above' alone allows gaps.",
        "'Two persons live between A and B' means a gap of three floors.",
        "Flats on a floor (east/west) form a grid: track floor and side separately.",
        "Days/months puzzles: use the calendar order and note dates within a month (12th before 25th).",
        "Designation puzzles: rank order (CEO highest) behaves like floors.",
        "Attribute puzzles (car colour, city, sport): build a table with a column per attribute and tick only definite matches.",
      ],
    },
  ],
  formulas: [
    "Persons in a row = left position + right position − 1",
    "Circle: m-th left and n-th right of the same person ⇒ m + n persons",
    "k persons between two floors ⇒ floor difference k + 1",
  ],
  traps: [
    "Reading 'left' from your own view instead of the person's facing, especially facing south or outward.",
    "Treating 'above' as 'immediately above'.",
    "Fixing a case too early; keep alternatives until a clue rules one out.",
    "Assuming everyone faces the centre when the puzzle says some face outside.",
    "Forgetting that 'between' excludes the two people named.",
  ],
  examTips: [
    "IBPS, SBI PO and clerk mains give large puzzles in sets of five questions; prelims use smaller ones.",
    "Solve the puzzle fully before answering; most questions in a set then take seconds.",
    "SSC and RRB ask single-question linear or circular arrangements; aim for one diagram, no cases.",
  ],
};

export default notes;

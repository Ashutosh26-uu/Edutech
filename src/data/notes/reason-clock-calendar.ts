import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Clock basics",
      points: [
        "Minute hand moves 6° per minute; hour hand 0.5° per minute (30° per hour)",
        "Relative speed: the minute hand gains 5.5° per minute, i.e. 55 minute-spaces per hour",
        "Angle at H:M = |30H − 5.5M|; if the result exceeds 180°, the smaller angle is 360° minus it",
        "Hour hand turn between two times = 0.5° × minutes elapsed (e.g. 8:20 to 2:50 is 390 min = 195°)",
      ],
    },
    {
      heading: "Hands coinciding, opposite, at right angles",
      points: [
        "Between H and H + 1, hands coincide at 60H/11 minutes past H (4 o'clock: 21 9/11 min)",
        "For an angle θ between H and H + 1: M = (2/11)(30H ± θ); take the value that lies between 0 and 60",
        "In 12 hours: coincide 11 times, opposite 11 times, right angle 22 times, straight line 22 times",
        "In 24 hours: coincide 22, opposite 22, right angle 44, straight line 44",
        "Hands coincide every 65 5/11 minutes, not every 65 minutes",
      ],
    },
    {
      heading: "Mirror images and faulty clocks",
      points: [
        "Mirror time = 11:60 − shown time (for times after 11:00, use 23:60 − shown time)",
        "Water image (vertical flip) = 18:30 − shown time, used rarely",
        "Losing/gaining clock: set up the ratio clock-time : true-time from the given rate and scale it",
        "A watch losing 2 min per hour shows 58 min for every 60 true minutes",
      ],
    },
    {
      heading: "Calendar and odd days",
      points: [
        "Odd days = days left over after full weeks (total days mod 7)",
        "Ordinary year 1 odd day, leap year 2; 100 years 5, 200 years 3, 300 years 1, 400 years 0",
        "Leap year: divisible by 4; century years only if divisible by 400 (2000 yes, 1900 and 2100 no)",
        "Month odd days: 31-day months 3, 30-day months 2, February 0 (or 1 in a leap year)",
        "Moving forward one year adds 1 day (2 if the span crosses 29 February)",
        "Day code from odd days: 0 Sunday, 1 Monday … 6 Saturday",
        "Last day of a century is never Tuesday, Thursday or Saturday",
        "Same calendar: a leap year repeats after 28 years; an ordinary year usually after 6 or 11 years; check odd days sum to a multiple of 7 and leap status matches",
      ],
    },
    {
      heading: "Painted cubes",
      points: [
        "n × n × n painted cube cut into n³ unit cubes: three faces 8, two faces 12(n − 2), one face 6(n − 2)², none (n − 2)³",
        "At least one face painted = n³ − (n − 2)³",
        "Cuboid a × b × c: none (a − 2)(b − 2)(c − 2); two faces 4[(a − 2) + (b − 2) + (c − 2)]",
        "Only some faces painted: count face by face; cubes on a shared edge of two painted faces get two colours",
      ],
    },
  ],
  formulas: [
    "θ = |30H − 5.5M|",
    "Coincide: M = 60H/11 minutes past H",
    "Mirror time = 11:60 − given time",
    "Odd days: 100 yr = 5, 200 yr = 3, 300 yr = 1, 400 yr = 0",
    "Painted cube: 8, 12(n − 2), 6(n − 2)², (n − 2)³",
  ],
  traps: [
    "Counting 1900 or 2100 as leap years",
    "Forgetting that the hour hand also moves: at 7:30 it is midway between 7 and 8, so the angle is 45°, not 60°",
    "Adding the leap day when the span ends before 29 February (1 Jan to 1 Jan of the next year uses the first year's length)",
    "'Counting both dates' needs +1 to the difference of dates",
    "Saying 24 right angles in 12 hours; between 2 and 4 and between 8 and 10 there are only 3 each (3:00 and 9:00 are shared), so the count is 22",
  ],
  examTips: [
    "SSC CGL, CHSL and RRB NTPC ask one clock or calendar question almost every shift; angle and day-of-week are the favourites",
    "Statement-count questions (how many are correct) test leap-year and coincidence facts together",
    "Cube painting comes as 'how many have at least one / exactly two faces painted' in SSC and bank clerk papers",
  ],
};

export default notes;

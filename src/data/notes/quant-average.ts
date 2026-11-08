import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core idea",
      points: [
        "Average = sum of observations ÷ number of observations.",
        "Sum = average × count; most questions are solved by working with sums.",
        "Adding, subtracting, multiplying or dividing every value by k does the same to the average.",
        "Weighted average = (n₁a₁ + n₂a₂)/(n₁ + n₂) for two groups.",
      ],
    },
    {
      heading: "Number series averages",
      points: [
        "First n natural numbers: (n + 1)/2.",
        "First n even numbers: n + 1; first n odd numbers: n.",
        "Any arithmetic progression: (first + last)/2.",
        "Squares of first n naturals: (n + 1)(2n + 1)/6.",
        "Consecutive numbers: average is the middle term (or mean of the two middle terms).",
      ],
    },
    {
      heading: "Replacement and joining",
      points: [
        "One person replaced, average up by d for n people: new = old + nd.",
        "New person joins n people, average up by d: new person = old average + (n + 1)d.",
        "Person leaves n people, average falls by d: leaver = old average + (n − 1)d.",
        "Committee average unchanged over t years after a replacement: new member is n × t years younger than the old one.",
      ],
    },
    {
      heading: "Innings and overlaps",
      points: [
        "Batsman scores x in the nth innings and raises average by d: new average = x − (n − 1)d.",
        "First k and last k of 2k − 1 results share the middle one: middle = sum(first k) + sum(last k) − total.",
        "Average of A, B, C and pairs given: add pair sums, subtract the total to isolate one person.",
        "Average speed for equal distances at u and v: 2uv/(u + v), not (u + v)/2.",
      ],
    },
  ],
  formulas: [
    "Sum = average × count",
    "Weighted average = Σnᵢaᵢ/Σnᵢ",
    "Average of 1 to n = (n + 1)/2",
    "Innings: new average = x − (n − 1)d",
    "Equal distance average speed = 2uv/(u + v)",
  ],
  traps: [
    "Do not average two averages of unequal groups; use weights.",
    "When a person replaces another, the count stays the same; when someone joins, it rises by 1.",
    "In overlapping-groups questions, the shared middle value is counted twice.",
    "Average age after t years rises by t for everyone, so total rises by n × t.",
  ],
  examTips: [
    "Comes as 1–2 quick questions in SSC, railway and bank prelims; easy marks if done with sums.",
    "Frequent forms: cricketer's innings, replacement of a member, ages of a family, overlapping results.",
    "Use deviation from an assumed mean to add long lists quickly.",
  ],
};

export default notes;

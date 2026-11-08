import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "How to trace",
      points: [
        "Make a trace table: one column per variable, one row per executed line or loop pass",
        "Use the updated value immediately in later lines of the same pass",
        "Note the loop bounds first: does 'for i = 1 to n' include n? (In pseudocode tests, yes)",
        "For while loops, check the condition before every pass; for do-while, the body runs once even if the condition is false",
      ],
    },
    {
      heading: "Arithmetic and operators",
      points: [
        "Integer variables: `/` drops the fraction (7 / 2 = 3); tests follow C rules, so −7 / 2 = −3 and −7 mod 2 = −1",
        "`*`, `/` and `mod` share one precedence level and are evaluated left to right: 10 / 3 * 3 = 9",
        "Relational operators bind tighter than `&&`, and `&&` tighter than `||`",
        "`&&` and `||` short-circuit: in `a || f()`, f is never called when a is true",
        "`x++` uses the old value then increments; `++x` increments first",
      ],
    },
    {
      heading: "Loops",
      points: [
        "`break` exits only the innermost loop; `continue` jumps to the next pass of the innermost loop",
        "Nested loop with j from i to n runs n(n + 1)/2 times in total",
        "A loop that doubles i (i = i * 2) runs about log₂ n times; one that halves n also runs ⌊log₂ n⌋ + 1 times",
        "Digit loops: `n mod 10` gives the last digit, `n / 10` removes it – used for sum, reverse and palindrome checks",
      ],
    },
    {
      heading: "Recursion",
      points: [
        "Write the base case first, then build values upward: f(0), f(1), f(2)…",
        "Count calls with C(n) = 1 + sum of calls made by the children; for naive Fibonacci (base n ≤ 1) calls = 2F(n + 1) − 1",
        "Code after the recursive call runs while the stack unwinds, so prints come out in reverse order",
        "A `static` (or global) counter is shared by every call; a local variable is fresh each call",
        "Common hidden functions: gcd by repeated mod, power by halving, sum of digits, binary conversion",
      ],
    },
    {
      heading: "Bitwise operators",
      points: [
        "`&` AND, `|` OR, `^` XOR, `~` NOT, `<<` left shift, `>>` right shift",
        "`x << k` = x × 2ᵏ, `x >> k` = ⌊x / 2ᵏ⌋ for non-negative x",
        "`~x` = −(x + 1) in two's complement, so ~5 = −6",
        "`x ^ x` = 0 and `x ^ 0` = x, so XOR of a list cancels pairs and leaves the odd one out",
        "`n & (n − 1)` clears the lowest set bit (loop count = number of 1s); it is 0 only for powers of two",
        "`n & −n` keeps only the lowest set bit; `n & 1` tests odd/even",
      ],
    },
  ],
  formulas: [
    "Iterations of 'for i = a to b step s' = ⌊(b − a)/s⌋ + 1 (if a ≤ b)",
    "Σ i for i = 1..n = n(n + 1)/2; Σ i² = n(n + 1)(2n + 1)/6",
    "Fibonacci recursive calls: 1, 1, 3, 5, 9, 15, 25 for n = 0..6",
    "a ^ b ^ a = b (XOR swap: a = a ^ b; b = a ^ b; a = a ^ b)",
    "Set bits: 7 → 3, 8 → 1, 15 → 4, 255 → 8",
  ],
  traps: [
    "Using real division (3.5) when the variables are integers",
    "Evaluating `a + b * c mod d` in the wrong order – multiply and mod go left to right before the add",
    "Counting a loop one pass short when the bound is inclusive",
    "Assuming `break` leaves all nested loops",
    "Forgetting that the right side of `&&`/`||` may never run, so a counter inside it is not incremented",
  ],
  examTips: [
    "TCS NQT, Accenture, Capgemini, Infosys and Cognizant all have a pseudocode/programming-logic section with 5–10 line snippets",
    "Options are usually close numbers built from common slips (off-by-one, real vs integer division) – trace, do not guess",
    "If a loop runs many times, run 3–4 passes to spot the pattern, then jump to the end",
  ],
};

export default notes;

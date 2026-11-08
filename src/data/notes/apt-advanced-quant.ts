import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Remainders and last digits",
      points: [
        "Unit-digit cycles: 2 → 2, 4, 8, 6; 3 → 3, 9, 7, 1; 7 → 7, 9, 3, 1; 8 → 8, 4, 2, 6; 4 and 9 cycle in 2; 0, 1, 5, 6 never change",
        "Reduce the exponent mod the cycle length (if it comes to 0, use the full cycle length)",
        "Fermat: aᵖ⁻¹ ≡ 1 (mod p) for prime p not dividing a; Euler: a^φ(n) ≡ 1 (mod n) when gcd(a, n) = 1",
        "Last two digits: any number coprime to 10 raised to 20 ends in 01; 2¹⁰ ends in 24, and 24 to an odd power ends in 24, to an even power in 76",
      ],
    },
    {
      heading: "Divisibility, factors, HCF and LCM",
      points: [
        "Divisible by 8: last three digits; by 9: digit sum; by 11: alternate-digit sums differ by 0 or a multiple of 11; for 72 test 8 and 9",
        "N = pᵃ qᵇ rᶜ has (a + 1)(b + 1)(c + 1) factors",
        "Power of prime p in n! = ⌊n/p⌋ + ⌊n/p²⌋ + …; trailing zeros of n! = power of 5",
        "Trailing zeros in base b: factorise b, then minimum over its primes of ⌊(power of p in n!) / (power of p in b)⌋",
        "Greatest number leaving the same remainder: HCF of the pairwise differences",
        "Smallest number leaving remainder r with each divisor: LCM × k + r",
        "Pairs with sum S and HCF H: write as Ha + Hb with a + b = S/H and gcd(a, b) = 1, then count",
      ],
    },
    {
      heading: "Number bases and logarithms",
      points: [
        "Base b → decimal: Σ digit × b^position (rightmost position 0); decimal → base b: repeated division, read remainders upward",
        "log(ab) = log a + log b; log(aⁿ) = n log a; logₐ b = log b / log a; log_(aᵏ) x = (1/k) logₐ x",
        "Digits in N = ⌊log₁₀ N⌋ + 1; log 2 ≈ 0.3010, log 3 ≈ 0.4771",
        "For N < 1, zeros right after the decimal point = |characteristic| − 1",
      ],
    },
    {
      heading: "Ages, mixtures, work and pipes",
      points: [
        "Alligation: cheaper : dearer = (d − m) : (m − c), m = mean value",
        "Repeated replacement: pure left = V(1 − x/V)ⁿ after removing x and refilling n times",
        "Add rates, not times: A and B together take ab/(a + b)",
        "Given A+B, B+C, C+A times: add the three rates and halve for A+B+C",
        "Leak: fill time a, with leak b → leak alone empties in ab/(b − a)",
        "Alternating pipes: find work per full cycle, run whole cycles, then finish the last part hour by hour",
      ],
    },
    {
      heading: "Clocks and calendars",
      points: [
        "Angle = |30H − 5.5M|; take 360 minus it if over 180",
        "Hands meet every 65 5⁄11 minutes; between H and H + 1 they meet at 60H/11 minutes past H",
        "In 24 hours: coincide 22 times, right angles 44 times, opposite 22 times",
        "Odd days: ordinary year 1, leap year 2; 100 years 5, 200 years 3, 300 years 1, 400 years 0",
        "Century years are leap only if divisible by 400 (1900 no, 2000 yes)",
        "Same calendar again: leap year +28 years; year after a leap year +6; other non-leap years +11 (within a century)",
      ],
    },
    {
      heading: "Progressions and inequalities",
      points: [
        "AP: aₙ = a + (n − 1)d, Sₙ = n/2 [2a + (n − 1)d]",
        "GP: aₙ = arⁿ⁻¹, Sₙ = a(rⁿ − 1)/(r − 1); infinite sum a/(1 − r) when |r| < 1",
        "Rational inequalities: mark zeros of numerator and denominator on a number line, test signs, exclude denominator zeros",
      ],
    },
  ],
  formulas: [
    "HCF × LCM = product (two numbers only)",
    "Clock gaining g min/hour: true time elapsed = shown time × 60/(60 + g)",
  ],
  traps: [
    "Using HCF × LCM = product for three numbers",
    "Taking the power of 2 for trailing zeros of n! – it is always the power of 5 (in base 10)",
    "Adding times instead of rates in work and pipe problems",
    "Forgetting the 400-year rule for century leap years",
    "Including a value that makes the denominator zero in an inequality's solution",
  ],
  examTips: [
    "TCS NQT advanced quant and Infosys mathematical ability chain two ideas – e.g. remainder plus divisibility, clock plus ratio",
    "Number theory (remainders, last digits, factorials, HCF/LCM) carries the most questions; clocks and calendars are quick marks",
  ],
};

export default notes;

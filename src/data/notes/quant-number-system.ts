import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Types of numbers",
      points: [
        "Natural 1, 2, 3…; whole numbers include 0; integers include negatives.",
        "Prime: exactly two factors (2 is the only even prime); 1 is neither prime nor composite.",
        "There are 25 primes below 100.",
        "Co-primes have HCF 1 (they need not be prime themselves, e.g. 8 and 15).",
      ],
    },
    {
      heading: "Divisibility rules",
      points: [
        "2: last digit even; 5: last digit 0 or 5; 10: last digit 0.",
        "3 / 9: digit sum divisible by 3 / 9.",
        "4: last two digits divisible by 4; 8: last three digits divisible by 8.",
        "6: divisible by 2 and 3; 12: by 3 and 4; 15: by 3 and 5 (use co-prime factor pairs).",
        "11: (sum of odd-place digits − sum of even-place digits) is 0 or a multiple of 11.",
      ],
    },
    {
      heading: "Factors, LCM and HCF",
      points: [
        "N = pᵃqᵇrᶜ ⇒ number of factors = (a + 1)(b + 1)(c + 1); 360 = 2³·3²·5 has 24.",
        "HCF: lowest powers of common primes; LCM: highest powers of all primes.",
        "For two numbers: HCF × LCM = product of the numbers.",
        "HCF of fractions = HCF of numerators/LCM of denominators; LCM of fractions = LCM of numerators/HCF of denominators.",
        "Numbers with HCF h: write them as ha and hb with a, b co-prime, then count valid co-prime pairs.",
      ],
    },
    {
      heading: "LCM/HCF word problems",
      points: [
        "Least number leaving remainder r with each divisor: LCM + r.",
        "Greatest number dividing x, y leaving remainders r₁, r₂: HCF(x − r₁, y − r₂).",
        "Greatest number dividing x, y, z leaving the same remainder: HCF of their differences.",
        "Bells, lights, runners meeting together: LCM of their intervals.",
        "Largest tile, container or plank size: HCF of the lengths.",
      ],
    },
    {
      heading: "Remainders, unit digits, zeros",
      points: [
        "Remainder of a product or sum = product or sum of the remainders (then reduce).",
        "If N leaves remainder r with d, Nᵏ leaves the remainder of rᵏ with d.",
        "Unit digit cycles of 4: 2 (2, 4, 8, 6), 3 (3, 9, 7, 1), 7 (7, 9, 3, 1), 8 (8, 4, 2, 6); use power mod 4 (0 → 4th term).",
        "0, 1, 5, 6 keep their unit digit; 4 and 9 alternate (odd power keeps, even power gives 6 or 1).",
        "Trailing zeros in n! = ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + … (100! has 24).",
        "From 4! onward every factorial is divisible by 12 (and from 5! by 10).",
      ],
    },
  ],
  formulas: [
    "Factors of pᵃqᵇrᶜ = (a + 1)(b + 1)(c + 1)",
    "HCF × LCM = a × b (two numbers)",
    "Sum of first n naturals = n(n + 1)/2",
    "Sum of squares = n(n + 1)(2n + 1)/6; sum of cubes = [n(n + 1)/2]²",
    "Trailing zeros of n! = Σ⌊n/5ᵏ⌋",
  ],
  traps: [
    "HCF × LCM = product works only for two numbers, not three.",
    "1 is not a prime number; 2 is prime.",
    "Counting zeros in n!: do not forget the extra 5s in 25, 50, 75, 100.",
    "In unit-digit cycles, a power that is a multiple of 4 takes the 4th term, not the 1st.",
    "'Besides the first toll' means exclude the starting moment when counting coincidences.",
  ],
  examTips: [
    "Core of SSC CGL/CHSL and placement tests; questions on factors, LCM/HCF and remainders appear in most papers.",
    "Common types: number of factors, bells tolling together, largest/least number with remainders, unit digit of big powers.",
    "Use prime factorisation as the default first step.",
  ],
};

export default notes;

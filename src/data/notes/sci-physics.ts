import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Units and quantities",
      points: [
        "Seven SI base units: metre, kilogram, second, ampere (current), kelvin, mole, candela.",
        "Derived: newton (force), joule (work/energy), watt (power), pascal (pressure), coulomb (charge), volt, ohm, hertz.",
        "1 N = 1 kg·m/s²; 1 Pa = 1 N/m²; 1 J = 1 N·m; 1 W = 1 J/s; 1 Ω = 1 V/A.",
        "Vectors have direction: displacement, velocity, acceleration, force, momentum. Scalars do not: mass, speed, distance, energy, work, time.",
        "Instruments: barometer – air pressure; hygrometer – humidity; anemometer – wind speed; lactometer – milk purity; sphygmomanometer – blood pressure.",
      ],
    },
    {
      heading: "Motion, force and gravitation",
      points: [
        "Newton’s first law (law of inertia): a body stays at rest or in uniform motion unless a net force acts.",
        "Second law: F = ma; force equals rate of change of momentum. Third law: every action has an equal and opposite reaction.",
        "Equations of motion: v = u + at; s = ut + ½at²; v² = u² + 2as.",
        "A ball thrown up has zero velocity at the top but its acceleration is still g (≈ 9.8 m/s²) downward.",
        "Gravitation: F = Gm₁m₂/r². Doubling both masses and the distance leaves F unchanged.",
        "In a lift accelerating down, apparent weight falls (feel lighter); in free fall, weightlessness.",
      ],
    },
    {
      heading: "Work, energy, pressure and fluids",
      points: [
        "Work W = F × s (along the force). Kinetic energy = ½mv²; potential energy = mgh.",
        "Power = work ÷ time. 1 kWh = 3.6 × 10⁶ J; 1 horsepower ≈ 746 W.",
        "Efficiency = useful output ÷ input × 100.",
        "Pressure = force ÷ area. Pascal’s law: pressure in a confined fluid is transmitted equally (hydraulic lift, brakes).",
        "Archimedes’ principle: buoyant force = weight of fluid displaced. A floating body’s fraction submerged = its density ÷ fluid density.",
      ],
    },
    {
      heading: "Light and sound",
      points: [
        "Speed of light in vacuum ≈ 3 × 10⁸ m/s; light slows in denser media (refraction).",
        "Blue sky and red sunsets: scattering of light (Rayleigh). Rainbow: refraction, dispersion and internal reflection in raindrops.",
        "Optical fibres and the sparkle of diamond use total internal reflection.",
        "Myopia (near-sightedness) corrected by a concave lens; hypermetropia by a convex lens.",
        "Sound is a mechanical wave and needs a medium; it cannot travel in vacuum. Fastest in solids, slowest in gases.",
        "Speed of sound in air ≈ 343 m/s at 20 °C. Human hearing 20 Hz–20 kHz; above it ultrasound, below it infrasound.",
        "Pitch depends on frequency; loudness on amplitude. Echo needs a distance of at least about 17 m.",
      ],
    },
    {
      heading: "Electricity",
      points: [
        "Ohm’s law: V = IR. Power P = VI = I²R = V²/R.",
        "Series: R = R₁ + R₂ (same current). Parallel: 1/R = 1/R₁ + 1/R₂ (same voltage); homes are wired in parallel.",
        "Bulb resistance R = V²/P (from its rating); at half the rated voltage it uses one-quarter of the rated power.",
        "In series, the lower-wattage bulb (higher resistance) glows brighter.",
        "Faraday: electromagnetic induction (generators, transformers).",
      ],
    },
  ],
  formulas: [
    "F = ma; p = mv; W = Fs; KE = ½mv²; PE = mgh; P = W/t.",
    "v = u + at; s = ut + ½at²; v² = u² + 2as.",
    "V = IR; P = VI = I²R = V²/R; energy (kWh) = kW × hours.",
    "Density = mass ÷ volume; pressure = force ÷ area.",
  ],
  traps: [
    "Mass is constant everywhere; weight (mg) changes with g.",
    "At the top of a vertical throw, velocity = 0 but acceleration ≠ 0.",
    "1 kWh is 3.6 × 10⁶ J, not 1,000 J — convert kW to W and hours to seconds.",
    "Speed is scalar; velocity is vector.",
    "Bulbs in series: the 60 W bulb is brighter than the 100 W bulb.",
  ],
  examTips: [
    "SSC and Railways ask SI units, instruments, laws and everyday phenomena (blue sky, mirage, echo).",
    "RRB NTPC/Group D and SSC include one-step numericals on F = ma, KE, power, energy bills and bulb ratings.",
  ],
};

export default notes;

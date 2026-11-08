import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "The Sun and the system",
      points: [
        "The Sun is a G-type main-sequence star, made mostly of hydrogen (about three-quarters) and helium.",
        "Energy comes from nuclear fusion of hydrogen into helium in the core.",
        "Sunlight takes about 8 minutes 20 seconds to reach Earth (average distance about 150 million km = 1 AU).",
        "The Solar System lies in the Orion Arm (Orion Spur) of the Milky Way galaxy.",
        "Eight planets since the IAU’s 2006 definition; Pluto was reclassified as a dwarf planet.",
      ],
    },
    {
      heading: "Planets",
      points: [
        "Order from the Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.",
        "Inner (terrestrial, rocky): Mercury, Venus, Earth, Mars. Outer: Jupiter and Saturn (gas giants), Uranus and Neptune (ice giants).",
        "Mercury: smallest and closest to the Sun; shortest year (about 88 days); no moon.",
        "Venus: hottest planet (thick CO₂ atmosphere, runaway greenhouse effect); rotates east to west (retrograde); no moon; brightest planet in our sky.",
        "Earth: densest planet; only known life. Mars: “Red Planet” (iron oxide); moons Phobos and Deimos; Olympus Mons is the tallest known volcano.",
        "Jupiter: largest planet; fastest rotation (day just under 10 hours); Great Red Spot storm.",
        "Saturn: most prominent rings; least dense (would float in water). All four giant planets have rings.",
        "Uranus: rotates on its side (axial tilt about 98°). Neptune: farthest planet, strongest winds.",
        "Size order: Jupiter > Saturn > Uranus > Neptune > Earth > Venus > Mars > Mercury.",
      ],
    },
    {
      heading: "Moons and small bodies",
      points: [
        "Ganymede (Jupiter) is the largest moon, bigger than Mercury; Titan (Saturn) is second and has a thick nitrogen atmosphere.",
        "Galilean moons of Jupiter (Io, Europa, Ganymede, Callisto) were seen by Galileo in 1610.",
        "Triton (Neptune) orbits backwards (retrograde). Charon is Pluto’s largest moon.",
        "Earth’s Moon is the fifth-largest moon in the Solar System.",
        "Asteroid belt lies between Mars and Jupiter; Ceres is the only dwarf planet in it.",
        "IAU dwarf planets: Ceres, Pluto, Eris, Haumea, Makemake. Pluto lies in the Kuiper Belt.",
        "Comets come from the Kuiper Belt and Oort Cloud; their tails point away from the Sun. Halley’s Comet returns about every 76 years.",
      ],
    },
    {
      heading: "Kepler’s laws",
      points: [
        "First law: planets move in ellipses with the Sun at one focus.",
        "Second law: a line from the Sun to a planet sweeps equal areas in equal times — fastest at perihelion (nearest), slowest at aphelion.",
        "Third law: T² ∝ a³ (T = orbital period, a = mean distance from the Sun).",
      ],
    },
  ],
  formulas: [
    "Kepler III: T² ∝ a³. In Earth units, T (years) = a^(3/2) with a in AU — 4 AU → 8 years.",
    "1 AU ≈ 1.5 × 10⁸ km; light from Sun ≈ 8 min 20 s.",
    "Planet order mnemonic: “My Very Educated Mother Just Served Us Noodles”.",
    "No moons: Mercury and Venus. Mars: 2 moons.",
  ],
  traps: [
    "Venus, not Mercury, is the hottest planet even though Mercury is closer to the Sun.",
    "Saturn is not the only ringed planet — Jupiter, Uranus and Neptune have faint rings.",
    "Ganymede and Titan are larger than Mercury but less massive.",
    "Venus and Uranus rotate “backwards” (east to west); others west to east.",
    "Earth is nearest the Sun (perihelion) in early January, not in summer.",
  ],
  examTips: [
    "SSC and Railways ask superlatives (largest, hottest, fastest, ringed) and planet–moon matching.",
    "UPSC and CDS ask statement questions on dwarf planets, rotation and Kepler’s laws, sometimes with a simple T² ∝ a³ calculation.",
  ],
};

export default notes;

import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Physics around us",
      points: [
        "Sweat cools us because evaporation takes latent heat from the skin",
        "Pan handles are wood or plastic because they are poor conductors of heat",
        "Dark clothes absorb more heat, so they suit winter; light colours reflect it",
        "Stars twinkle due to atmospheric refraction; planets do not, being nearer and seen as discs",
        "Mirage: refraction through hot, less dense air near the ground, ending in total internal reflection",
        "Sky is blue due to scattering of short wavelengths; space looks black as there is no air to scatter light",
        "Danger signals are red because red has the longest wavelength and scatters least",
        "Lightning distance = speed of sound × delay (3 s × 340 m/s = 1,020 m)",
        "A ship rises a little moving from river to sea because sea water is denser",
        "Pressure cookers cook faster because higher pressure raises the boiling point",
      ],
    },
    {
      heading: "Kitchen and household chemistry",
      points: [
        "LPG is mainly butane (with propane); ethyl mercaptan is added for smell",
        "Baking soda NaHCO₃ releases CO₂ on heating; baking powder = baking soda + tartaric acid",
        "Bee and ant stings are acidic (formic acid), so a mild base such as baking soda relieves them",
        "Milk turns to curd by Lactobacillus bacteria; vinegar is dilute acetic acid",
        "Green coating on copper: basic copper carbonate; black tarnish on silver: Ag₂S",
        "Non-stick coating: Teflon (PTFE); washing soda Na₂CO₃·10H₂O; bleaching powder CaOCl₂; plaster of Paris CaSO₄·½H₂O",
        "Pickles and jams last because salt or sugar draws water out of microbes by osmosis",
        "Soap forms micelles around grease; hard water's Ca²⁺ and Mg²⁺ form scum with soap",
        "Salt lowers the freezing point of water, so it clears ice on roads",
        "Never use water on electrical fires: water conducts; use a CO₂ or dry-powder extinguisher",
      ],
    },
    {
      heading: "Electricity bills",
      points: [
        "1 unit = 1 kWh; energy (kWh) = power (kW) × hours",
        "Cost = units × rate; e.g. 1,500 W for 2 h daily = 3 kWh a day",
        "Battery energy (Wh) = voltage × ampere-hours",
      ],
    },
    {
      heading: "Health and nutrition",
      points: [
        "Kwashiorkor: protein deficiency; marasmus: protein and calorie deficiency",
        "Goitre: iodine; anaemia: iron; fluorosis: excess fluoride in water",
        "Vitamin A night blindness, B1 beriberi, C scurvy, D rickets, K poor blood clotting",
      ],
    },
    {
      heading: "Inventions and discoveries",
      points: [
        "X-rays: Röntgen 1895; radioactivity: Becquerel 1896; electron: J. J. Thomson 1897; neutron: Chadwick 1932",
        "First powered flight: Wright brothers 1903; penicillin: Alexander Fleming 1928",
        "Rabies vaccine: Louis Pasteur 1885; smallpox vaccine: Edward Jenner 1796; oral polio vaccine: Albert Sabin",
        "Telephone: Graham Bell 1876; practical electric bulb: Edison 1879",
      ],
    },
  ],
  formulas: [
    "kWh = kW × hours; cost = kWh × rate",
    "Distance of lightning = 340 m/s × time gap",
    "NaHCO₃: baking soda; Na₂CO₃·10H₂O: washing soda; CaOCl₂: bleaching powder",
  ],
  traps: [
    "Forgetting to convert watts to kilowatts before finding units",
    "Saying LPG is mainly methane; methane is the main part of CNG",
    "Treating a mirage as reflection from water; it is refraction and total internal reflection in air",
    "Putting X-rays after radioactivity in chronological order; X-rays (1895) came first",
    "Using vinegar on a bee sting; an acid sting needs a mild base",
  ],
  examTips: [
    "SSC CGL, CHSL, MTS and RRB NTPC/Group D ask one or two everyday science questions per shift",
    "Chronological ordering and 'how many statements are correct' are common for discoveries",
    "Electricity bill sums appear in RRB papers; keep the kW × h × rate chain ready",
  ],
};

export default notes;

import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Cell",
      points: [
        "Cell is the basic unit of life; Robert Hooke named it (1665).",
        "Mitochondria: “powerhouse of the cell” (ATP by respiration). Ribosomes: protein synthesis. Lysosomes: “suicide bags”.",
        "Chloroplasts and cell wall (cellulose) are in plant cells, not animal cells. Golgi body packages and secretes.",
        "Mature mammalian red blood cells have no nucleus.",
      ],
    },
    {
      heading: "Organs and systems",
      points: [
        "Largest organ: skin. Largest gland: liver. Smallest bone: stapes (ear). Longest bone: femur.",
        "Digestion: starch begins in the mouth (salivary amylase); proteins in the stomach (pepsin) then small intestine (trypsin); bile from liver emulsifies fats.",
        "Heart has 4 chambers; pulmonary vein carries oxygenated blood from lungs to heart; pulmonary artery carries deoxygenated blood to lungs.",
        "Normal blood pressure about 120/80 mm Hg (systolic/diastolic).",
        "Brain: cerebrum – thinking and memory; cerebellum – balance and coordination; medulla – involuntary actions (breathing, heartbeat).",
        "Kidney (nephron is its unit) filters blood, regulates water and salts; it does not make bile.",
      ],
    },
    {
      heading: "Blood and immunity",
      points: [
        "RBCs carry oxygen (haemoglobin); WBCs fight infection; platelets help clotting.",
        "Blood groups (Landsteiner): O = universal donor, AB = universal recipient (ABO system).",
        "Vaccines give active immunity; ready-made antibodies give passive immunity.",
        "BCG – tuberculosis; Edward Jenner – smallpox vaccine; Louis Pasteur – rabies vaccine.",
      ],
    },
    {
      heading: "Vitamins and hormones",
      points: [
        "Vitamin A – night blindness; B1 – beriberi; B3 – pellagra; B12 – pernicious anaemia; C – scurvy; D – rickets; K – poor clotting.",
        "Fat-soluble: A, D, E, K. Water-soluble: B group and C. Vitamin D is made in the skin in sunlight.",
        "Insulin from beta cells (islets of Langerhans, pancreas) lowers blood sugar; glucagon (alpha cells) raises it.",
        "Thyroxine (thyroid) needs iodine — deficiency causes goitre. Adrenaline (adrenal medulla) for “fight or flight”.",
        "Pituitary is the “master gland”; growth hormone excess → gigantism.",
      ],
    },
    {
      heading: "Genetics basics",
      points: [
        "Mendel is the father of genetics (pea plants). Monohybrid F₂ ratio 3:1; dihybrid F₂ ratio 9:3:3:1.",
        "Humans: 46 chromosomes (23 pairs); males XY, females XX — father’s chromosome decides the child’s sex.",
        "Colour blindness and haemophilia are X-linked recessive: an affected father passes the gene to all daughters (carriers), none to sons.",
      ],
    },
  ],
  formulas: [
    "Dihybrid cross YyRr × YyRr → 9:3:3:1 (out of 16). Fraction for a class = its number ÷ 16 × total offspring.",
    "BP ≈ 120/80 mm Hg; normal body temperature ≈ 37 °C (98.6 °F).",
    "Vitamins: A-night blindness, C-scurvy, D-rickets, B1-beriberi, B12-pernicious anaemia, K-clotting.",
  ],
  traps: [
    "Pulmonary vein carries oxygenated blood — the classic exception to “veins carry deoxygenated blood”.",
    "Largest gland is the liver, not the pancreas; largest organ overall is the skin.",
    "O is the universal donor; AB is the universal recipient — not the reverse.",
    "Cerebellum (balance) vs cerebrum (thinking) — easily confused.",
    "Vitamin C is water-soluble, so it is not stored in the body.",
  ],
  examTips: [
    "SSC and Railways ask deficiency diseases, gland–hormone pairs, organ superlatives and blood groups.",
    "Harder papers add simple genetics ratios and statement questions on blood and immunity.",
  ],
};

export default notes;

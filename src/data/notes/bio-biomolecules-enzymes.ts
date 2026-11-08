import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Chemical analysis of tissue",
      points: [
        "Water is the most abundant chemical in living tissue.",
        "Acid-soluble pool: small molecules (below about 1000 Da). Acid-insoluble: proteins, nucleic acids, polysaccharides, plus lipids.",
        "Lipids are not true macromolecules; they appear in the insoluble fraction because membranes break into vesicles.",
        "Secondary metabolites: alkaloids (morphine, codeine), toxins (abrin, ricin), lectins (concanavalin A), drugs (vinblastine, curcumin), rubber, gums.",
      ],
    },
    {
      heading: "Amino acids and proteins",
      points: [
        "Amino acid: α-carbon carrying H, –NH₂, –COOH and an R group; 20 types in proteins.",
        "R group: glycine H, alanine –CH₃, serine –CH₂OH (hydroxymethyl).",
        "Zwitterion form depends on pH; acidic (glutamic acid), basic (lysine), aromatic (tyrosine, phenylalanine, tryptophan).",
        "Primary structure: sequence; left end = N-terminal, right end = C-terminal.",
        "Secondary: right-handed α-helix; tertiary: 3D folding; quaternary: subunits (haemoglobin 2α + 2β).",
        "Collagen: most abundant animal protein; RuBisCO: most abundant protein in the biosphere.",
        "Functions: antibody fights infection, receptor senses hormones/smell, GLUT-4 moves glucose into cells, collagen forms ground substance.",
      ],
    },
    {
      heading: "Carbohydrates and lipids",
      points: [
        "Ribose has 5 carbons, glucose 6; monosaccharides join by glycosidic bonds.",
        "Starch: helical, holds I₂ (blue). Cellulose: unbranched glucose polymer, no iodine colour. Glycogen: animal storage, branched.",
        "Inulin: fructose polymer. Chitin: N-acetylglucosamine polymer in arthropod exoskeleton and fungal walls.",
        "In a polysaccharide chain the right end is reducing, the left end non-reducing.",
        "Fatty acid: R–COOH; palmitic 16 C, arachidonic 20 C (both counts include the carboxyl carbon).",
        "Glycerol = trihydroxypropane; triglycerides are esters of glycerol and fatty acids. Lecithin is a phospholipid.",
      ],
    },
    {
      heading: "Nucleic acids",
      points: [
        "Nucleoside = base + sugar (adenosine, uridine). Nucleotide = nucleoside + phosphate (adenylic acid).",
        "Purines: adenine, guanine. Pyrimidines: cytosine, uracil, thymine.",
        "Base–sugar link: N-glycosidic bond; sugar–phosphate: phosphoester; between nucleotides: 3′–5′ phosphodiester.",
        "B-DNA: right-handed, 10 bp per turn, pitch 3.4 nm, rise 0.34 nm per bp; A=T (2 H-bonds), G≡C (3).",
      ],
    },
    {
      heading: "Enzymes",
      points: [
        "Almost all enzymes are proteins; ribozymes are catalytic RNA.",
        "Enzymes lower activation energy by stabilising the transition state; they do not change ΔG or equilibrium.",
        "Carbonic anhydrase speeds CO₂ + H₂O ⇌ H₂CO₃ about 10 million times.",
        "Rate rises with substrate until Vmax; Km = substrate concentration giving half Vmax.",
        "Optimum temperature and pH; low temperature inactivates reversibly, high temperature denatures.",
        "Competitive inhibitor resembles the substrate (malonate vs succinate on succinic dehydrogenase): Km rises, Vmax unchanged.",
        "Cofactors: prosthetic group tightly bound (haem in catalase, peroxidase), coenzyme loosely bound (NAD, NADP from niacin), metal ion (Zn²⁺ in carboxypeptidase).",
        "Apoenzyme (protein) + cofactor = holoenzyme; removing the cofactor kills activity.",
      ],
    },
  ],
  formulas: [
    "Carbon count: ribose 5 < glucose 6 < palmitic 16 < arachidonic 20",
    "EC classes: 1 oxidoreductases, 2 transferases, 3 hydrolases, 4 lyases, 5 isomerases, 6 ligases",
    "Hydrolases break ester, ether, peptide, glycosidic bonds with water; lyases remove groups leaving a double bond",
    "Ligases join two compounds forming C–O, C–S, C–N or P–O bonds",
    "Competitive inhibition: Km ↑, Vmax same",
  ],
  traps: [
    "Calling lipids macromolecules; NCERT says they are not.",
    "Mixing nucleoside (no phosphate) with nucleotide.",
    "Saying enzymes shift equilibrium; they only speed up reaching it.",
    "Thinking competitive inhibitors lower Vmax; they raise apparent Km only.",
    "Lyases vs hydrolases: lyases remove groups without water and leave a double bond.",
    "IUBMB added a seventh class (translocases) in 2018; NEET answers follow NCERT’s six.",
  ],
  examTips: [
    "NEET picks lines straight from NCERT Biomolecules: protein functions, carbon counts, enzyme classes, cofactors.",
    "Match-the-column and statement-count questions are the common formats.",
    "Learn the examples paired with each fact (malonate, haem, zinc, niacin); options are built around them.",
  ],
};

export default notes;

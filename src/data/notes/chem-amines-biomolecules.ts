import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Amines: basicity and preparation",
      points: [
        "Gas phase basicity: 3° > 2° > 1° > NH₃ (only +I effect).",
        "In water, +I, H-bonded solvation and steric effects compete: (C₂H₅)₂NH > (C₂H₅)₃N > C₂H₅NH₂ > NH₃, but (CH₃)₂NH > CH₃NH₂ > (CH₃)₃N.",
        "Aniline is much weaker: the N lone pair is delocalised into the ring; –NO₂ lowers basicity further, –CH₃ or –OCH₃ at para raises it; benzylamine behaves like an aliphatic amine.",
        "Nitro reduction with Fe/HCl is preferred (FeCl₂ formed regenerates HCl, so little acid is needed).",
        "Ammonolysis of alkyl halides gives a mixture; a large excess of NH₃ favours the 1° amine.",
        "Gabriel phthalimide synthesis gives only 1° aliphatic amines (aryl halides do not undergo SN).",
        "Hoffmann bromamide: RCONH₂ + Br₂ + 4NaOH → RNH₂ (one carbon less) + Na₂CO₃ + 2NaBr + 2H₂O.",
        "Nitrile reduction (LiAlH₄ or H₂/Ni) gives RCH₂NH₂, one carbon more than the alkyl halide used to make the nitrile.",
      ],
    },
    {
      heading: "Amine reactions and diazonium salts",
      points: [
        "Carbylamine test (CHCl₃ + alcoholic KOH → foul-smelling isocyanide): 1° amines only.",
        "Hinsberg (C₆H₅SO₂Cl): 1° sulphonamide dissolves in alkali, 2° does not, 3° does not react.",
        "HNO₂: 1° aliphatic amines give alcohol + N₂; aromatic 1° amines at 273–278 K give diazonium salts.",
        "Aniline + bromine water → white 2,4,6-tribromoaniline; acetylate first (to reduce activation) for monosubstitution.",
        "Nitration of aniline gives a lot of m-product (anilinium ion is meta-directing); aniline does not undergo Friedel–Crafts (forms a salt with AlCl₃).",
        "Diazonium replacements: CuCl/CuBr/CuCN (Sandmeyer), Cu + HX (Gattermann), KI → ArI, HBF₄ then heat → ArF, H₂O warm → phenol, H₃PO₂ or ethanol → ArH.",
        "Coupling: with phenol (alkaline) → orange p-hydroxyazobenzene; with aniline (mildly acidic) → yellow p-aminoazobenzene; with 2-naphthol → orange-red dye.",
      ],
    },
    {
      heading: "Carbohydrates",
      points: [
        "Glucose open chain: HI → n-hexane (straight chain), NH₂OH → oxime (C=O), Br₂ water → gluconic acid (–CHO), acetylation → pentaacetate (five –OH), HNO₃ → saccharic acid.",
        "Cyclic evidence: no Schiff's test or NaHSO₃ adduct; pentaacetate does not react with NH₂OH; α and β anomers differ at C1 and interconvert (mutarotation).",
        "Sucrose = α-glucose + β-fructose linked C1–C2, non-reducing; hydrolysis gives invert sugar (sign of rotation flips from + to −).",
        "Maltose = two α-glucose (C1–C4); lactose = β-galactose + β-glucose (C1–C4); both reducing.",
        "Starch = amylose (15–20%, unbranched, water-soluble) + amylopectin (80–85%, branched via C1–C6); cellulose = β-glucose chains; glycogen = highly branched animal starch.",
      ],
    },
    {
      heading: "Proteins, nucleic acids, vitamins",
      points: [
        "α-Amino acids exist as zwitterions; at the isoelectric point (pI) net charge is zero and there is no movement in an electric field.",
        "Structure: primary (sequence), secondary (α-helix, right-handed, H-bonds between C=O and N–H; β-pleated sheet), tertiary, quaternary.",
        "Denaturation (heat, pH) destroys secondary and tertiary structure but leaves the primary structure: boiled egg, curdled milk.",
        "Nucleoside = base + sugar; nucleotide = nucleoside + phosphate; units joined by 3′–5′ phosphodiester bonds.",
        "DNA: 2-deoxyribose, A=T (2 H-bonds), G≡C (3 H-bonds), double helix; RNA: ribose, uracil replaces thymine.",
        "Fat-soluble vitamins A, D, E, K are stored; B group and C are water-soluble (B₁₂ is the exception that is stored).",
        "Deficiencies: A night blindness, B₁ beriberi, B₂ cheilosis, B₆ convulsions, B₁₂ pernicious anaemia, C scurvy, D rickets, K delayed clotting.",
      ],
    },
    {
      heading: "Polymers",
      points: [
        "Addition: polythene, PVC, Teflon (CF₂=CF₂), polyacrylonitrile, Buna-S (butadiene + styrene), Buna-N (butadiene + acrylonitrile), neoprene (chloroprene).",
        "Condensation: nylon-6,6 (hexamethylenediamine + adipic acid), nylon-6 (caprolactam), Terylene (ethylene glycol + terephthalic acid), Bakelite (phenol + HCHO), melamine–HCHO.",
        "Biodegradable: PHBV (3-hydroxybutanoic + 3-hydroxypentanoic acid), nylon-2–nylon-6 (glycine + aminocaproic acid).",
      ],
    },
  ],
  formulas: [
    "Hoffmann bromamide uses 1 mol Br₂ and 4 mol NaOH per mol amide",
    "Glucose (180) → pentaacetate (390): mass gain = 5 × 42",
  ],
  traps: [
    "Tertiary methylamine is a weaker base in water than the 1° and 2° methylamines (poor solvation).",
    "Gabriel synthesis cannot make aniline.",
    "Sucrose is non-reducing because both anomeric carbons are tied up in the glycosidic bond.",
    "Aliphatic diazonium salts are unstable, so aliphatic amines do not give azo dyes.",
  ],
  examTips: [
    "JEE and NEET test basicity orders, distinguishing tests (carbylamine, Hinsberg, azo coupling) and diazonium conversions.",
    "Biomolecule questions are fact-based: glucose structure proofs, glycosidic links, vitamin deficiencies, base pairing; occasional pI and acetylation numericals.",
  ],
};

export default notes;

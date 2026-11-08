import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Preliminary tests",
      points: [
        "Flame: Na golden yellow, K lilac, Ca brick red, Sr crimson, Ba apple green, Cu green/blue-green.",
      ],
    },
    {
      heading: "Anions",
      points: [
        "Dil. H₂SO₄ group: CO₃²⁻ (CO₂, lime water milky), SO₃²⁻ (SO₂, also turns acidified K₂Cr₂O₇ green), S²⁻ (H₂S, lead acetate paper black), NO₂⁻ (brown fumes), CH₃COO⁻ (vinegar smell).",
        "Conc. H₂SO₄ group: Cl⁻ (HCl, white fumes with NH₃), Br⁻ (red-brown vapour), I⁻ (violet vapour), NO₃⁻ (brown fumes with Cu turnings).",
        "Chromyl chloride test for Cl⁻: K₂Cr₂O₇ + conc. H₂SO₄ gives orange-red CrO₂Cl₂, which in NaOH gives yellow chromate → yellow PbCrO₄ with lead acetate.",
        "Brown ring test for NO₃⁻: FeSO₄ + conc. H₂SO₄ gives [Fe(H₂O)₅NO]²⁺ at the junction.",
        "SO₄²⁻: white BaSO₄ insoluble in HCl; PO₄³⁻: yellow precipitate with ammonium molybdate.",
        "Silver halides: AgCl white, soluble in NH₃; AgBr pale yellow, sparingly soluble; AgI yellow, insoluble.",
      ],
    },
    {
      heading: "Cation groups",
      points: [
        "Group 0: NH₄⁺ — NH₃ on warming with NaOH; brown precipitate with Nessler's reagent (K₂HgI₄).",
        "Group I (dil. HCl): Pb²⁺, Ag⁺, Hg₂²⁺; PbCl₂ dissolves in hot water, so Pb²⁺ can also appear in group II.",
        "Group II (H₂S in dil. HCl): Hg²⁺, Pb²⁺, Cu²⁺, Bi³⁺, Cd²⁺ (IIA); As, Sb, Sn (IIB, soluble in yellow ammonium sulphide). CdS is yellow.",
        "Cu²⁺: deep blue with excess NH₃, chocolate-brown with K₄[Fe(CN)₆].",
        "Group III (NH₄OH + NH₄Cl): Fe³⁺ (red-brown hydroxide), Al³⁺ (white gelatinous), Cr³⁺ (green); Fe²⁺ is first oxidised with conc. HNO₃.",
        "Fe³⁺: Prussian blue with K₄[Fe(CN)₆], blood red with KSCN; Fe²⁺: dark blue (Turnbull's blue) with K₃[Fe(CN)₆].",
        "Group IV (H₂S in ammoniacal medium): ZnS white, MnS buff, NiS and CoS black; Ni²⁺ gives red with dimethylglyoxime, Co²⁺ gives blue with NH₄SCN in amyl alcohol.",
        "Group V ((NH₄)₂CO₃ with NH₄Cl): Ba²⁺ (yellow BaCrO₄), Sr²⁺ (white SrSO₄), Ca²⁺ (white calcium oxalate).",
        "Group VI: Mg²⁺ — white MgNH₄PO₄ with disodium hydrogen phosphate; Na⁺ and K⁺ by flame.",
        "Common-ion effect: H⁺ suppresses S²⁻ so only very low-Ksp group II sulphides precipitate; NH₄Cl suppresses OH⁻ so only group III hydroxides precipitate.",
      ],
    },
    {
      heading: "Organic analysis and purification",
      points: [
        "Lassaigne's (sodium fusion): N → NaCN → Prussian blue with FeSO₄/Fe³⁺; S → violet with sodium nitroprusside or black PbS; N + S → NaSCN → blood red with Fe³⁺.",
        "Nitrogen test needs both C and N (to form NaCN), so hydrazine fails; diazonium salts lose N₂ on heating and often fail too.",
        "Halogens: boil the extract with HNO₃ to destroy CN⁻ and S²⁻, then add AgNO₃.",
        "Kjeldahl's method fails for nitro, azo and ring nitrogen (pyridine).",
        "Sublimation: camphor, naphthalene, benzoic acid; steam distillation: steam-volatile, water-immiscible liquids such as aniline; reduced pressure: glycerol from spent lye.",
        "Chromatography: adsorption (TLC, column) or partition (paper); the less strongly adsorbed component has the higher Rf.",
      ],
    },
    {
      heading: "Titrations",
      points: [
        "Phenolphthalein (8.2–10) for weak acid vs strong base; methyl orange (3.1–4.4) for strong acid vs weak base; either works for strong–strong; no sharp end point for weak–weak.",
        "KMnO₄ is its own indicator (first permanent pink); acidify with dil. H₂SO₄, not HCl, because HCl is oxidised to Cl₂.",
        "Oxalic acid titrations with KMnO₄ are done warm (about 60–70 °C); Mn²⁺ formed catalyses the reaction (autocatalysis).",
      ],
    },
  ],
  formulas: [
    "Dumas: %N = (28 × V at STP in mL × 100)/(22400 × w)",
    "Kjeldahl: %N = (1.4 × M × V(acid used, mL) × basicity)/w, i.e. 1.4 × N × V/w",
    "Carius: %X = (atomic mass of X × mass of AgX × 100)/(molar mass of AgX × w)",
    "%S = (32 × mass of BaSO₄ × 100)/(233 × w)",
    "Rf = distance moved by spot / distance moved by solvent front (always ≤ 1)",
  ],
  traps: [
    "Both CO₂ and SO₂ turn lime water milky; only SO₂ turns dichromate paper green.",
    "Fe³⁺ gives Prussian blue with ferrocyanide; Fe²⁺ gives Turnbull's blue with ferricyanide — do not swap the reagents.",
    "NiS and CoS do not form in group II but, once formed in group IV, do not dissolve in dil. HCl.",
    "Correct moist gas volume for aqueous tension and convert to STP before using the Dumas formula.",
  ],
  examTips: [
    "JEE and NEET ask identification chains ('a green salt gives…'), group reagents and the reason behind each reagent.",
    "Numericals on Dumas, Kjeldahl and Carius estimation, plus indicator choice and KMnO₄ titration conditions, appear regularly.",
  ],
};

export default notes;

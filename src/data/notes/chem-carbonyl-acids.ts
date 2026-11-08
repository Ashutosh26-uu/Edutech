import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Preparation",
      points: [
        "Aldehydes: oxidise 1° alcohols with PCC; Rosenmund (RCOCl + H₂, Pd/BaSO₄); Stephen (RCN + SnCl₂/HCl, then hydrolysis); DIBAL-H on nitriles or esters.",
        "Benzaldehyde: Etard reaction (toluene + CrO₂Cl₂) or Gattermann–Koch (benzene + CO + HCl, AlCl₃/CuCl).",
        "Ketones: oxidise 2° alcohols; acyl chloride + dialkylcadmium; nitrile + Grignard then hydrolysis; Friedel–Crafts acylation.",
        "Carboxylic acids: oxidise 1° alcohols or aldehydes; hydrolyse nitriles; Grignard + dry ice (CO₂) then acid.",
        "Alkaline KMnO₄ oxidises any alkyl side chain with a benzylic H to –COOH (ethylbenzene → benzoic acid).",
      ],
    },
    {
      heading: "Nucleophilic addition",
      points: [
        "Reactivity: HCHO > other aldehydes > ketones; +I and steric bulk lower it; benzaldehyde is less reactive than propanal (resonance).",
        "HCN → cyanohydrin; NaHSO₃ → crystalline adduct (used to purify; bulky ketones fail).",
        "Grignard: HCHO → 1° alcohol, other aldehydes → 2°, ketones → 3°.",
        "Alcohols give hemiacetal then acetal; ethylene glycol forms cyclic ketals (protecting group).",
        "Ammonia derivatives: NH₂OH → oxime, NH₂NH₂ → hydrazone, 2,4-DNP → orange-red 2,4-DNP derivative; unsymmetrical carbonyls give E/Z oximes.",
        "–CHO and –CO– are meta-directing and deactivating: nitration of benzaldehyde gives m-nitrobenzaldehyde.",
      ],
    },
    {
      heading: "Named reactions and tests",
      points: [
        "Aldol: compounds with α-H in dilute alkali → β-hydroxy carbonyl → α,β-unsaturated carbonyl on heating.",
        "Cannizzaro: no α-H, concentrated alkali, disproportionation to alcohol + carboxylate; in crossed Cannizzaro HCHO is oxidised to formate.",
        "Clemmensen (Zn–Hg/conc. HCl) and Wolff–Kishner (NH₂NH₂, KOH/glycol) reduce C=O to CH₂; NaBH₄/LiAlH₄ give alcohols.",
        "Tollens' (silver mirror) for all aldehydes; Fehling's/Benedict's (red Cu₂O) for aliphatic aldehydes only.",
        "Haloform: CH₃CO– or CH₃CH(OH)– with NaOX gives CHX₃ (yellow CHI₃ for iodoform) + carboxylate with one carbon less.",
        "α-Hydrogens are acidic because the enolate is resonance-stabilised.",
      ],
    },
    {
      heading: "Carboxylic acids",
      points: [
        "Higher boiling than comparable alcohols: they form H-bonded dimers.",
        "Stronger than phenols: carboxylate charge is shared equally by two O atoms; acids liberate CO₂ from NaHCO₃, phenols do not.",
        "Electron-withdrawing groups raise acidity: F > Cl > Br > I, and the nearer to –COOH the stronger; CF₃COOH is very strong.",
        "Order: HCOOH (pKa 3.75) > C₆H₅COOH (4.19) > CH₃COOH (4.76).",
        "Derivatives: PCl₅ or SOCl₂ → acyl chloride; NH₃ then heat → amide; P₂O₅ → anhydride; ROH/H⁺ → ester.",
        "Esterification rate falls with steric bulk: HCOOH > CH₃COOH > (CH₃)₂CHCOOH > (CH₃)₃CCOOH.",
        "LiAlH₄ reduces –COOH to –CH₂OH; B₂H₆ does it selectively without touching esters.",
        "HVZ (X₂ + red P) gives α-halo acids; soda-lime decarboxylation gives an alkane with one carbon less; Kolbe electrolysis gives R–R.",
        "Benzoic acid does not undergo Friedel–Crafts reactions (ring deactivated, –COOH binds AlCl₃).",
      ],
    },
  ],
  formulas: [
    "Aldehyde reactivity: HCHO > CH₃CHO > CH₃COCH₃",
    "2RCOONa (electrolysis) → R–R + 2CO₂ (at anode)",
    "RCOONa + NaOH (CaO, heat) → RH + Na₂CO₃",
    "RCHO + 2[Ag(NH₃)₂]⁺ → RCOO⁻ + 2Ag (1 mol aldehyde gives 2 mol Ag; HCHO gives 4)",
  ],
  traps: [
    "Aromatic aldehydes give Tollens' but not Fehling's test.",
    "Iodoform needs CH₃CO– or CH₃CH(OH)–: ethanol and ethanal give it, methanol and propanal do not.",
    "Cannizzaro needs no α-H; a compound with α-H goes the aldol route instead.",
    "Formic acid reduces Tollens' reagent because it contains an aldehyde-like H–C=O.",
    "Ketones like propanone are not oxidised by Tollens' — count only the aldehyde in silver-mass problems.",
  ],
  examTips: [
    "JEE and NEET love reagent-to-product chains with named reactions and distinguishing tests between pairs.",
    "Acidity and reactivity orders, and statement-count items on carboxylic acid properties, are standard.",
    "Expect small stoichiometry problems (silver deposited, moles of reagent) and mechanism ideas like ¹⁸O labelling in ester hydrolysis.",
  ],
};

export default notes;

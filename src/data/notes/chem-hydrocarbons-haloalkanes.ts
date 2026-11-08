import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Alkanes, alkenes and alkynes",
      points: [
        "Free-radical halogenation of alkanes: chain mechanism (initiation, propagation, termination); Br₂ is far more selective for 3° H than Cl₂.",
        "Wurtz reaction (R–X + Na, dry ether) doubles the chain; Kolbe electrolysis of RCOONa gives R–R.",
        "Electrophilic addition to alkenes goes through the more stable carbocation (Markovnikov); rearrangements (hydride/methyl shift) are possible.",
        "HBr with peroxide adds anti-Markovnikov by a radical path; HCl and HI do not show the peroxide effect.",
        "Hydroboration–oxidation gives anti-Markovnikov, syn addition with no rearrangement.",
        "Buta-1,3-diene + HBr: low temperature favours 1,2-adduct (kinetic), higher temperature favours 1,4-adduct (thermodynamic).",
        "Alkyne reduction: H₂/Lindlar gives cis-alkene; Na in liquid NH₃ gives trans-alkene.",
        "Terminal alkynes are weakly acidic: give a white precipitate with ammoniacal AgNO₃ and red with ammoniacal Cu₂Cl₂; internal alkynes do not.",
        "Alkyne + H₂O (HgSO₄/H₂SO₄) gives a ketone (ethyne gives ethanal); hydroboration of terminal alkyne gives an aldehyde.",
      ],
    },
    {
      heading: "Aromatic compounds",
      points: [
        "Aromatic: cyclic, planar, fully conjugated, with (4n + 2) π electrons (Hückel rule).",
        "Electrophilic substitution: nitration (HNO₃/H₂SO₄, NO₂⁺), sulphonation, halogenation (X₂/FeX₃), Friedel–Crafts alkylation and acylation (AlCl₃).",
        "Friedel–Crafts fails on strongly deactivated rings such as nitrobenzene; acylation stops at one substitution, alkylation can over-alkylate.",
        "Nucleophilic aromatic substitution is easy only with –NO₂ groups ortho/para to the halogen.",
      ],
    },
    {
      heading: "Haloalkanes and haloarenes",
      points: [
        "SN2: one step, backside attack, inversion, rate = k[RX][Nu⁻]; favoured by 1° substrates and polar aprotic solvents (DMSO, acetone).",
        "SN1: carbocation intermediate, racemisation, rate = k[RX]; favoured by 3°, allylic, benzylic substrates in polar protic solvents.",
        "Leaving-group ability: I⁻ > Br⁻ > Cl⁻ > F⁻; reactivity R–I > R–Br > R–Cl.",
        "Aryl halides resist substitution: partial C=X double-bond character from resonance and sp² carbon.",
        "Chloroform slowly forms poisonous phosgene in air and light, so it is stored in dark, full bottles.",
      ],
    },
    {
      heading: "Alcohols, phenols and ethers",
      points: [
        "Acidity: phenol > water > ethanol > tert-butanol; phenoxide is resonance stabilised.",
        "Dehydration with conc. H₂SO₄ gives the more substituted (Saytzeff) alkene; ease 3° > 2° > 1°.",
        "Grignard reagent + compound with active H (water, alcohol) gives alkane: 1 mol ROH releases 1 mol CH₄ with CH₃MgBr.",
        "Ester + excess RMgX gives a 3° alcohol (two R groups added).",
        "Williamson synthesis: alkoxide + 1° halide; for tert-butyl methyl ether use (CH₃)₃CO⁻Na⁺ + CH₃Br, since 3° halides eliminate.",
        "Ethers are cleaved by hot conc. HI; with methyl 1°/2° alkyl ethers the methyl becomes CH₃I (SN2), but a tert-butyl group becomes the iodide (SN1).",
      ],
    },
  ],
  formulas: [
    "Ortho/para directors: –OH, –NH₂, –OCH₃, –CH₃, –X (halogens deactivate); meta directors: –NO₂, –CN, –CHO, –COOH, –SO₃H",
    "SN2 order: CH₃X > 1° > 2° > 3°; SN1 order: 3° > 2° > 1° > CH₃X",
    "Aqueous KOH → substitution (alcohol); alcoholic KOH → elimination (alkene)",
    "Lucas test (ZnCl₂/HCl): 3° immediate turbidity, 2° in about 5 min, 1° none at room temperature",
    "Reimer–Tiemann: phenol + CHCl₃/NaOH → salicylaldehyde; Kolbe: phenoxide + CO₂ → salicylic acid",
    "Phenol + bromine water → 2,4,6-tribromophenol (white ppt); in CS₂ at low temperature → mono-bromophenols",
  ],
  traps: [
    "Applying the peroxide effect to HCl or HI.",
    "Missing a carbocation rearrangement (e.g. 3,3-dimethylbut-1-ene with acid gives a methyl-shifted product).",
    "Using a 3° halide in Williamson synthesis; it gives an alkene, not an ether.",
    "Thinking halogens are meta directors because they deactivate the ring.",
    "Counting monochloro products without checking for equivalent hydrogens by symmetry.",
  ],
  examTips: [
    "NEET loves named reactions and test-based identification (Lucas, ammoniacal AgNO₃, bromine water).",
    "JEE Main gives multi-step conversions and asks for the major product, usually testing Markovnikov vs anti-Markovnikov or SN1 vs SN2.",
    "Statement-count questions mix facts on ethers, chloroform and phenol acidity; read each statement fully.",
  ],
};

export default notes;

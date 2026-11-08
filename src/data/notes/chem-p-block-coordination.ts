import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "p-Block (groups 15–18)",
      points: [
        "Group 15 hydrides NH₃ → BiH₃: bond angle, basicity and thermal stability fall; reducing power rises.",
        "Basicity of P oxoacids = number of P–OH groups: H₃PO₂ (1), H₃PO₃ (2), H₃PO₄ (3); P–H bonds make H₃PO₂ and H₃PO₃ reducing.",
        "NO₂ is the brown gas (dimerises to colourless N₂O₄); N₂O is laughing gas; NO is paramagnetic.",
        "H₂S₂O₈ (peroxodisulphuric acid) has an O–O bridge, so S is +6, not +7.",
        "Ozone oxidises KI to I₂ (O₃ + 2KI + H₂O → 2KOH + I₂ + O₂); used to estimate O₃.",
        "HF has the highest boiling point among hydrogen halides due to hydrogen bonding, but it is the weakest acid in water.",
        "Interhalogens: ClF₃ T-shaped, BrF₅ square pyramidal, IF₇ pentagonal bipyramidal.",
        "Xenon fluorides: XeF₂ linear (3 lone pairs), XeF₄ square planar (2), XeF₆ distorted octahedral (1), XeO₃ pyramidal.",
      ],
    },
    {
      heading: "d- and f-Block",
      points: [
        "Transition metals: variable oxidation states, coloured ions, paramagnetism, catalytic activity, complex formation.",
        "Colour needs unpaired d electrons for d–d transitions: Sc³⁺, Ti⁴⁺, Zn²⁺, Cu⁺ (d⁰ or d¹⁰) are colourless.",
        "Mn shows the widest range, +2 to +7; KMnO₄ is purple, K₂Cr₂O₇ orange.",
        "KMnO₄ electrons gained: 5 in acid (→ Mn²⁺), 3 in neutral/weakly basic (→ MnO₂), 1 in strongly alkaline (→ MnO₄²⁻).",
        "Lanthanoid contraction: steady size decrease from La to Lu due to poor 4f shielding; makes Zr and Hf almost the same size.",
        "Lanthanoids mostly show +3; Ce⁴⁺ is a good oxidant, Eu²⁺ and Yb²⁺ act as reductants.",
      ],
    },
    {
      heading: "Coordination compounds",
      points: [
        "Naming: cations first; ligands alphabetically before the metal; anionic complex ends in -ate (ferrate, cuprate); oxidation state in Roman numerals.",
        "K₃[Fe(CN)₆] is potassium hexacyanidoferrate(III); K₄[Fe(CN)₆] is the iron(II) analogue with EAN 36.",
        "Chelating ligands bind through two or more donor atoms (en, oxalate, EDTA⁴⁻ is hexadentate); chelates are extra stable.",
        "Ionisation isomers swap a ligand with a counter-ion; only ions outside the bracket react with AgNO₃.",
        "Linkage isomers come from ambidentate ligands: NO₂⁻/ONO⁻, SCN⁻/NCS⁻.",
        "[Co(en)₂Cl₂]⁺: trans (achiral) + cis (pair of enantiomers) = 3 stereoisomers; [Co(en)(NH₃)₂Cl₂]⁺ has 4 (one is a chiral pair).",
        "VBT: inner-orbital d²sp³ (low spin) vs outer-orbital sp³d² (high spin); dsp² is square planar, sp³ tetrahedral.",
        "Strong-field ligands pair electrons: [Fe(CN)₆]³⁻ has 1 unpaired e⁻, [Fe(H₂O)₆]³⁺ has 5; [Fe(CN)₆]⁴⁻ and [Ni(CN)₄]²⁻ are diamagnetic.",
      ],
    },
  ],
  formulas: [
    "Spin-only μ = √(n(n + 2)) BM: n = 1, 2, 3, 4, 5 → 1.73, 2.83, 3.87, 4.90, 5.92",
    "Spectrochemical series: I⁻ < Br⁻ < Cl⁻ < F⁻ < OH⁻ < H₂O < NH₃ < en < CN⁻ < CO",
    "CFSE (octahedral) = (−0.4 n(t₂g) + 0.6 n(e_g)) Δ₀ (+ pairing energy terms); Δt ≈ (4/9) Δ₀",
    "EAN = Z − oxidation state + 2 × (number of donor pairs)",
    "Equivalent mass of KMnO₄ (M = 158): 158/5 acid, 158/3 neutral, 158/1 strongly alkaline",
    "[Ma₂b₂] square planar: 2 geometrical isomers; [Ma₄b₂] octahedral: 2 (cis, trans); [Ma₃b₃]: 2 (fac, mer)",
  ],
  traps: [
    "Assigning S in H₂S₂O₈ a +7 state by ignoring the peroxide link.",
    "Counting all H atoms in H₃PO₃ as acidic; only the O–H hydrogens ionise.",
    "Forgetting that tetrahedral complexes are almost always high spin (Δt is small).",
    "Missing the optical pair of the cis isomer when counting stereoisomers.",
    "Using the KMnO₄ acid-medium n-factor (5) for a neutral-medium question.",
  ],
  examTips: [
    "JEE Main and NEET reliably ask magnetic moment, hybridisation and isomer counting in complexes.",
    "Shapes of xenon and interhalogen compounds, and the number of lone pairs on the central atom, are frequent one-liners.",
    "Redox titration numericals with KMnO₄ or K₂Cr₂O₇ need the correct n-factor for the given medium.",
  ],
};

export default notes;

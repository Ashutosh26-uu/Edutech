import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Ionic and covalent bonds",
      points: [
        "Ionic bond favoured by low IE of metal, high negative electron gain enthalpy of non-metal and high lattice enthalpy.",
        "Octet exceptions: incomplete (BF₃, BeCl₂), expanded (PCl₅, SF₆, IF₇), odd-electron (NO, NO₂).",
        "Fajans' rules: small, highly charged cation and large anion → more covalent (AlCl₃ > MgCl₂ > NaCl; LiI most covalent alkali halide).",
        "Pseudo-noble-gas (18-electron) cations like Cu⁺, Ag⁺ polarise more than same-size noble-gas cations.",
        "Resonance: real structure is a hybrid; CO₃²⁻ C–O bond order 4/3, O₃ bond order 1.5.",
        "σ bond (head-on overlap) is stronger than π (sideways); first bond between two atoms is always σ.",
      ],
    },
    {
      heading: "VSEPR and hybridisation",
      points: [
        "Repulsion order: lp–lp > lp–bp > bp–bp; lone pairs shrink angles: CH₄ 109.5° > NH₃ 107° > H₂O 104.5°.",
        "2, 3, 4, 5, 6, 7 electron pairs → sp, sp², sp³, sp³d, sp³d², sp³d³.",
        "In trigonal bipyramid, lone pairs and less electronegative atoms go equatorial; axial bonds are longer (PCl₅).",
        "Shapes: SF₄ see-saw, ClF₃ T-shape, XeF₂ and I₃⁻ linear, XeF₄ square planar, BrF₅ and XeOF₄ square pyramidal, XeF₆ distorted octahedral (1 lone pair).",
        "More electronegative substituents narrow the angle: NF₃ (102°) < NH₃ (107°); PH₃ (93.5°) is smaller still as P hybridises poorly.",
        "Back-bonding: Lewis acidity BF₃ < BCl₃ < BBr₃ because B–F pπ–pπ back-donation is strongest.",
      ],
    },
    {
      heading: "Molecular orbital theory",
      points: [
        "Up to 14 electrons (N₂): σ1s σ*1s σ2s σ*2s (π2pₓ = π2p_y) σ2p_z …; from O₂ on σ2p_z lies below the π orbitals.",
        "Bond order 0 means the species does not exist: He₂, Be₂, Ne₂.",
        "Bond order 3: N₂, CO, CN⁻, NO⁺, C₂²⁻ (all 14 electrons).",
        "Paramagnetic: B₂, O₂, O₂⁺, O₂⁻, N₂⁺, N₂⁻, NO; diamagnetic: C₂, N₂, O₂²⁻, F₂, CO.",
        "Higher bond order → higher bond energy and shorter bond length.",
      ],
    },
    {
      heading: "Polarity and hydrogen bonding",
      points: [
        "μ = q × d, unit debye (1 D = 3.336 × 10⁻³⁰ C m); symmetric molecules have μ = 0: CO₂, BF₃, CCl₄, PCl₅, XeF₄, SF₆.",
        "NH₃ (1.47 D) > NF₃ (0.23 D): in NH₃ lone-pair and bond moments add, in NF₃ they oppose.",
        "CH₃Cl > CH₂Cl₂ > CHCl₃ > CCl₄ (0); cis isomer polar, trans often zero.",
        "Intermolecular H-bond raises boiling point (H₂O > HF > NH₃); intramolecular H-bond (o-nitrophenol) lowers it and makes it steam-volatile.",
      ],
    },
  ],
  formulas: [
    "Formal charge = valence electrons − lone-pair electrons − ½ (bonding electrons).",
    "Hybridisation number = ½ (V + M − C + A): V valence e⁻ of central atom, M monovalent atoms, C cation charge, A anion charge.",
    "Bond order = (N_b − N_a)/2; O₂ 2, O₂⁺ 2.5, O₂⁻ 1.5, O₂²⁻ 1, N₂⁺ = N₂⁻ = 2.5, NO 2.5.",
    "% ionic character = (μ observed ÷ μ fully ionic) × 100.",
  ],
  traps: [
    "Shape ignores lone pairs, geometry includes them: H₂O has tetrahedral electron geometry but bent shape.",
    "The σ/π order switch happens after N₂; use the correct diagram for B₂, C₂, N₂.",
    "BF₃ is the weakest Lewis acid among boron trihalides despite F being most electronegative.",
    "N₂⁺ and N₂⁻ have equal bond order, but N₂⁺ is slightly more stable (fewer antibonding electrons).",
    "Zero dipole needs symmetric shape, not just identical atoms: PCl₃F₂ with F axial is zero, SF₄ is not.",
  ],
  examTips: [
    "JEE and NEET ask shapes of xenon compounds and interhalogens almost every year.",
    "MOT bond order, magnetism and stability order of O₂/N₂ ions are favourites.",
    "Dipole-moment and Fajans' rule ordering questions appear as single-mark items.",
  ],
};

export default notes;

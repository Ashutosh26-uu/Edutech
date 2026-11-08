import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "IUPAC nomenclature",
      points: [
        "Pick the longest chain containing the principal functional group and the maximum number of multiple bonds.",
        "Number to give the principal group the lowest locant, then multiple bonds, then substituents (first point of difference).",
        "Substituent prefixes go in alphabetical order; di/tri/tetra are ignored while alphabetising.",
        "Carbon of –CHO, –COOH and –CN at the chain end is C-1 and is counted in the chain name.",
        "When –COOH is the principal group, a –CN becomes the prefix 'cyano'; e.g. HOOC–CH₂–CH(CN)–CH₂–COOH is 3-cyanopentanedioic acid.",
      ],
    },
    {
      heading: "Isomerism",
      points: [
        "Structural: chain, position, functional, metamerism (different alkyl groups on either side of O, S, NH, C=O) and tautomerism (keto–enol).",
        "Geometrical (cis–trans) needs restricted rotation and two different groups on each doubly bonded carbon; also seen in rings.",
        "E/Z: rank groups on each carbon by CIP priority (higher atomic number first); higher-priority groups on the same side = Z.",
        "A molecule is chiral if it is non-superimposable on its mirror image; a stereocentre with four different groups usually causes this.",
        "Meso compound: has stereocentres but an internal mirror plane, so it is optically inactive (e.g. meso-tartaric acid).",
        "Count stereoisomers by listing each stereocentre and C=C unit, using 2ⁿ, then subtracting duplicates from symmetry.",
      ],
    },
    {
      heading: "Electronic effects",
      points: [
        "Inductive effect: permanent σ-bond polarisation that fades quickly with distance; alkyl groups are +I.",
        "Resonance (mesomeric): delocalisation of π or lone-pair electrons; +R groups –OH, –OR, –NH₂, halogens; −R groups –NO₂, –CN, –CHO, –COOH.",
        "Hyperconjugation: σ(C–H) overlap with an adjacent empty p orbital or π bond; more α-H means more stabilisation.",
        "Electromeric effect: temporary, complete transfer of π electrons, only while an attacking reagent is present.",
        "Order of dominance usually: resonance > hyperconjugation > inductive (halogens are the exception: −I beats +R).",
      ],
    },
    {
      heading: "Intermediates and reagents",
      points: [
        "Homolysis gives free radicals; heterolysis gives a carbocation and a carbanion.",
        "Carbocation and free radical: sp², planar; stability 3° > 2° > 1° > methyl, boosted by allyl/benzyl resonance.",
        "Carbanion: sp³, pyramidal (like NH₃); stabilised by −I/−R groups, so stability order is methyl > 1° > 2° > 3°.",
        "Electrophiles are electron-poor (H⁺, NO₂⁺, BF₃, AlCl₃, carbocations); nucleophiles are electron-rich (OH⁻, CN⁻, NH₃, H₂O).",
        "Acidity rises with stability of the conjugate base: EWG increases acidity, EDG decreases it; sp C–H is more acidic than sp² or sp³.",
      ],
    },
  ],
  formulas: [
    "Functional group priority: COOH > SO₃H > ester > acid halide > amide > CN > CHO > C=O > OH > NH₂ > C=C > C≡C",
    "−I order: NR₃⁺ > NO₂ > CN > COOH > F > Cl > Br > I (alkyl groups are +I)",
    "Acidity: HC≡CH > NH₃ > CH₂=CH₂ > CH₃–CH₃; H₂O > ROH > HC≡CH",
    "Phenols: p-nitrophenol > phenol > p-cresol; carboxylic acids: Cl₃CCOOH > Cl₂CHCOOH > ClCH₂COOH > CH₃COOH",
    "Hybridisation: count σ bonds + lone pairs; C=C carbon sp², C≡C carbon sp, –CHO carbon sp²",
    "Max stereoisomers = 2ⁿ (n = stereogenic units); butane-2,3-diol and tartaric acid have 3 (one meso)",
  ],
  traps: [
    "Numbering for the substituent instead of the principal functional group.",
    "Calling every molecule with two stereocentres a set of four isomers; check for a meso form first.",
    "Treating a CH₂= carbon or a carbon with two identical groups as able to show cis–trans isomerism.",
    "Using the carbocation stability order for carbanions; it is reversed.",
    "Forgetting that ortho effect makes o-substituted benzoic acids stronger than expected.",
  ],
  examTips: [
    "NEET and JEE Main favour 'arrange in order' questions on acidity, basicity and intermediate stability.",
    "Counting questions (number of stereoisomers, sp² carbons, molecules with zero dipole) are common in JEE Main numericals.",
    "Expect one or two IUPAC naming questions with mixed functional groups or a cyano/oxo prefix.",
  ],
};

export default notes;

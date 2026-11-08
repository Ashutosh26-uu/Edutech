import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Photosynthesis",
      points: [
        "Light reaction in grana (thylakoids); dark reaction (Calvin cycle) in stroma.",
        "PS II reaction centre P680, PS I P700; water splits at PS II (Mn, Ca, Cl needed), releasing O₂.",
        "Non-cyclic photophosphorylation (Z-scheme) gives ATP, NADPH and O₂; cyclic uses only PS I in stroma lamellae and gives only ATP.",
        "Chemiosmosis: H⁺ builds up in the lumen; ATP synthase (CF₀–CF₁) makes ATP as H⁺ flows to the stroma.",
        "Calvin cycle: CO₂ acceptor RuBP (5C), enzyme RuBisCO, first stable product 3-PGA; 6 turns make one glucose.",
        "C4 (Hatch–Slack): PEP acceptor in mesophyll, first product OAA (4C); Kranz anatomy; C4 acid releases CO₂ in bundle sheath, pyruvate returns.",
        "Photorespiration (C3 only): RuBisCO binds O₂, uses chloroplast, peroxisome, mitochondria; no ATP or sugar gained.",
        "Blackman's law of limiting factors: rate depends on the factor nearest its minimum value.",
      ],
    },
    {
      heading: "Respiration",
      points: [
        "Glycolysis (EMP) in cytoplasm: glucose → 2 pyruvate, net 2 ATP + 2 NADH.",
        "Link reaction in matrix: pyruvate → acetyl CoA by pyruvate dehydrogenase, 1 NADH + 1 CO₂ each.",
        "Krebs cycle per acetyl CoA: 3 NADH, 1 FADH₂, 1 GTP, 2 CO₂; starts with citrate (6C) from OAA + acetyl CoA.",
        "ETS on inner mitochondrial membrane: complex I (NADH), II (FADH₂), cytochrome c mobile carrier, IV (cyt a–a₃) passes e⁻ to O₂, V is ATP synthase.",
        "Anaerobic: yeast makes ethanol + CO₂; muscle makes lactic acid; both give only 2 ATP.",
      ],
    },
    {
      heading: "Water and mineral transport",
      points: [
        "Water potential of pure water = 0; solutes make Ψs negative; water moves from higher to lower Ψw.",
        "Apoplast: through walls; symplast: through plasmodesmata; Casparian strip (suberin) in endodermis forces water into the symplast.",
        "Ascent of sap: cohesion–tension–transpiration pull; root pressure shows as guttation through hydathodes.",
        "Stomata open when K⁺ enters guard cells and water follows; ABA closes them.",
        "Phloem translocation by pressure-flow (mass flow) hypothesis, mainly as sucrose, source to sink.",
        "17 essential elements; macro: C, H, O, N, P, K, S, Ca, Mg; micro: Fe, Mn, Cu, Mo, Zn, B, Cl, Ni.",
        "Mobile N, P, K, Mg show deficiency in old leaves; immobile Ca and S in young leaves; Mn toxicity induces Fe, Mg, Ca deficiency.",
      ],
    },
    {
      heading: "Nitrogen fixation and growth regulators",
      points: [
        "Nitrogenase (Mo–Fe protein) works only without O₂; leghaemoglobin (pink) in root nodules mops up O₂.",
        "NH₃ enters amino acids by reductive amination (glutamate) and transamination.",
        "Auxin (IAA, NAA, 2,4-D): apical dominance, rooting of cuttings, parthenocarpy, weed killer (2,4-D on dicots).",
        "Gibberellin (GA₃): bolting in cabbage and beet, longer sugarcane stems, malting, fruit elongation.",
        "Cytokinin (kinetin, zeatin): cell division, delays senescence (Richmond–Lang), breaks apical dominance.",
        "Ethylene (gas): fruit ripening, abscission, root hair growth; ABA: dormancy, stomatal closure, stress hormone.",
      ],
    },
  ],
  formulas: [
    "6CO₂ + 12H₂O → C₆H₁₂O₆ + 6O₂ + 6H₂O; per glucose Calvin needs 18 ATP + 12 NADPH (per CO₂: 3 ATP + 2 NADPH).",
    "Aerobic respiration per glucose: 10 NADH, 2 FADH₂, 6 CO₂; NCERT net = 38 ATP (NADH = 3, FADH₂ = 2).",
    "RQ = CO₂ evolved / O₂ consumed: carbohydrate 1, fat ≈ 0.7 (tripalmitin 0.7), protein ≈ 0.9, organic acids > 1, anaerobic = ∞.",
    "Ψw = Ψs + Ψp; flaccid cell Ψp = 0, fully turgid cell Ψw = 0.",
    "N₂ + 8e⁻ + 8H⁺ + 16 ATP → 2NH₃ + H₂ + 16 ADP + 16 Pi.",
  ],
  traps: [
    "O₂ in photosynthesis comes from water, not CO₂.",
    "C4 plants still use the Calvin cycle and RuBisCO, but only in bundle-sheath cells.",
    "Glycolysis yields 4 ATP gross but 2 net; exams ask both.",
    "Cytokinin, not auxin, delays leaf senescence; auxin causes apical dominance, cytokinin overcomes it.",
    "Ca deficiency appears in young leaves because Ca is immobile; N, K, Mg in older leaves.",
  ],
  examTips: [
    "NEET tests ATP/NADPH counts, enzyme locations and the first stable product of each pathway.",
    "Statement-counting on ETS complexes, mineral deficiency and PGR functions is frequent.",
    "Match the hormone with its effect or a commercial use (malting, ripening, weedicide) appears almost every year.",
  ],
};

export default notes;

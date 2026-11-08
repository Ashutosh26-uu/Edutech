import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Cell theory and membrane",
      points: [
        "Schleiden (1838, plants) and Schwann (1839, animals) proposed the cell theory.",
        "Virchow (1855): new cells arise from pre-existing cells (omnis cellula e cellula).",
        "Fluid mosaic model: Singer and Nicolson, 1972; quasi-fluid lipid bilayer with proteins.",
        "Human RBC membrane: about 52% protein, 40% lipid; proteins are peripheral or integral.",
      ],
    },
    {
      heading: "Prokaryotic cell",
      points: [
        "No nuclear envelope and no membrane-bound organelles; DNA is naked, circular (nucleoid).",
        "Plasmids: small extra-chromosomal DNA, often carry antibiotic resistance.",
        "Mesosome: infolding of plasma membrane; helps wall formation, DNA replication, respiration.",
        "Ribosomes 70S (50S + 30S); polysome = many ribosomes on one mRNA.",
        "Gas vacuoles occur in blue-green algae and purple and green photosynthetic bacteria.",
      ],
    },
    {
      heading: "Eukaryotic organelles",
      points: [
        "Endomembrane system: ER, Golgi, lysosomes, vacuoles (not mitochondria, chloroplasts, peroxisomes).",
        "RER makes proteins; SER makes lipids and steroids.",
        "Golgi: stacked cisternae (0.5–1.0 μm), cis (forming) and trans (maturing) faces; packages and glycosylates.",
        "Lysosomes: acid hydrolases active at low pH. Vacuole membrane is the tonoplast.",
        "Mitochondria: double membrane, cristae, matrix with circular DNA and 70S ribosomes; divide by fission.",
        "Chloroplast stroma also has 70S ribosomes and circular DNA; cytoplasmic ribosomes are 80S (60S + 40S).",
        "Centrosome: two centrioles at right angles, each 9 + 0 triplets; cilia and flagella axoneme 9 + 2.",
        "Nucleolus: site of rRNA synthesis, not membrane-bound.",
      ],
    },
    {
      heading: "Chromosomes",
      points: [
        "By centromere position: metacentric (middle), sub-metacentric (slightly off), acrocentric (near end), telocentric (at end).",
        "Satellite: small fragment beyond a non-staining secondary constriction.",
        "Kinetochores are disc-shaped structures on the centromere where spindle fibres attach.",
      ],
    },
    {
      heading: "Cell cycle and mitosis",
      points: [
        "Interphase (G₁, S, G₂) takes over 95% of the cycle; human cell ≈ 24 h, M phase ≈ 1 h.",
        "S phase: DNA doubles (2C → 4C), chromosome number unchanged. G₀: quiescent, non-dividing.",
        "Prophase: chromatin condenses, centrosomes move to poles.",
        "Metaphase: chromosomes on the equatorial plate; best stage to study morphology.",
        "Anaphase: centromeres split, sister chromatids move to opposite poles.",
        "Telophase: nuclear envelope, nucleolus, Golgi and ER reform.",
        "Cytokinesis: furrow in animal cells; cell plate (centre outward) in plant cells.",
      ],
    },
    {
      heading: "Meiosis",
      points: [
        "Meiosis I is reductional: homologues separate at anaphase I. Meiosis II is equational, like mitosis.",
        "Prophase I: leptotene, zygotene (synapsis, synaptonemal complex), pachytene (crossing over, recombination nodules), diplotene (chiasmata), diakinesis (terminalisation).",
        "Diplotene can last months or years in oocytes of some vertebrates.",
        "Significance: halves chromosome number, creates variation through crossing over and independent assortment.",
      ],
    },
  ],
  formulas: [
    "Mitotic anaphase: 4n chromosomes in the cell (2n = 20 ⇒ 40)",
    "Anaphase I: 2n chromosomes in the cell (2n = 20 ⇒ 20), each with 2 chromatids",
    "Metaphase II: n chromosomes, 2n chromatids (2n = 16 ⇒ 8 chromosomes, 16 chromatids)",
    "DNA: G₁ = 2C, G₂/M = 4C, after meiosis I = 2C, gamete = 1C",
  ],
  traps: [
    "Putting mitochondria or peroxisomes in the endomembrane system.",
    "Thinking chromosome number doubles in S phase; only DNA content doubles.",
    "Confusing pachytene (crossing over) with diplotene (chiasmata become visible).",
    "Calling the nucleolus membrane-bound.",
    "Forgetting chloroplast and mitochondrial ribosomes are 70S, not 80S.",
  ],
  examTips: [
    "NEET asks a few questions every year from Cell: The Unit of Life and Cell Cycle together.",
    "Expect chromosome and DNA-count numericals, prophase I matching and statement-count items.",
    "NCERT values (52% protein, 0.5–1.0 μm cisternae, 24 h cycle) are lifted directly into options.",
  ],
};

export default notes;

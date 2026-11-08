import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "DNA structure and packaging",
      points: [
        "Nucleotide = nitrogen base + pentose sugar + phosphate; base + sugar alone is a nucleoside.",
        "Purines: adenine, guanine; pyrimidines: cytosine, thymine (DNA), uracil (RNA).",
        "Chargaff: A = T and G = C, so purines = pyrimidines in double-stranded DNA.",
        "Watson–Crick (1953) double helix used X-ray data of Wilkins and Franklin; strands antiparallel, A=T two H-bonds, G≡C three.",
        "B-DNA: right-handed, 2 nm wide, 3.4 nm per turn, about 10 bp per turn (0.34 nm between bp).",
        "Histones are positively charged (rich in lysine, arginine); 8 histones form the octamer; a nucleosome holds about 200 bp.",
        "Euchromatin is loosely packed and active; heterochromatin is dense and inactive.",
      ],
    },
    {
      heading: "Search for the genetic material",
      points: [
        "Griffith (1928): heat-killed S + live R strain killed mice; R was 'transformed' into S.",
        "Avery, MacLeod, McCarty: only DNase stopped transformation, so DNA is the transforming principle.",
        "Hershey–Chase (1952): ³²P (DNA) entered bacteria, ³⁵S (protein coat) did not.",
        "DNA beats RNA for storage: no 2'-OH (less reactive), thymine instead of uracil (more stable); RNA came first and can catalyse.",
      ],
    },
    {
      heading: "Replication and transcription",
      points: [
        "Replication is semiconservative: Meselson–Stahl (1958) grew E. coli in ¹⁵N, then ¹⁴N, separated by CsCl density gradient.",
        "After 1 generation all hybrid; after 2 generations 50% hybrid, 50% light; Taylor showed the same in Vicia faba with ³H-thymidine.",
        "DNA polymerase works only 5'→3': continuous leading strand, discontinuous lagging strand (Okazaki fragments joined by DNA ligase).",
        "Transcription unit: promoter (upstream), structural gene, terminator; template strand 3'→5', coding strand 5'→3' (same sequence as RNA, T for U).",
        "Bacteria: one RNA polymerase; σ factor for initiation, ρ factor for termination; transcription and translation coupled.",
        "Eukaryotes: Pol I rRNA (28S, 18S, 5.8S), Pol II hnRNA, Pol III tRNA, 5S rRNA, snRNA; splicing removes introns, 5' cap, 3' poly-A tail.",
      ],
    },
    {
      heading: "Genetic code, translation and regulation",
      points: [
        "Code is triplet (Gamow), read without commas, degenerate, unambiguous, nearly universal; 64 codons = 61 sense + 3 stop.",
        "Khorana synthesised RNA with defined repeats; Nirenberg used a cell-free system; Ochoa's enzyme made RNA without a template.",
        "tRNA (adapter) is clover-leaf in 2D, inverted L in 3D; charging (aminoacylation) needs ATP.",
        "In bacteria 23S rRNA is the ribozyme that forms peptide bonds; UTRs flank the coding region for efficient translation.",
        "Lac operon (Jacob and Monod): i gene makes repressor that binds operator; lactose (allolactose) inactivates it so z, y, a are transcribed.",
        "Insertion or deletion of 1 or 2 bases shifts the reading frame; 3 bases add or remove one amino acid only.",
      ],
    },
    {
      heading: "Human Genome Project and fingerprinting",
      points: [
        "HGP 1990–2003: 3164.7 million bp, ~30,000 genes, average gene 3000 bases, dystrophin largest (2.4 million bases).",
        "Under 2% codes for protein; chromosome 1 has most genes (2968), Y fewest (231); SNPs at ~1.4 million sites.",
        "DNA fingerprinting (Alec Jeffreys) uses VNTR satellite DNA probes: isolate, digest, electrophorese, Southern blot, hybridise, autoradiograph.",
      ],
    },
  ],
  formulas: [
    "Length of DNA = number of bp × 0.34 nm; human diploid ≈ 6.6 × 10⁹ bp ≈ 2.2 m.",
    "If A = x%, then T = x% and G = C = (100 − 2x)/2 %.",
    "After n generations in ¹⁴N (starting from one ¹⁵N molecule), hybrid molecules = 2 out of 2ⁿ.",
  ],
  traps: [
    "Coding strand is not transcribed; RNA matches its sequence, not the template's.",
    "Repressor is made by the i gene all the time; lactose is the inducer, not the repressor.",
    "AUG codes methionine and also starts translation; there is no separate start-only codon.",
    "Meselson–Stahl used heavy ¹⁵N (not radioactive); Hershey–Chase used radioactive ³²P and ³⁵S.",
    "Polycistronic genes are typical of prokaryotes; eukaryotic genes are mostly monocistronic and split.",
  ],
  examTips: [
    "NEET asks statement-counting on transcription and HGP numbers straight from NCERT.",
    "Expect frameshift reading questions and bp-to-length calculations.",
    "Matching experiment with scientist and isotope used is a favourite single-mark question.",
  ],
};

export default notes;

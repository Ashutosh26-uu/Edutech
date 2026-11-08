import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Origin of life",
      points: [
        "Big Bang theory explains the universe; Earth formed about 4.5 billion years ago.",
        "Spontaneous generation was disproved by Louis Pasteur's swan-necked flask: life comes only from pre-existing life.",
        "Oparin and Haldane: first life arose from non-living organic molecules (chemical evolution) in a reducing atmosphere.",
        "Miller (1953): CH₄, H₂, NH₃ and water vapour at 800 °C with electric discharge gave amino acids.",
        "First non-cellular forms appeared about 3 billion years ago; first cellular forms about 2000 million years ago.",
      ],
    },
    {
      heading: "Evidence for evolution",
      points: [
        "Palaeontology: fossils in successive rock layers show organisms changing over time.",
        "Homologous organs: same origin, different function (vertebrate forelimbs, Bougainvillea thorn and Cucurbita tendril) → divergent evolution.",
        "Analogous organs: different origin, same function (butterfly and bird wings, octopus and mammal eyes, sweet potato and potato) → convergent evolution.",
        "Similarity of proteins and genes across organisms points to common ancestry.",
        "Industrial melanism (peppered moth, England): dark moths became common on soot-covered trees; herbicide and antibiotic resistance are modern examples.",
        "Adaptive radiation: Darwin's finches (Galapagos), Australian marsupials; placental and marsupial look-alikes show convergence.",
      ],
    },
    {
      heading: "Theories and mechanism",
      points: [
        "Lamarck: use and disuse, inheritance of acquired characters (giraffe neck) — rejected.",
        "Darwin and Wallace: variation, overproduction, struggle, natural selection; fitness means reproductive fitness.",
        "Hugo de Vries (Oenothera): mutations are large, sudden and random; he called this saltation.",
        "Darwinian variations are small and directional; mutations are random and directionless.",
        "Hardy–Weinberg: allele frequencies stay constant across generations when nothing disturbs them.",
        "Five disturbing factors: gene flow (migration), genetic drift, mutation, genetic recombination, natural selection.",
        "Founder effect: a small group drifts away and starts a population with different allele frequencies.",
        "Stabilising selection favours the mean; directional shifts the peak to one side; disruptive favours both extremes.",
      ],
    },
    {
      heading: "Geological history and human evolution",
      points: [
        "Lobefins (coelacanth) gave rise to amphibians; reptiles laid shelled eggs; dinosaurs vanished about 65 mya.",
        "Dryopithecus (ape-like) and Ramapithecus (man-like) lived about 15 mya.",
        "Australopithecines about 2 mya in East African grasslands; hunted with stone weapons, ate fruit.",
        "Homo habilis: first human-like being, brain 650–800 cc, probably did not eat meat.",
        "Homo erectus about 1.5 mya, brain about 900 cc, probably ate meat.",
        "Neanderthal: 1400 cc, near east and central Asia, 1,00,000–40,000 years back, buried their dead.",
        "Homo sapiens arose in Africa; prehistoric cave art about 18,000 years ago; agriculture about 10,000 years ago.",
      ],
    },
  ],
  formulas: [
    "p + q = 1 (allele frequencies); p² + 2pq + q² = 1 (genotype frequencies).",
    "Recessive phenotype frequency = q², so q = √(recessive fraction); carriers = 2pq.",
    "Fraction of carriers among dominant phenotypes = 2pq/(p² + 2pq).",
  ],
  traps: [
    "Homology = divergent evolution, analogy = convergent; students swap them.",
    "Random mating and a large population do not disturb Hardy–Weinberg; gene flow and drift do.",
    "q² is the recessive phenotype; take its square root before finding p.",
    "Homo habilis probably did not eat meat; Homo erectus probably did.",
    "Industrial melanism is selection of forms already present, not mutation caused by soot.",
  ],
  examTips: [
    "NEET loves Hardy–Weinberg numericals and the order of hominid brain sizes.",
    "Expect example-based questions on homology vs analogy and on the type of selection.",
    "Statement-counting on NCERT dates (Miller, cave art, Neanderthal timeline) is common.",
  ],
};

export default notes;

import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Mendel’s work",
      points: [
        "Pea experiments 1856–1863; results published 1865; rediscovered 1900 by de Vries, Correns and von Tschermak.",
        "Used 14 true-breeding lines covering 7 contrasting trait pairs.",
        "Dominant forms: tall stem, violet flower, axial flower, green pod, inflated pod, round seed, yellow seed.",
        "Law of dominance and law of segregation come from monohybrid crosses; law of independent assortment from dihybrid crosses.",
        "Test cross: unknown dominant × homozygous recessive; 1 : 1 means heterozygous, all dominant means homozygous.",
      ],
    },
    {
      heading: "Deviations from Mendel",
      points: [
        "Incomplete dominance: snapdragon red × white ⇒ pink F₁; F₂ 1 : 2 : 1 for both genotype and phenotype.",
        "Co-dominance: both alleles expressed, e.g. Iᴬ and Iᴮ in AB blood group.",
        "Multiple alleles: ABO gene I has three alleles (Iᴬ, Iᴮ, i), but each person carries only two; 6 genotypes, 4 phenotypes.",
        "Dominance can depend on the trait: pea seed shape shows dominance, starch grain size in Bb shows incomplete dominance.",
        "Pleiotropy: one gene, many effects (phenylketonuria). Polygenic: many genes, one trait (human skin colour, height).",
      ],
    },
    {
      heading: "Chromosomal theory and linkage",
      points: [
        "Sutton and Boveri linked Mendel’s factors to chromosome behaviour in meiosis.",
        "Morgan (Drosophila) coined linkage and recombination; linked genes reduce new combinations.",
        "White–yellow genes: 1.3% recombination (tightly linked); white–miniature: 37.2% (loosely linked).",
        "Sturtevant used recombination frequency as a measure of distance to map genes.",
      ],
    },
    {
      heading: "Sex determination",
      points: [
        "XX–XY: humans, Drosophila; male heterogametic. Father decides the baby’s sex.",
        "XX–XO: grasshopper; males have one X and make two kinds of sperm.",
        "ZW–ZZ: birds; female heterogametic.",
        "Haplodiploidy: honey bee; drones are haploid from unfertilised eggs and make sperm by mitosis, so have no father.",
        "Henking (1891) first saw the X body in insect sperm.",
      ],
    },
    {
      heading: "Pedigree and disorders",
      points: [
        "Two affected parents with an unaffected child ⇒ autosomal dominant trait.",
        "Two normal parents with an affected child ⇒ recessive trait.",
        "Sickle-cell: autosomal recessive; Glu → Val at position 6 of β-globin (GAG → GUG).",
        "Thalassemia: too little globin made (quantitative); sickle-cell: wrong globin made (qualitative).",
        "Phenylketonuria: autosomal recessive, lacks phenylalanine hydroxylase.",
        "Haemophilia and colour blindness: X-linked recessive, far more common in males.",
        "Down: trisomy 21. Klinefelter: 47, XXY sterile male. Turner: 45, X0 sterile female.",
      ],
    },
  ],
  formulas: [
    "Monohybrid F₂: 3 : 1 phenotype, 1 : 2 : 1 genotype",
    "Dihybrid F₂: 9 : 3 : 3 : 1; dihybrid test cross 1 : 1 : 1 : 1",
    "True-breeding fraction among round-green F₂ (RRyy out of R_yy) = 1/3",
    "Iᴬi × Iᴮi ⇒ A, B, AB, O each 1/4",
    "Haemophilic male × carrier female ⇒ ½ daughters affected, ½ carriers; ½ sons affected",
  ],
  traps: [
    "Treating green seed as dominant; in Mendel’s peas green pod is dominant but yellow seed is.",
    "Calling ABO incomplete dominance; Iᴬ and Iᴮ are co-dominant, both dominant over i.",
    "Mixing pleiotropy (one gene, many traits) with polygenic inheritance.",
    "Saying birds have heterogametic males; in birds the female is ZW.",
    "Assuming an X-linked trait passes father to son; fathers give sons their Y.",
  ],
  examTips: [
    "NEET usually draws several questions from this chapter, often numerical crosses and disorder matching.",
    "Practise Punnett-square fractions (true-breeding, probability of a blood group or affected child).",
    "Statement-count items mix sex determination, linkage values and syndrome karyotypes.",
  ],
};

export default notes;

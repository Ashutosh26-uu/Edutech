import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core idea",
      points: [
        "Modern biotechnology rests on genetic engineering (altering DNA) and bioprocess engineering (sterile, large-scale culture).",
        "First recombinant DNA: Stanley Cohen and Herbert Boyer (1972) linked an antibiotic-resistance gene to a plasmid of Salmonella typhimurium.",
        "Three basic steps: identify DNA with the desired gene, introduce it into a host, keep it and transfer it to progeny.",
      ],
    },
    {
      heading: "Tools of recombinant DNA technology",
      points: [
        "Restriction endonucleases cut at specific palindromic sites; exonucleases remove nucleotides from the ends.",
        "Hind II was the first restriction enzyme isolated; EcoRI = Escherichia (E) coli (co) strain RY13 (R), first enzyme isolated from it (I).",
        "EcoRI cuts GAATTC between G and A, leaving single-stranded sticky ends that pair with complementary ends; DNA ligase seals them.",
        "Gel electrophoresis: DNA is negatively charged and moves to the anode through agarose (from seaweed); smaller fragments travel farther.",
        "DNA is stained with ethidium bromide and seen as orange bands under UV; bands are cut out and eluted.",
        "Vector features: ori (controls copy number), selectable marker (ampR, tetR, kanR), unique cloning sites.",
        "pBR322 has ori, rop, ampR and tetR; BamHI site lies in tetR, PstI and PvuI sites in ampR.",
        "Insertional inactivation of the lacZ (β-galactosidase) gene: recombinant colonies stay white with a chromogenic substrate, non-recombinants turn blue.",
        "Ti plasmid of Agrobacterium tumefaciens (plants) and disarmed retroviruses (animals) are natural vectors.",
      ],
    },
    {
      heading: "Process",
      points: [
        "DNA isolation: lysozyme (bacteria), cellulase (plants), chitinase (fungi); RNase and protease remove RNA and protein; chilled ethanol precipitates DNA as threads.",
        "Competent cells: treat with Ca²⁺, keep on ice, heat shock at 42 °C, back on ice.",
        "Other gene transfer: microinjection into the animal nucleus, biolistics (gene gun with gold or tungsten particles) for plants.",
        "PCR: denaturation, primer annealing, extension by thermostable Taq polymerase (Thermus aquaticus); copies double each cycle.",
        "Stirred-tank bioreactor (100–1000 L): agitator, oxygen delivery, foam control, temperature and pH control, sampling ports.",
        "Downstream processing: separation, purification, formulation with preservatives, quality control and clinical trials.",
      ],
    },
    {
      heading: "Applications",
      points: [
        "Bt toxin (Bacillus thuringiensis) is an inactive protoxin; the alkaline insect gut activates it, it makes pores in midgut cells and kills the larva.",
        "cryIAc and cryIIAb control cotton bollworms; cryIAb controls the corn borer.",
        "RNAi: nematode-specific dsRNA, introduced via Agrobacterium, silences Meloidogyne incognita mRNA in tobacco roots.",
        "Human insulin (Eli Lilly, 1983): A and B chains made separately in E. coli and joined by disulphide bonds; proinsulin's C-peptide is absent.",
        "First gene therapy (1990): a 4-year-old girl with ADA deficiency got lymphocytes carrying functional ADA cDNA via a retroviral vector; needs repeat infusions.",
        "Early diagnosis: PCR, ELISA (antigen–antibody), radioactive probes with autoradiography.",
        "Transgenic animals: over 95% are mice; Rosie (1997) gave milk with human alpha-lactalbumin; transgenic mice test polio vaccine safety.",
        "Golden rice carries genes for β-carotene (provitamin A).",
      ],
    },
    {
      heading: "Ethics",
      points: [
        "GEAC (Genetic Engineering Appraisal Committee) judges the safety of GM research and release in India.",
        "Biopiracy: using bio-resources or traditional knowledge without authorisation or compensation; the US Basmati patent (1997) is the classic case.",
      ],
    },
  ],
  formulas: [
    "PCR copies after n cycles = 2ⁿ per template.",
    "Expected frequency of an n-base recognition site in random DNA = 1 in 4ⁿ bases (6-base site: 1 in 4096).",
    "Heat shock for competence = 42 °C; Taq polymerase survives denaturation at about 94 °C.",
  ],
  traps: [
    "In blue–white selection the recombinant colony is white (lacZ inactivated), not blue.",
    "In pBR322, an insert at BamHI kills tetracycline resistance, not ampicillin resistance.",
    "DNA runs towards the positive electrode (anode) in electrophoresis.",
    "Bt protein is inactive in the bacterium; it becomes toxic only in the alkaline insect gut.",
    "ADA gene therapy with lymphocytes is not permanent; a permanent cure needs the gene in early embryonic or bone-marrow cells.",
  ],
  examTips: [
    "NEET favours enzyme naming (EcoRI), pBR322 site positions, cry gene–pest pairs and landmark dates (1983 insulin, 1990 gene therapy, 1997 Rosie).",
    "Match-the-following on DNA isolation enzymes and bioreactor parts is common; occasional numericals on PCR copies or site frequency.",
  ],
};

export default notes;

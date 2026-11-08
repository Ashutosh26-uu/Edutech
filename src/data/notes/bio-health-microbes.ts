import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Common diseases",
      points: [
        "Typhoid: Salmonella typhi, small intestine, confirmed by the Widal test; Mary Mallon ('Typhoid Mary') was a carrier.",
        "Pneumonia: Streptococcus pneumoniae and Haemophilus influenzae; alveoli fill with fluid; lips and nails may turn grey to bluish.",
        "Common cold: rhinoviruses infect the nose and respiratory passages, not the lungs.",
        "Malaria: Plasmodium (P. falciparum causes malignant malaria); sporozoites enter via the bite of a female Anopheles; haemozoin causes the chill and fever every 3–4 days.",
        "Plasmodium multiplies asexually in liver and RBCs; gametocytes form in RBCs; fertilisation happens in the mosquito gut.",
        "Amoebiasis: Entamoeba histolytica in the large intestine, houseflies carry cysts. Ascariasis: Ascaris, spread by contaminated food and water.",
        "Filariasis (elephantiasis): Wuchereria bancrofti and W. malayi in lymphatic vessels of the lower limbs, spread by female mosquitoes.",
        "Ringworm: fungi Microsporum, Trichophyton, Epidermophyton; favoured by heat and moisture in skin folds.",
      ],
    },
    {
      heading: "Immunity",
      points: [
        "Innate barriers: physical (skin, mucus), physiological (stomach acid, saliva, tears), cellular (neutrophils, monocytes, NK cells), cytokine (interferons).",
        "Acquired immunity has memory: the primary response is weak, the secondary (anamnestic) response is fast and strong.",
        "B cells make antibodies (humoral); T cells give cell-mediated immunity, which causes graft rejection.",
        "Antibody = two heavy + two light chains (H₂L₂); classes IgA, IgD, IgE, IgG, IgM.",
        "Active immunity: own antibodies (infection, vaccine). Passive: ready-made antibodies — colostrum (IgA), placental IgG, antitoxin or antivenom.",
        "Primary lymphoid organs: bone marrow and thymus; secondary: spleen, lymph nodes, tonsils, Peyer's patches, appendix; MALT is about 50% of lymphoid tissue.",
        "Allergy: IgE, mast cells release histamine and serotonin; treated with antihistamines, adrenaline, steroids. Rheumatoid arthritis is autoimmune.",
      ],
    },
    {
      heading: "AIDS, cancer and drugs",
      points: [
        "HIV is a retrovirus (RNA genome, reverse transcriptase); it multiplies in macrophages ('HIV factory') and then destroys helper T cells; ELISA is the screening test.",
        "Cancer cells lose contact inhibition; malignant tumours spread by metastasis; carcinogens include X-rays, gamma rays, UV, tobacco chemicals and oncogenic viruses.",
        "Cancer detection: biopsy, histopathology, CT, MRI; treatment: surgery, radiation, chemotherapy, α-interferon.",
        "Heroin (diacetylmorphine, from the poppy Papaver somniferum) is a depressant; cocaine (Erythroxylum coca) blocks dopamine transport.",
        "Cannabinoids (Cannabis sativa: marijuana, hashish, charas, ganja) affect the cardiovascular system; Datura and Atropa belladonna are hallucinogenic.",
        "Nicotine stimulates the adrenal gland to release adrenaline and noradrenaline, raising blood pressure and heart rate.",
      ],
    },
    {
      heading: "Microbes in human welfare",
      points: [
        "Lactobacillus turns milk to curd and raises vitamin B₁₂; Saccharomyces cerevisiae leavens bread and ferments beverages.",
        "Swiss cheese holes: CO₂ from Propionibacterium sharmanii; Roquefort cheese is ripened by fungi.",
        "Penicillin: Fleming (Penicillium notatum); Chain and Florey established its use.",
        "Products: citric acid (Aspergillus niger), acetic acid (Acetobacter aceti), butyric acid (Clostridium butylicum), lactic acid (Lactobacillus), streptokinase (Streptococcus, clot buster), cyclosporin A (Trichoderma polysporum, immunosuppressant), statins (Monascus purpureus, lower cholesterol).",
        "Sewage: primary treatment = filtration and sedimentation (primary sludge + effluent); secondary = aeration with flocs, which lowers BOD; settled activated sludge goes partly back as inoculum.",
        "Remaining sludge goes to anaerobic digesters: bacteria produce biogas (CH₄, CO₂, H₂S). Ganga and Yamuna Action Plans were started by the Ministry of Environment and Forests.",
        "Biogas: methanogens such as Methanobacterium, also found in cattle rumen; technology developed by IARI and KVIC.",
        "Biocontrol: ladybird (aphids), dragonfly (mosquitoes), Bt (caterpillars), Trichoderma (root pathogens), baculoviruses of genus Nucleopolyhedrovirus (narrow-spectrum, used in IPM).",
        "Biofertilisers: Rhizobium (symbiotic N₂ fixation in legume nodules), Azotobacter and Azospirillum (free-living), Anabaena, Nostoc, Oscillatoria (cyanobacteria), Glomus mycorrhiza (phosphorus uptake).",
      ],
    },
  ],
  formulas: [
    "Antibody structure = H₂L₂ (two heavy, two light chains).",
    "Higher BOD = more organic matter = more polluted water.",
  ],
  traps: [
    "Common cold does not reach the lungs; pneumonia does.",
    "Haemozoin, not the parasite itself, triggers the malarial chill and fever.",
    "Colostrum gives passive immunity (IgA), not active immunity.",
    "HIV first multiplies in macrophages; the cells whose number falls are helper T cells.",
    "Cyclosporin A comes from a fungus (Trichoderma) and suppresses immunity — it is not an antibiotic in exam context.",
  ],
  examTips: [
    "NEET relies on matching: pathogen–disease–symptom, microbe–product, drug–source plant, and sewage treatment stage–process.",
    "Statement-count questions on HIV/AIDS and immunity types are frequent; learn exact organism spellings.",
  ],
};

export default notes;

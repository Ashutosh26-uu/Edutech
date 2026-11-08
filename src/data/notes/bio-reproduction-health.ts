import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Flowering plants",
      points: [
        "Anther is bilobed, dithecous, tetrasporangiate; wall layers: epidermis, endothecium, middle layers, tapetum (nourishes pollen).",
        "Pollen exine is sporopollenin (most resistant organic material), absent at germ pores; most pollen shed at 2-celled stage.",
        "Ovule: funicle, hilum, integuments, micropyle, chalaza, nucellus; monosporic: one functional megaspore makes the embryo sac.",
        "Embryo sac: 7 cells, 8 nuclei — 3 antipodals, egg apparatus (egg + 2 synergids with filiform apparatus), central cell with 2 polar nuclei.",
        "Autogamy (same flower), geitonogamy (another flower, same plant — genetically like autogamy), xenogamy (different plant).",
        "Cleistogamous flowers (Commelina, Viola, Oxalis) never open and assure seed set; water pollination in Vallisneria, Hydrilla, Zostera.",
        "Double fertilisation: syngamy (zygote, 2n) + triple fusion (primary endosperm nucleus, 3n).",
        "Endosperm forms before the embryo; coconut water is free-nuclear endosperm; grass embryo has scutellum and coleoptile.",
        "Apomixis: seed without fertilisation (Asteraceae, grasses); polyembryony in citrus, mango; parthenocarpic fruit: banana.",
        "Albuminous seeds keep endosperm (wheat, maize, castor); perisperm persists in black pepper, beet; false fruits: apple, strawberry, cashew.",
      ],
    },
    {
      heading: "Human reproduction",
      points: [
        "Testis in scrotum 2–2.5 °C below body temperature; ~250 lobules each with 1–3 seminiferous tubules.",
        "Sertoli cells (FSH) nourish sperm and help spermiogenesis; Leydig cells (LH) secrete androgens.",
        "Sperm path: seminiferous tubules → rete testis → vasa efferentia → epididymis → vas deferens → ejaculatory duct → urethra.",
        "Oogenesis starts in the foetus; primary oocytes stay in prophase I; secondary oocyte released at ovulation finishes meiosis II only after sperm entry.",
        "Menstrual cycle ~28 days: menstrual (3–5 days), follicular, ovulation (~day 14, LH surge), luteal (progesterone from corpus luteum).",
        "Fertilisation in the ampullary region; implantation at blastocyst stage; inner cell mass forms the embryo, trophoblast attaches.",
        "hCG, hPL and relaxin are made only in pregnancy; parturition by foetal ejection reflex and oxytocin; colostrum rich in IgA.",
      ],
    },
    {
      heading: "Reproductive health",
      points: [
        "Natural methods: periodic abstinence (days 10–17), withdrawal, lactational amenorrhoea (up to 6 months after birth).",
        "IUDs: non-medicated (Lippes loop), copper (CuT, Cu7, Multiload 375), hormone-releasing (Progestasert, LNG-20).",
        "Saheli: non-steroidal once-a-week pill from CDRI Lucknow; emergency contraception within 72 hours.",
        "Sterilisation: vasectomy (vas deferens), tubectomy (fallopian tube) — nearly irreversible.",
        "ART: IVF-ET; ZIFT puts zygote or embryo up to 8 blastomeres in the fallopian tube, IUT more than 8 in the uterus; GIFT transfers ovum; ICSI injects sperm into ovum; AI/IUI for low sperm count.",
        "MTP legalised in India in 1971 (NCERT cites the 2017 amendment; the amended law took effect in 2021).",
        "Not fully curable STIs: hepatitis B, genital herpes, HIV; amniocentesis is banned for sex determination.",
      ],
    },
  ],
  formulas: [
    "1 microspore mother cell → 4 pollen grains; 1 megaspore mother cell → 4 megaspores → 1 embryo sac.",
    "1 primary spermatocyte → 4 sperms; 1 primary oocyte → 1 ovum + polar bodies.",
    "Ploidy: zygote 2n, endosperm 3n, nucellus and integuments 2n, antipodals and synergids n.",
    "Meioses needed for N seeds = N (one per megaspore mother cell) + N/4 (one microspore mother cell gives 4 pollen grains).",
  ],
  traps: [
    "Embryo sac has 8 nuclei but only 7 cells; the central cell holds two polar nuclei.",
    "Geitonogamy is functionally cross-pollination but genetically self-pollination.",
    "Secondary oocyte, not ovum, is released at ovulation.",
    "ZIFT goes into the fallopian tube and IUT into the uterus; the 8-blastomere line decides.",
    "Gonorrhoea, syphilis and chlamydiasis are curable if treated early; do not list them as incurable.",
  ],
  examTips: [
    "NEET favours statement-counting on embryo sac, double fertilisation and ART definitions.",
    "Small calculations on meiotic divisions for a given number of seeds or sperms appear often.",
    "Match contraceptive with its type or mode of action is a regular question.",
  ],
};

export default notes;

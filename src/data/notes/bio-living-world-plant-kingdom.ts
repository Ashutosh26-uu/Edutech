import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Living world and taxonomy",
      points: [
        "Defining features of life: metabolism, cellular organisation and consciousness; growth and reproduction are not unique to living things.",
        "Hierarchy: kingdom → phylum/division → class → order → family → genus → species.",
        "Binomial nomenclature (Linnaeus): genus capitalised, epithet small, italics in print, underlined separately when handwritten.",
        "Example: Musca domestica (housefly) — order Diptera, class Insecta, phylum Arthropoda.",
        "Taxonomic aids: herbarium (dried pressed specimens), key (paired contrasting couplets), flora (plants of an area), monograph (one taxon), manual (identification).",
      ],
    },
    {
      heading: "Five kingdoms: Monera and Protista",
      points: [
        "Whittaker (1969) used cell type, body organisation, nutrition, reproduction and phylogeny.",
        "Monera: prokaryotes; archaebacteria (methanogens, halophiles, thermoacidophiles) live in extreme habitats.",
        "Cyanobacteria (Nostoc, Anabaena) photosynthesise with chlorophyll a; heterocysts fix nitrogen.",
        "Mycoplasma: no cell wall, smallest living cells, survive without oxygen.",
        "Protista: unicellular eukaryotes; chrysophytes (diatoms, silica walls), dinoflagellates (red tides), euglenoids (pellicle, no wall).",
        "Slime moulds are saprophytic; plasmodium forms fruiting bodies with spores in bad conditions.",
        "Protozoa: amoeboid, flagellated (Trypanosoma), ciliated (Paramecium), sporozoans (Plasmodium).",
      ],
    },
    {
      heading: "Fungi, viruses and lichens",
      points: [
        "Fungi: chitin cell wall, heterotrophic; dikaryon stage (n + n) in ascomycetes and basidiomycetes.",
        "Phycomycetes: aseptate coenocytic hyphae, zoospores or aplanospores (Mucor, Rhizopus, Albugo).",
        "Ascomycetes (sac fungi): ascospores in asci (Neurospora, Claviceps, yeast, Penicillium).",
        "Basidiomycetes: basidiospores, no sex organs (Agaricus, Ustilago, Puccinia).",
        "Deuteromycetes (imperfect fungi): only asexual stage known (Alternaria, Colletotrichum, Trichoderma).",
        "Viruses: nucleoprotein, crystallisable, obligate parasites; plant viruses usually RNA; Ivanowsky (1892) studied TMV.",
        "Viroids (Diener, 1971): free RNA without protein coat, potato spindle tuber disease.",
        "Lichens: algae (phycobiont) plus fungi (mycobiont); pollution indicators.",
      ],
    },
    {
      heading: "Algae and bryophytes",
      points: [
        "Chlorophyceae (green): chl a, b; starch; Chlamydomonas, Volvox, Spirogyra, Chara.",
        "Phaeophyceae (brown): chl a, c and fucoxanthin; laminarin and mannitol; Ectocarpus, Laminaria, Fucus.",
        "Rhodophyceae (red): chl a, d and phycoerythrin; floridean starch; Polysiphonia, Porphyra, Gracilaria.",
        "Bryophytes: amphibians of the plant kingdom; dominant haploid gametophyte, dependent sporophyte.",
        "Liverworts (Marchantia, gemmae) and mosses (Funaria, Sphagnum, protonema stage).",
      ],
    },
    {
      heading: "Pteridophytes, gymnosperms and life cycles",
      points: [
        "Pteridophytes: first vascular land plants; dominant sporophyte, free-living prothallus.",
        "Mostly homosporous; Selaginella and Salvinia are heterosporous (a step toward seeds).",
        "Gymnosperms: naked ovules, no fruit; haploid endosperm formed before fertilisation.",
        "Cycas: coralloid roots with cyanobacteria; Pinus: mycorrhizal roots; Sequoia among the tallest trees.",
        "Haplontic (zygote only diploid): Volvox, Spirogyra, Chlamydomonas.",
        "Diplontic (gametes only haploid): Fucus, gymnosperms, angiosperms.",
        "Haplo-diplontic: bryophytes, pteridophytes, Ectocarpus, Polysiphonia, kelps.",
      ],
    },
  ],
  formulas: [
    "Algal pigments: green chl a + b; brown chl a + c + fucoxanthin; red chl a + d + phycoerythrin",
    "Stored food: green starch; brown laminarin/mannitol; red floridean starch",
    "Five kingdoms: Monera, Protista, Fungi, Plantae, Animalia (Whittaker 1969)",
  ],
  traps: [
    "Fucus is diplontic, not haplo-diplontic, though it is a brown alga like Ectocarpus.",
    "Gymnosperm endosperm is haploid (n); angiosperm endosperm is triploid (3n).",
    "Viroids lack a protein coat; prions are proteins without nucleic acid — do not swap them.",
    "Penicillium and yeast are ascomycetes; Puccinia and Ustilago are basidiomycetes.",
    "Euglenoids have a pellicle, not a cell wall, and can switch to heterotrophy in the dark.",
  ],
  examTips: [
    "NEET asks example-to-group matching (fungal classes, algal classes, heterosporous ferns).",
    "Statement-count questions on Monera, algae and life cycles are frequent; read each exception carefully.",
    "Taxonomic aids and hierarchy questions use match-the-column format.",
  ],
};

export default notes;

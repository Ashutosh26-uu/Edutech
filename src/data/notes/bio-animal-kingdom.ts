import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Basis of classification",
      points: [
        "Levels: cellular (sponges), tissue (cnidarians, ctenophores), organ (flatworms), organ system (Aschelminthes onwards).",
        "Symmetry: asymmetrical (most sponges), radial (cnidarians, ctenophores, adult echinoderms), bilateral (rest).",
        "Diploblastic (ectoderm + endoderm, mesoglea between): cnidarians, ctenophores; triploblastic: flatworms onwards.",
        "Acoelomate: flatworms; pseudocoelomate: Aschelminthes; true coelom: annelids to chordates.",
        "Metamerism (true segmentation): annelids, arthropods, chordates.",
      ],
    },
    {
      heading: "Non-chordate phyla",
      points: [
        "Porifera: canal system, ostia and osculum, choanocytes, spicules; Sycon, Spongilla.",
        "Cnidaria: cnidoblasts, polyp and medusa; metagenesis in Obelia; Physalia, Adamsia, corals.",
        "Ctenophora: eight comb plates, bioluminescence; Pleurobrachia, Ctenoplana.",
        "Platyhelminthes: dorsoventrally flat, flame cells; Taenia, Fasciola, Planaria (regeneration).",
        "Aschelminthes: round, separate sexes (females larger); Ascaris, Wuchereria, Ancylostoma.",
        "Annelida: nephridia, closed circulation; Nereis (parapodia), Pheretima, Hirudinaria.",
        "Arthropoda: largest phylum, chitin exoskeleton, jointed legs, open circulation, Malpighian tubules.",
        "Mollusca: mantle, radula, open circulation; Pila, Octopus, Sepia, Loligo.",
        "Echinodermata: spiny skin, water vascular system, larvae bilateral; Asterias, Echinus, Antedon.",
        "Hemichordata: proboscis, collar, trunk; Balanoglossus — now a separate non-chordate phylum.",
      ],
    },
    {
      heading: "Chordates",
      points: [
        "Chordate features: notochord, dorsal hollow nerve cord, pharyngeal gill slits, post-anal tail.",
        "Urochordata: notochord only in the larval tail (Ascidia, Salpa, Doliolum); Cephalochordata: lifelong (Branchiostoma).",
        "Cyclostomata: jawless, circular sucking mouth, migrate to fresh water to spawn (Petromyzon, Myxine).",
        "Chondrichthyes: cartilaginous, placoid scales, no air bladder, claspers in males (Scoliodon, Torpedo).",
        "Osteichthyes: bony, operculum, air bladder (Labeo, Hippocampus, Exocoetus).",
        "Amphibia: moist skin, three-chambered heart; Reptilia: dry scaly skin, crocodiles have a four-chambered heart.",
        "Aves: feathers, beak, pneumatic bones, air sacs; Mammalia: mammary glands, hair, external ear (pinnae).",
        "Oviparous mammal: platypus; flying mammal: bat (Pteropus); aquatic: whale, dolphin.",
      ],
    },
    {
      heading: "Animal tissues",
      points: [
        "Simple squamous: alveoli, blood vessel walls; cuboidal: ducts of glands, nephron tubules.",
        "Columnar: lining of stomach and intestine; ciliated: bronchioles, fallopian tubes.",
        "Compound epithelium: skin, buccal cavity, pharynx, ducts of salivary glands and pancreas.",
        "Junctions: tight (stop leakage), adhering (cement cells), gap (let ions pass).",
        "Tendon joins muscle to bone; ligament joins bone to bone (dense regular connective tissue).",
        "Muscles: skeletal (striated, voluntary), smooth (unstriated, involuntary), cardiac (striated, involuntary, intercalated discs).",
      ],
    },
    {
      heading: "Frog (Rana tigrina)",
      points: [
        "Cold-blooded; shows aestivation and hibernation; skin also respires.",
        "Ureotelic; three-chambered heart; no external ear, tympanum present.",
        "In males the ureters carry both urine and sperm (urinogenital duct); in females they are separate from oviducts.",
        "External fertilisation; development through a tadpole larva (metamorphosis).",
      ],
    },
  ],
  formulas: [
    "Excretory structures: flame cells (flatworms), nephridia (annelids), Malpighian tubules (insects), kidneys (vertebrates)",
    "Open circulation: arthropods and molluscs; closed: annelids and chordates",
    "Four-chambered heart: crocodiles, birds, mammals",
  ],
  traps: [
    "Hemichordates have a stomochord, not a true notochord, so they are non-chordates.",
    "Crocodiles are reptiles with a four-chambered heart — a classic exception.",
    "Platypus and echidna lay eggs but are mammals.",
    "Ctenophores reproduce only sexually and show no polyp–medusa alternation; metagenesis belongs to Obelia.",
    "Compound, not cuboidal, epithelium lines salivary and pancreatic ducts.",
  ],
  examTips: [
    "NEET asks feature-to-phylum and example-to-class matching, often with one exception hidden in the options.",
    "Statement-count questions on chordates and mammals are common; check every 'all' and 'only'.",
    "Tissue questions test epithelium locations and tendon versus ligament.",
  ],
};

export default notes;

import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Nerve impulse and the brain",
      points: [
        "At rest the axon membrane is more permeable to K⁺ than Na⁺; inside is negative (polarised).",
        "Na⁺–K⁺ pump moves 3 Na⁺ out and 2 K⁺ in; a stimulus opens Na⁺ channels, Na⁺ rushes in and depolarises.",
        "Repolarisation by K⁺ outflow; impulse is faster in myelinated fibres (saltatory, node to node).",
        "Chemical synapse: neurotransmitter (e.g. acetylcholine) crosses the cleft; electrical synapse is faster but rare.",
        "Forebrain: cerebrum (corpus callosum joins hemispheres), thalamus (relay), hypothalamus (temperature, hunger, thirst, releasing hormones).",
        "Midbrain: corpora quadrigemina; hindbrain: pons, cerebellum (balance, coordination), medulla (breathing, heartbeat, swallowing).",
        "Limbic system with hypothalamus controls emotion, motivation and sexual behaviour.",
      ],
    },
    {
      heading: "Endocrine glands and hormones",
      points: [
        "Hypothalamus makes releasing and inhibiting hormones for the anterior pituitary via portal blood.",
        "Oxytocin and ADH (vasopressin) are made in the hypothalamus and only stored and released by the posterior pituitary.",
        "Anterior pituitary: GH, PRL, TSH, ACTH, LH, FSH; pars intermedia: MSH.",
        "Pineal: melatonin (day–night rhythm); thymus: thymosins (T-cell maturation).",
        "Thyroid: T₃, T₄ (iodothyronines, raise BMR) and thyrocalcitonin (lowers blood Ca²⁺); parathyroid PTH raises Ca²⁺.",
        "Adrenal medulla: adrenaline and noradrenaline (catecholamines, fight or flight).",
        "Adrenal cortex: cortisol (glucocorticoid), aldosterone (mineralocorticoid), small androgens (pubic, axial and facial hair at puberty).",
        "Pancreas: α cells glucagon (raises glucose), β cells insulin (lowers glucose); Leydig cells androgens; corpus luteum progesterone.",
        "Heart atria secrete ANF (lowers BP); kidney JG cells secrete erythropoietin.",
        "Steroids and iodothyronines bind intracellular receptors and act on genes; peptides and catecholamines use membrane receptors and second messengers (cAMP).",
      ],
    },
    {
      heading: "Muscle and skeleton",
      points: [
        "Sarcomere = Z line to Z line; I band has actin only, A band has myosin; H zone is myosin without overlap.",
        "Sequence: impulse → ACh at neuromuscular junction → Ca²⁺ released from sarcoplasmic reticulum → binds troponin → myosin heads bind actin → sliding.",
        "Red fibres: myoglobin, many mitochondria, aerobic; white fibres: little myoglobin, anaerobic.",
        "206 bones: axial 80 (skull 22, hyoid 1, ear ossicles 6, vertebrae 26, sternum 1, ribs 24), appendicular 126.",
        "Vertebrae 7 cervical, 12 thoracic, 5 lumbar, 1 sacral, 1 coccygeal; ribs 7 true, 3 false, 2 floating pairs.",
        "Joints: fibrous (skull sutures), cartilaginous (between vertebrae), synovial: ball and socket (shoulder), hinge (knee), pivot (atlas–axis), gliding (carpals), saddle (thumb carpal–metacarpal).",
      ],
    },
  ],
  formulas: [
    "Hypothyroid: cretinism (child), myxoedema (adult); goitre from iodine deficiency; Graves' (exophthalmic goitre) is hyperthyroid.",
    "Excess GH: gigantism (child), acromegaly (adult); low GH: dwarfism; low ADH: diabetes insipidus; low insulin: diabetes mellitus.",
    "Addison's disease: adrenal cortex deficiency; tetany: low blood Ca²⁺.",
    "Muscle disorders: myasthenia gravis (autoimmune, NMJ), muscular dystrophy (genetic); gout (uric acid crystals in joints), osteoporosis (low oestrogen, bone loss).",
  ],
  traps: [
    "Posterior pituitary makes no hormone; it only releases hypothalamic ones.",
    "During contraction the A band length stays the same; I band and H zone shorten.",
    "Ca²⁺ binds troponin, not tropomyosin or myosin.",
    "Thyroxine is an amino-acid derivative but still uses intracellular receptors, unlike adrenaline.",
    "Skull is 22 bones; 29 only if you add the hyoid and six ear ossicles.",
  ],
  examTips: [
    "NEET matches hormone with disorder, gland, or chemical nature almost every year.",
    "Expect ordering questions on events of muscle contraction and bone-count statements.",
    "Assertion–reason on hypothalamus–pituitary control and resting potential is common.",
  ],
};

export default notes;

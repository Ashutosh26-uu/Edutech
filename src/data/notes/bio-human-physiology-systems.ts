import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Digestion and absorption",
      points: [
        "Adult dental formula 2123/2123 = 32 teeth; teeth are thecodont, diphyodont, heterodont.",
        "Saliva: salivary amylase (pH 6.8) digests about 30% of starch to maltose; lysozyme is antibacterial.",
        "Stomach: parietal (oxyntic) cells secrete HCl and intrinsic factor; chief cells secrete pepsinogen; rennin in infants curdles milk.",
        "Pancreatic juice: trypsinogen, chymotrypsinogen, procarboxypeptidase, amylase, lipase, nucleases; enterokinase activates trypsinogen.",
        "Bile has no enzymes; bile salts emulsify fats into micelles.",
        "Fats are absorbed as micelles → chylomicrons → lacteals (lymph); glucose and amino acids enter blood.",
        "GI hormones: gastrin (gastric juice), secretin and CCK (pancreatic juice, bile), GIP (inhibits gastric secretion).",
      ],
    },
    {
      heading: "Breathing and gas exchange",
      points: [
        "TV 500 mL, IRV 2500–3000, ERV 1000–1100, RV 1100–1200 mL; normal rate 12–16 per minute.",
        "Alveolar pO₂ 104, pCO₂ 40; deoxygenated blood pO₂ 40, pCO₂ 45; tissues pO₂ 40, pCO₂ 45 mm Hg.",
        "CO₂ is about 20–25 times more soluble than O₂, so it diffuses faster.",
        "O₂: 97% by Hb, 3% dissolved; 100 mL oxygenated blood gives about 5 mL O₂ to tissues.",
        "O₂–Hb curve is sigmoid; high pCO₂, H⁺ and temperature shift it right (less affinity).",
        "Rhythm centre in medulla; pneumotaxic centre in pons; chemosensitive area responds to CO₂ and H⁺, O₂ plays little role.",
      ],
    },
    {
      heading: "Blood and circulation",
      points: [
        "RBC 5–5.5 million/mm³, life 120 days; WBC 6000–8000/mm³; platelets 1.5–3.5 lakh/mm³.",
        "WBC %: neutrophils 60–65 (most), lymphocytes 20–25, monocytes 6–8, eosinophils 2–3 (allergy), basophils 0.5–1 (least).",
        "Group AB is universal recipient, O universal donor; Rh⁻ mother with Rh⁺ foetus risks erythroblastosis foetalis.",
        "SA node (pacemaker, 70–75 per minute) → AV node → bundle of His → Purkinje fibres.",
        "Lub = closure of AV valves (start of ventricular systole); dub = closure of semilunar valves.",
        "ECG: P atrial depolarisation, QRS ventricular depolarisation, T ventricular repolarisation; count QRS for heart rate.",
      ],
    },
    {
      heading: "Excretion",
      points: [
        "Ammonotelic (bony fish), ureotelic (mammals, frogs), uricotelic (birds, reptiles, insects).",
        "About 1 million nephrons per kidney; juxtamedullary nephrons have long loops of Henle and vasa recta.",
        "PCT reabsorbs 70–80% of electrolytes and water, all glucose and amino acids.",
        "Descending limb permeable to water only; ascending limb impermeable to water, moves electrolytes out.",
        "Counter-current in Henle's loop and vasa recta keeps medullary gradient 300 → 1200 mOsmol/L (NaCl and urea).",
        "Low GFR → JG cells release renin → angiotensin II (vasoconstrictor) → aldosterone (Na⁺ and water reabsorption); ANF opposes it.",
        "ADH increases water reabsorption in DCT and collecting duct; daily urine 1–1.5 L with 25–30 g urea.",
      ],
    },
  ],
  formulas: [
    "VC = IRV + TV + ERV; TLC = VC + RV; FRC = ERV + RV; IC = TV + IRV; EC = TV + ERV.",
    "Cardiac output = stroke volume × heart rate ≈ 70 mL × 72 ≈ 5 L/min.",
    "Cardiac cycle 0.8 s: atrial systole 0.1 s, ventricular systole 0.3 s, joint diastole 0.4 s.",
    "GFR 125 mL/min = 180 L/day; about 99% reabsorbed.",
    "CO₂ transport: 70% bicarbonate, 20–25% carbamino-Hb, 7% dissolved.",
  ],
  traps: [
    "Enterokinase is from intestinal mucosa, not the pancreas; it activates trypsinogen, which then activates the others.",
    "Residual volume cannot be measured by a spirometer, so TLC and FRC cannot either.",
    "Ascending limb is impermeable to water; students give that property to the descending limb.",
    "Angiotensin II, not renin, is the vasoconstrictor; renin is an enzyme.",
    "Basophils, not eosinophils, are the least numerous WBCs.",
  ],
  examTips: [
    "NEET favours lung-volume sums, cardiac output and GFR numbers.",
    "Expect match-the-column on enzymes with substrates and products, and on ECG waves.",
    "Statement-counting on CO₂ transport, regulation of breathing and RAAS is common.",
  ],
};

export default notes;

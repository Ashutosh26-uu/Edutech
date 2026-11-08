import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Classification",
      points: [
        "Mendeleev arranged by atomic mass and left gaps (eka-aluminium = Ga, eka-silicon = Ge); Moseley showed atomic number is the basis.",
        "Modern periodic law: properties are periodic functions of atomic number; 18 groups, 7 periods.",
        "Blocks by last-filled subshell: s (groups 1–2), p (13–18), d (3–12), f (lanthanoids, actinoids).",
        "Period number = highest n; group for s-block = valence electrons, for p-block = 10 + valence electrons.",
        "IUPAC names for Z > 100: digits 0 nil, 1 un, 2 bi, 3 tri, 4 quad, 5 pent, 6 hex, 7 sept, 8 oct, 9 enn + 'ium' (120 = unbinilium, period 8, group 2).",
      ],
    },
    {
      heading: "Size and effective nuclear charge",
      points: [
        "Across a period radius decreases (Zeff rises); down a group it increases (new shell).",
        "Cation smaller than parent atom, anion larger; isoelectronic: more protons → smaller (O²⁻ > F⁻ > Na⁺ > Mg²⁺ > Al³⁺).",
        "Ga ≈ Al (Ga slightly smaller) because 3d electrons shield poorly; Zr ≈ Hf due to lanthanoid contraction.",
        "Slater (for ns, np electron): same group 0.35 each (1s pair: 0.30), (n − 1) shell 0.85, (n − 2) and lower 1.00.",
        "Na 3s: σ = 2(1.00) + 8(0.85) = 8.8, Zeff = 2.2; Zn 4s: σ = 0.35 + 18(0.85) + 10(1.00) = 25.65, Zeff = 4.35.",
      ],
    },
    {
      heading: "Ionisation and electron gain enthalpy",
      points: [
        "IE rises across a period and falls down a group; noble gases highest in their period.",
        "Exceptions: Be > B and Mg > Al (s² stable, p electron better shielded); N > O and P > S (half-filled p³).",
        "Second-period order of IE₁: Li < B < Be < C < O < N < F < Ne.",
        "Successive IEs always increase; a sudden big jump marks removal from a noble-gas core.",
        "Electron gain enthalpy most negative for Cl (−349), then F (−328, small crowded 2p), Br, I; O less negative than S.",
        "Positive (energy absorbed) for noble gases, N, Be, Mg; second electron gain enthalpy is always positive.",
      ],
    },
    {
      heading: "Electronegativity and chemical trends",
      points: [
        "Pauling scale: F 4.0 highest, then O, N ≈ Cl; electronegativity rises across a period, falls down a group.",
        "Metallic character falls across a period, rises down a group; Cs most electropositive stable metal.",
        "Oxides: basic (Na₂O) → amphoteric (Al₂O₃) → acidic (Cl₂O₇) across period 3; neutral: CO, NO, N₂O.",
        "Amphoteric oxides: BeO, Al₂O₃, ZnO, SnO, PbO, Ga₂O₃.",
        "Inert pair effect: lower state more stable down groups 13–15 — Tl⁺, Pb²⁺, Bi³⁺.",
        "Diagonal pairs (similar charge/size): Li–Mg, Be–Al, B–Si.",
      ],
    },
  ],
  formulas: [
    "Zeff = Z − σ (Slater screening constant).",
    "Mulliken electronegativity = (IE + EA)/2.",
    "IE₁ < IE₂ < IE₃ …; a jump of several times between IEₙ and IEₙ₊₁ means n valence electrons.",
    "Fourth-period atoms with 3 unpaired electrons: V, Co, As.",
  ],
  traps: [
    "F has lower electron gain enthalpy magnitude than Cl, but higher electronegativity.",
    "B has lower IE than Be and O lower than N; never assume a smooth rise.",
    "Noble-gas radii are van der Waals radii, so they look largest in a period; do not compare them with covalent radii.",
    "Electron gain enthalpy is a thermodynamic value (negative = released); electron affinity is quoted positive for the same energy.",
    "Ga, not Al, breaks the radius trend in group 13.",
  ],
  examTips: [
    "JEE and NEET test exceptions (Be/B, N/O, F/Cl, Ga/Al) and isoelectronic ordering most often.",
    "Slater's-rule Zeff calculations and successive-IE jump questions appear in JEE Main.",
    "Oxide nature and diagonal relationship come as single-fact NEET questions.",
  ],
};

export default notes;

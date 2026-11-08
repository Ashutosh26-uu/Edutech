import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Hydrogen",
      points: [
        "Isotopes: protium, deuterium, tritium; only tritium is radioactive (β-emitter).",
        "Water gas (syngas) = CO + H₂; water-gas shift: CO + H₂O → CO₂ + H₂ raises the hydrogen yield.",
        "Ionic hydrides: s-block (NaH, CaH₂); covalent: electron-deficient (B₂H₆), electron-precise (CH₄), electron-rich (NH₃, H₂O, HF); metallic hydrides of d/f-block are often non-stoichiometric.",
        "Heavy water D₂O: moderator in nuclear reactors and tracer for reaction mechanisms; made by repeated electrolysis of water.",
      ],
    },
    {
      heading: "Hard water and hydrogen peroxide",
      points: [
        "Temporary hardness: Ca and Mg bicarbonates; removed by boiling (Ca as CaCO₃, Mg as Mg(OH)₂) or Clark's method (slaked lime).",
        "Permanent hardness: chlorides and sulphates; removed by washing soda, Calgon (Na₆P₆O₁₈), ion exchange (zeolite/permutit swaps Na⁺ for Ca²⁺, Mg²⁺) or synthetic resins.",
        "H₂O₂ is made industrially by auto-oxidation of 2-ethylanthraquinol; in the lab from BaO₂ + dil. H₂SO₄.",
        "Open-book (non-planar) structure; acts as both oxidant and reductant in acid and base.",
        "Concentrated by distillation under reduced pressure because it decomposes near its boiling point.",
        "Stored in wax-lined glass or plastic bottles in the dark; urea is added as a stabiliser.",
      ],
    },
    {
      heading: "Group 1 (alkali metals)",
      points: [
        "ns¹; size increases and ionisation enthalpy decreases down the group; melting point falls down the group.",
        "Density: Li < K < Na < Rb < Cs (K is lighter than Na).",
        "Li has the most negative E° (about −3.04 V) because of its very large hydration enthalpy, so it is the strongest reducing agent in water.",
        "Li⁺ is the most hydrated ion, so it has the lowest mobility in water.",
        "In excess air: Li → Li₂O, Na → Na₂O₂ (peroxide), K, Rb, Cs → superoxides MO₂ (paramagnetic).",
        "Flame colours: Li crimson red, Na golden yellow, K lilac, Rb red-violet, Cs blue.",
        "In liquid NH₃: dilute solutions are blue and paramagnetic (ammoniated electrons); concentrated ones are bronze and diamagnetic.",
        "Li anomalies (diagonal to Mg): forms Li₃N, LiNO₃ gives NO₂ on heating, Li₂CO₃ decomposes on heating, LiCl is deliquescent.",
      ],
    },
    {
      heading: "Group 2 (alkaline earth metals)",
      points: [
        "Be and Mg give no flame colour; Ca brick red, Sr crimson, Ba apple green.",
        "Down the group: hydroxide solubility and basicity rise, carbonate and sulphate thermal stability rise, sulphate solubility falls.",
        "BeSO₄ and MgSO₄ are soluble because the small ions have high hydration enthalpy.",
        "Be anomalies (diagonal to Al): BeO and Be(OH)₂ amphoteric; BeCl₂ is covalent, a polymeric chain in the solid and a dimer in vapour.",
        "Biology: Na⁺ mainly outside cells, K⁺ inside; Mg²⁺ in chlorophyll; Ca²⁺ in bones and blood clotting.",
      ],
    },
    {
      heading: "Important compounds",
      points: [
        "Solvay process: CO₂ through ammoniated brine precipitates NaHCO₃; heating gives Na₂CO₃; NH₃ recovered with Ca(OH)₂, CaCl₂ is the by-product.",
        "Washing soda Na₂CO₃·10H₂O; baking soda NaHCO₃ releases CO₂ on heating.",
        "Castner–Kellner cell: brine electrolysed with a mercury cathode; Na forms sodium amalgam, which reacts with water to give NaOH.",
        "Quicklime CaO from heating limestone; slaked lime Ca(OH)₂; milk of lime is its suspension.",
        "Plaster of Paris CaSO₄·½H₂O, made by heating gypsum at about 393 K; above this dead-burnt plaster (anhydrous CaSO₄) forms, which does not set.",
      ],
    },
  ],
  formulas: [
    "Volume strength of H₂O₂ = 11.2 × molarity = 5.6 × normality",
    "Clark's method: Ca(HCO₃)₂ + Ca(OH)₂ → 2CaCO₃ + 2H₂O",
    "Setting of plaster: CaSO₄·½H₂O + 1½H₂O → CaSO₄·2H₂O",
    "Thermal decomposition: MCO₃ → MO + CO₂ (stability increases from Be to Ba)",
  ],
  traps: [
    "Lithium is the strongest reducing agent in water even though caesium has the lowest ionisation enthalpy.",
    "Potassium is less dense than sodium — density does not rise smoothly.",
    "On boiling hard water, magnesium leaves as Mg(OH)₂, not MgCO₃.",
    "Group 2 sulphate solubility decreases but hydroxide solubility increases down the group.",
    "Among alkali metal nitrates only LiNO₃ gives NO₂ on heating (like Group 2 nitrates); the others give nitrite and O₂.",
  ],
  examTips: [
    "JEE and NEET ask trend orders (density, solubility, stability, E°) and anomalous Li/Be behaviour as statement-count items.",
    "Numericals appear on H₂O₂ volume strength, Ksp-based precipitation and carbonate-mixture decomposition.",
    "Process questions: Solvay, Castner–Kellner, water softening methods and Plaster of Paris setting.",
  ],
};

export default notes;

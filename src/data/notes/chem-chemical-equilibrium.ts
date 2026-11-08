import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Chemical equilibrium",
      points: [
        "Equilibrium is dynamic: forward rate = backward rate; reachable from either side.",
        "Kc uses molar concentrations, Kp partial pressures; pure solids and liquids are left out.",
        "Reverse reaction → 1/K; multiply equation by n → Kⁿ; add equations → multiply K values.",
        "Q < K: reaction goes forward; Q > K: goes backward; Q = K: at equilibrium.",
        "K depends only on temperature: exothermic K falls with T, endothermic K rises.",
      ],
    },
    {
      heading: "Le Chatelier's principle",
      points: [
        "Adding reactant or removing product shifts forward; K does not change.",
        "Higher pressure favours fewer gas moles; no effect when Δn(g) = 0 (H₂ + I₂ ⇌ 2HI).",
        "Inert gas at constant volume: no shift; at constant pressure: shifts to the side with more gas moles (PCl₅ dissociates more).",
        "Catalyst speeds both directions equally — equilibrium reached faster, position unchanged.",
        "Haber process (N₂ + 3H₂ ⇌ 2NH₃, exothermic): high pressure, moderate temperature (~700 K), iron catalyst.",
      ],
    },
    {
      heading: "Acids, bases and pH",
      points: [
        "Arrhenius (H⁺/OH⁻ in water), Brønsted–Lowry (proton donor/acceptor), Lewis (electron-pair acceptor/donor).",
        "Stronger acid → weaker conjugate base; Ka × Kb = Kw for a conjugate pair.",
        "Kw = 10⁻¹⁴ at 25 °C, rises with temperature; pure water stays neutral but its pH drops below 7 when hot (Kw = 10⁻¹³ → pH 6.5).",
        "Very dilute acid: add water's H⁺; 10⁻⁸ M HCl has pH ≈ 6.98, not 8.",
        "Polyprotic: Ka₁ ≫ Ka₂, so the first step fixes pH (except when Ka₂ is large, as in H₂SO₄).",
        "Indicators: phenolphthalein 8.3–10 (weak acid vs strong base), methyl orange 3.1–4.4 (strong acid vs weak base).",
      ],
    },
    {
      heading: "Buffers, hydrolysis and solubility",
      points: [
        "Acidic buffer: CH₃COOH + CH₃COONa; basic buffer: NH₄OH + NH₄Cl; best buffering when pH = pKa (ratio 1).",
        "Salt of strong acid + strong base (NaCl): pH 7; weak acid + strong base (CH₃COONa, Na₂CO₃): basic; strong acid + weak base (NH₄Cl): acidic.",
        "Amphiprotic ion (HCO₃⁻): pH = ½(pKa₁ + pKa₂), independent of concentration.",
        "Ksp is the ionic product of a saturated solution; precipitation occurs when ionic product > Ksp.",
        "Common ion lowers solubility; compare solubility (s), not Ksp, for salts of different formula type.",
        "Na₂CO₃ vs HCl: phenolphthalein end point at half the methyl orange volume (CO₃²⁻ → HCO₃⁻ → H₂CO₃).",
      ],
    },
  ],
  formulas: [
    "Kp = Kc(RT)^Δn, Δn = gas moles of products − reactants.",
    "ΔG° = −2.303 RT log K; ΔG = ΔG° + 2.303 RT log Q.",
    "Weak acid: α = √(Ka/C), [H⁺] = √(Ka·C) (Ostwald dilution, α ≪ 1).",
    "Buffer: pH = pKa + log([salt]/[acid]); pOH = pKb + log([salt]/[base]).",
    "Hydrolysis pH: WA + SB = 7 + ½(pKa + log C); SA + WB = 7 − ½(pKb + log C); WA + WB = 7 + ½(pKa − pKb).",
    "Ksp: AB = s², AB₂ or A₂B = 4s³, AB₃ = 27s⁴, A₂B₃ = 108s⁵; general AₓBᵧ = xˣyʸ s^(x+y).",
    "pH + pOH = pKw (14 at 25 °C).",
  ],
  traps: [
    "Changing concentration or pressure shifts the position but never changes K; only temperature does.",
    "Ba(OH)₂ gives two OH⁻: 10⁻³ M → [OH⁻] = 2 × 10⁻³, pH = 11.3.",
    "Inert gas at constant volume does nothing; students wrongly shift the equilibrium.",
    "Neutral water at high temperature has pH < 7 but is still neutral ([H⁺] = [OH⁻]).",
    "A smaller Ksp does not always mean lower solubility when formula types differ.",
  ],
  examTips: [
    "JEE and NEET ask a pH or Ksp calculation with clean logarithms (log 2 = 0.3, log 3 = 0.48) nearly every paper.",
    "Le Chatelier statements (inert gas, catalyst, temperature) come as assertion–reason or statement-counting.",
    "Match salt with pH nature or buffer type is a frequent single-mark question.",
  ],
};

export default notes;

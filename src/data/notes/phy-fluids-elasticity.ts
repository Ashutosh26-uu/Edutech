import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Elasticity",
      points: [
        "Stress = restoring force/area; strain = change/original (dimensionless); Hooke's law: stress ∝ strain within the elastic limit.",
        "Young's modulus Y = FL/AΔL; bulk modulus B = −ΔP/(ΔV/V); shear modulus = shear stress/shear angle.",
        "Compressibility = 1/B; under pressure ΔP, density rises by Δρ/ρ ≈ ΔP/B.",
        "Poisson's ratio = lateral strain/longitudinal strain; theoretical range −1 to 0.5, practically 0 to 0.5.",
        "Elastic energy = ½FΔL; per unit volume = ½ × stress × strain = stress²/2Y.",
        "Wire under its own weight: extension = MgL/2AY; maximum hanging length = breaking stress/ρg.",
        "Thermal stress in a rod held between rigid walls = YαΔT, independent of length and area.",
        "Rods in series share the same force; extension ∝ 1/Y.",
      ],
    },
    {
      heading: "Fluid statics",
      points: [
        "Pressure at depth h: P = P₀ + ρgh; gauge pressure = ρgh; for layers add ρ₁gh₁ + ρ₂gh₂.",
        "Pascal's law: pressure is transmitted equally; hydraulic lift F₁/A₁ = F₂/A₂.",
        "Archimedes: buoyant force = weight of fluid displaced; a floating body displaces its own weight.",
        "Fraction submerged = ρ_body/ρ_liquid; a ship rides higher in denser sea water.",
        "In a lift accelerating up or down, the fraction submerged does not change (both weight and buoyancy scale with g_eff).",
        "A body released inside liquid in an accelerating container has relative acceleration (ρ_liquid/ρ_body − 1)g_eff, with g_eff = g ± a.",
      ],
    },
    {
      heading: "Fluid dynamics and viscosity",
      points: [
        "Continuity: A₁v₁ = A₂v₂ (incompressible flow).",
        "Bernoulli: P + ½ρv² + ρgh = constant along a streamline (energy per volume).",
        "Torricelli: efflux speed √(2gh); with extra gauge pressure P above, √(2gh + 2P/ρ).",
        "Hole at depth h in a tank of height H: horizontal range 2√(h(H − h)), maximum at h = H/2.",
        "Viscous force F = ηA(dv/dx); Stokes' drag 6πηrv.",
        "Terminal speed v = 2r²(ρ − σ)g/9η ∝ r²; Poiseuille: flow rate Q = πPr⁴/8ηl.",
        "Reynolds number ρvD/η; laminar when low, turbulent when high.",
        "Viscosity of liquids falls and of gases rises with temperature.",
      ],
    },
    {
      heading: "Surface tension",
      points: [
        "T = force per unit length = surface energy per unit area; falls with temperature and with detergents.",
        "Excess pressure: drop or air bubble in liquid 2T/r; soap bubble 4T/r (two surfaces).",
        "Work to form a soap bubble of radius r = 8πr²T.",
        "Capillary rise h = 2T cosθ/(rρg); hr = constant (Jurin's law).",
        "Acute contact angle (water–glass) gives rise; obtuse (mercury–glass) gives depression.",
        "A tube shorter than h never overflows; the meniscus radius grows instead.",
        "In capillary rise, half the work done by surface tension is stored as potential energy and half is lost as heat.",
      ],
    },
  ],
  formulas: [
    "Y = FL/AΔL; B = −V ΔP/ΔV; U/volume = ½ stress × strain",
    "P = P₀ + ρgh; A₁v₁ = A₂v₂; P + ½ρv² + ρgh = const",
    "v_t = 2r²(ρ − σ)g/9η; Q = πPr⁴/8ηl",
    "ΔP = 2T/r (drop), 4T/r (soap bubble); h = 2T cosθ/rρg",
  ],
  traps: [
    "A soap bubble has two surfaces; a liquid drop has one.",
    "Thermal stress does not depend on the rod's length.",
    "Efflux speed depends on depth below the free surface, not on the hole's size.",
    "Capillary water does not spill out of a short tube.",
    "Gas viscosity increases with temperature, unlike liquids.",
  ],
  examTips: [
    "NEET asks Young's modulus, terminal velocity, excess pressure and capillary rise as direct formulas.",
    "JEE Main sets Bernoulli/efflux problems and floating bodies in accelerating frames.",
    "Statement-count questions mix viscosity, surface tension and buoyancy facts.",
  ],
};

export default notes;

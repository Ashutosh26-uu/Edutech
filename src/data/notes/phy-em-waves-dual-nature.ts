import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Displacement current and EM waves",
      points: [
        "Maxwell added displacement current I_d = ε₀ dΦ_E/dt; in a charging capacitor it equals the conduction current (C dV/dt).",
        "Accelerated charges radiate EM waves; Hertz produced them in the lab (1887); J.C. Bose made millimetre waves; Marconi used them for radio.",
        "EM waves are transverse, need no medium, travel at c = 1/√(μ₀ε₀) ≈ 3 × 10⁸ m/s in vacuum; in a medium v = c/n.",
        "E and B are in phase and perpendicular to each other and to the motion; propagation is along E × B.",
        "E₀ = cB₀; E_rms = E₀/√2.",
      ],
    },
    {
      heading: "Energy, intensity and momentum",
      points: [
        "Energy density u = ½ε₀E² + B²/2μ₀, shared equally between the fields; average u = ½ε₀E₀².",
        "Intensity I = average u × c = ½cε₀E₀².",
        "Momentum carried by energy U is U/c.",
        "Radiation pressure (normal incidence): I/c if absorbed, 2I/c if perfectly reflected.",
        "At angle θ: absorbing surface pressure (I/c)cos²θ; perfect reflector 2(I/c)cos²θ; pulse of energy U reflected gives momentum 2U cosθ/c.",
        "Force on a small absorbing sphere in a beam = I πR²/c.",
      ],
    },
    {
      heading: "Electromagnetic spectrum (rising frequency)",
      points: [
        "Radio: oscillating circuits; broadcasting and communication.",
        "Microwave: klystron, magnetron; radar, ovens, satellite links.",
        "Infrared: hot bodies; remote controls, night vision, greenhouse effect.",
        "Visible: about 400–700 nm; detected by the eye.",
        "Ultraviolet: Sun, arcs; sterilisation; mostly absorbed by stratospheric ozone.",
        "X-rays: Coolidge tube; medical imaging, crystal structure.",
        "Gamma rays: nuclear decay; cancer therapy, food sterilisation.",
      ],
    },
    {
      heading: "Photons and photoelectric effect",
      points: [
        "Photon energy E = hf = hc/λ; E(eV) ≈ 1240/λ(nm); momentum p = h/λ = E/c.",
        "Einstein: K_max = hf − φ = eV₀; φ = hf₀ (threshold frequency).",
        "K_max and V₀ depend on frequency, not intensity; photocurrent ∝ intensity; emission is instantaneous.",
        "Current flows even at zero collector potential because electrons leave with kinetic energy; it stops at −V₀.",
        "Below the threshold frequency no electrons are emitted, however intense the light.",
      ],
    },
    {
      heading: "Matter waves",
      points: [
        "de Broglie: λ = h/p = h/mv = h/√(2mK) = h/√(2mqV).",
        "Electron accelerated through V volts: λ ≈ 12.27/√V Å.",
        "Same accelerating voltage: λ ∝ 1/√(mq); same kinetic energy: λ ∝ 1/√m.",
        "Thermal particle at temperature T: λ = h/√(3mkT).",
        "Davisson–Germer (1927): 54 V electrons on nickel, strong peak at 50°, λ ≈ 1.65 Å, confirming electron waves.",
      ],
    },
  ],
  formulas: [
    "c = 1/√(μ₀ε₀); E₀ = cB₀; I = ½cε₀E₀²",
    "P_rad = I/c (absorbed), 2I/c (reflected)",
    "eV₀ = hf − φ; E(eV) = 1240/λ(nm)",
    "λ = h/√(2mK); λ_electron = 12.27/√V Å",
  ],
  traps: [
    "Increasing intensity does not raise stopping potential; only frequency does.",
    "Energy density is shared equally between E and B even though E₀ = cB₀ looks larger.",
    "Order of the spectrum by wavelength is the reverse of the order by frequency.",
    "For oblique incidence, pressure uses cos²θ (area spreads and only the normal component counts).",
    "A photon's de Broglie formula uses p = E/c, not √(2mK).",
  ],
  examTips: [
    "NEET asks spectrum uses, photoelectric graphs and de Broglie ratios almost every year.",
    "JEE Main tests intensity–field conversions, radiation pressure and displacement current.",
    "Match-the-scientist and statement-count questions cover Maxwell, Hertz, Einstein and Davisson–Germer.",
  ],
};

export default notes;

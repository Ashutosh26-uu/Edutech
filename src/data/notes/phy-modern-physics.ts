import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Photons and the photoelectric effect",
      points: [
        "Photon energy E = hν = hc/λ; hc ≈ 12400 eV·Å; momentum p = h/λ.",
        "Einstein: K_max = hν − φ = eV₀; emission needs ν ≥ threshold ν₀ = φ/h.",
        "Intensity controls the number of electrons (saturation current), not K_max.",
        "Stopping potential depends on frequency and metal, not on intensity.",
        "Emission is instantaneous: no time lag even for dim light.",
      ],
    },
    {
      heading: "Matter waves and atoms",
      points: [
        "de Broglie λ = h/p = h/√(2mK); electron through V volts: λ = 12.27/√V Å.",
        "Same K: lighter particle has longer λ; same V: λ ∝ 1/√(mq).",
        "Bohr postulates: angular momentum mvr = nh/2π; radiation only on jumps, hν = E₂ − E₁.",
        "Hydrogen-like: E_n = −13.6 Z²/n² eV, r_n = 0.529 n²/Z Å, v_n = 2.18 × 10⁶ Z/n m/s.",
        "Series: Lyman (to n = 1, UV), Balmer (to 2, visible), Paschen (to 3), Brackett (4), Pfund (5) — last three infrared.",
        "Lines from level n down to ground: n(n − 1)/2.",
        "X-rays: λ_min = hc/eV (cut-off, independent of target); characteristic lines depend on target.",
      ],
    },
    {
      heading: "Nucleus",
      points: [
        "R = R₀A^(1/3), R₀ ≈ 1.2 fm; nuclear density is the same for all nuclei.",
        "Mass defect Δm; binding energy = Δm × 931.5 MeV (1 u ≈ 931.5 MeV).",
        "BE per nucleon peaks near A ≈ 56–62 (iron region, about 8.8 MeV); fission of heavy and fusion of light nuclei both release energy.",
        "Isotopes: same Z; isobars: same A; isotones: same N.",
        "α-decay: A − 4, Z − 2; β⁻: Z + 1 (n → p + e⁻ + antineutrino); γ: no change in A or Z.",
        "Chain U-238 → Pb-206: 8 α and 6 β⁻.",
        "Alpha from nucleus at rest takes most of Q: K_α = Q(A − 4)/A.",
      ],
    },
    {
      heading: "Radioactivity",
      points: [
        "N = N₀e^(−λt); activity A = λN, unit becquerel (1 Ci = 3.7 × 10¹⁰ Bq).",
        "After n half-lives N = N₀/2ⁿ.",
        "Two decay modes in parallel: λ = λ₁ + λ₂, so 1/T = 1/T₁ + 1/T₂.",
      ],
    },
    {
      heading: "Semiconductors and devices",
      points: [
        "Intrinsic: nₑ = nₕ; n-type doped with pentavalent (P, As), p-type with trivalent (B, Al, In).",
        "Forward bias narrows the depletion layer; Si diode drop ≈ 0.7 V, Ge ≈ 0.3 V.",
        "Zener diode in reverse breakdown is used as a voltage regulator.",
        "Half-wave rectifier output frequency = input; full-wave = twice input.",
        "Transistor: I_E = I_B + I_C, β = I_C/I_B, α = I_C/I_E, β = α/(1 − α).",
        "NAND and NOR are universal gates; XOR outputs 1 when inputs differ.",
      ],
    },
  ],
  formulas: [
    "E (eV) = 12400/λ (Å)",
    "λ_electron = 12.27/√V Å",
    "1/λ = RZ²(1/n₁² − 1/n₂²), R ≈ 1.097 × 10⁷ m⁻¹",
    "T₁/₂ = 0.693/λ; mean life τ = 1/λ = 1.44 T₁/₂",
    "Half-wave average output V₀/π; full-wave 2V₀/π",
    "Bohr: T ∝ n³/Z², orbital current ∝ Z²/n³",
  ],
  traps: [
    "Doubling intensity doubles the photocurrent, but K_max and stopping potential stay the same.",
    "Bohr energy is negative; the ionisation energy of hydrogen is +13.6 eV.",
    "β⁻ decay does not change A; only α changes A (by 4).",
    "Doubling X-ray tube voltage halves λ_min but does not shift characteristic lines.",
    "Half-wave average is V₀/π with V₀ the peak, not the rms value.",
  ],
  examTips: [
    "NEET asks one question each from photoelectric effect, Bohr model, radioactivity, nuclear binding and semiconductors.",
    "JEE Main adds He⁺ and Li²⁺ comparisons, recoil in α-decay, and diode circuits.",
    "Logic-gate truth tables and rectifier outputs are near-certain short questions.",
  ],
};

export default notes;

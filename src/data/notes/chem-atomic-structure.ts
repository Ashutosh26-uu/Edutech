import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Early models",
      points: [
        "Thomson measured e/m of the electron; Millikan's oil-drop gave e = 1.602 × 10⁻¹⁹ C; Chadwick found the neutron (1932).",
        "Rutherford's α-scattering: most of the atom is empty, a tiny dense positive nucleus; model failed to explain stability and line spectra.",
        "Isotopes: same Z; isobars: same mass number; isotones: same neutrons; isoelectronic: same electrons.",
        "Planck: E = hν; photoelectric effect: hν = hν₀ + ½mv²; below threshold frequency no electron is emitted, whatever the intensity.",
      ],
    },
    {
      heading: "Bohr model and hydrogen spectrum",
      points: [
        "Angular momentum mvr = nh/2π; electron does not radiate in a stationary orbit.",
        "Energy, radius and speed depend on Z and n (see formulas); valid only for one-electron species (H, He⁺, Li²⁺).",
        "Lyman n₁ = 1 (UV), Balmer n₁ = 2 (visible), Paschen 3, Brackett 4, Pfund 5 (IR).",
        "First line of a series: n₂ = n₁ + 1 (longest λ); series limit: n₂ = ∞ (shortest λ).",
        "Same λ in another species: match Z²(1/n₁² − 1/n₂²); Li²⁺ 3→6 equals H 1→2.",
        "Electron speed in H first orbit ≈ 2.18 × 10⁶ m/s, about c/137.",
      ],
    },
    {
      heading: "Quantum mechanical model",
      points: [
        "de Broglie: every moving particle has λ = h/mv; significant only for micro particles.",
        "Heisenberg: position and momentum cannot both be known exactly; Δx·mΔv ≥ h/4π.",
        "n (shell, 1, 2, 3…), l (0 to n − 1: s, p, d, f), m (−l to +l), s (+½ or −½).",
        "Orbital angular momentum = √(l(l + 1)) h/2π: s = 0, p = √2 ħ, d = √6 ħ.",
        "In H, energy depends only on n (3s = 3p = 3d); in multi-electron atoms on n + l.",
        "Aufbau (n + l rule, lower n first on tie), Pauli exclusion (no two electrons with all four numbers same), Hund's rule (pair only after singly filling).",
        "Exceptions with one 4s/5s electron: Cr, Cu, Mo, Ag (also Nb, Ru); Pd is 4d¹⁰ 5s⁰.",
      ],
    },
  ],
  formulas: [
    "Eₙ = −13.6 Z²/n² eV = −2.18 × 10⁻¹⁸ Z²/n² J.",
    "rₙ = 0.529 n²/Z Å; vₙ = 2.18 × 10⁶ Z/n m/s.",
    "1/λ = R Z²(1/n₁² − 1/n₂²), R = 1.097 × 10⁷ m⁻¹.",
    "Lines from level n to ground = n(n − 1)/2; between n₂ and n₁ = (n₂ − n₁)(n₂ − n₁ + 1)/2.",
    "E (eV) = 1240/λ (nm); electron λ = 12.27/√V Å.",
    "Nodes: radial = n − l − 1, angular = l, total = n − 1; orbitals per shell n², electrons 2n².",
    "Spin-only μ = √(n(n + 2)) BM, n = unpaired electrons.",
  ],
  traps: [
    "Energy is negative; 'higher energy' level means less negative value.",
    "Uncertainty in velocity needs division by mass: Δv = h/(4πmΔx).",
    "3s, 3p, 3d are degenerate in hydrogen but not in lithium or other multi-electron atoms.",
    "Intensity of light changes the number of photoelectrons, not their maximum KE.",
    "Radial nodes of 2p = 0 and of 3s = 2; do not use n − 1 for radial nodes.",
  ],
  examTips: [
    "JEE Main asks Bohr numericals (energy, radius, wavelength ratios) and photoelectric threshold problems.",
    "NEET favours quantum-number validity, node counts and the spectral series region.",
    "Configuration exceptions in 4d metals appear in JEE statement-counting questions.",
  ],
};

export default notes;

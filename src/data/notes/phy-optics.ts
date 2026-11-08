import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Mirrors",
      points: [
        "Cartesian convention: distances measured from the pole; along incident light positive.",
        "1/v + 1/u = 1/f, f = R/2; magnification m = −v/u (negative m means real and inverted).",
        "Concave mirror: object beyond C gives a real diminished image; between F and P a virtual enlarged one.",
        "Convex mirror always gives a virtual, erect, diminished image; used as a rear-view mirror.",
        "Plane mirror rotated by θ turns the reflected ray by 2θ.",
      ],
    },
    {
      heading: "Refraction and TIR",
      points: [
        "Snell's law n₁ sin i = n₂ sin r; n = c/v; frequency stays the same, wavelength changes.",
        "Ray from denser to rarer bends away from the normal.",
        "Apparent depth = real depth/n; normal shift through a slab = t(1 − 1/n).",
        "Critical angle sin C = n_rarer/n_denser; TIR needs denser-to-rarer travel and i > C.",
        "Source at depth h: light escapes through a circle of radius h/√(n² − 1).",
        "Optical fibre works by TIR at the core–cladding boundary (core n higher).",
        "Single surface: n₂/v − n₁/u = (n₂ − n₁)/R.",
      ],
    },
    {
      heading: "Lenses, prisms and instruments",
      points: [
        "Lens formula 1/v − 1/u = 1/f; m = v/u; power P = 1/f (f in metres), dioptre.",
        "Lens maker: 1/f = (n_rel − 1)(1/R₁ − 1/R₂); a glass lens in water has a longer focal length.",
        "Lenses in contact: P = P₁ + P₂; cutting a lens perpendicular to its axis doubles each half's f.",
        "Prism: A + δ = i + e; at minimum deviation i = e and r = A/2.",
        "Thin prism δ = (n − 1)A; dispersion (n_v − n_r)A; violet deviates most.",
        "Myopia: concave lens; hypermetropia: convex lens; presbyopia: bifocal; astigmatism: cylindrical lens.",
        "Compound microscope: M ≈ (L/f_o)(D/f_e); telescope objective has large aperture and long f.",
      ],
    },
    {
      heading: "Wave optics",
      points: [
        "Huygens: every point on a wavefront is a source of secondary wavelets.",
        "YDSE: path difference d sin θ ≈ yd/D; bright at nλ, dark at (n + ½)λ; fringe width β = λD/d.",
        "Whole apparatus in a liquid of index n: β becomes β/n.",
        "Thin slab (thickness t) in one slit shifts the pattern by (n − 1)tD/d towards that slit.",
        "Resultant intensity I = I₁ + I₂ + 2√(I₁I₂) cos φ.",
        "Single slit: minima at a sin θ = nλ; central maximum twice as wide as the others.",
        "Resolving power: limiting angle ≈ 1.22λ/D for a circular aperture.",
        "Polarisation proves light is transverse; Malus I = I₀ cos² θ; unpolarised light through a polaroid halves.",
        "Brewster: tan i_p = n; reflected and refracted rays are at 90°, reflected light fully polarised.",
      ],
    },
  ],
  formulas: [
    "Mirror 1/v + 1/u = 1/f; lens 1/v − 1/u = 1/f",
    "n = sin((A + δ_min)/2)/sin(A/2)",
    "Telescope (normal adjustment) M = f_o/f_e, length f_o + f_e",
    "Simple microscope M = 1 + D/f (near point), D/f (relaxed); D = 25 cm",
    "β = λD/d; I_max/I_min = ((√I₁ + √I₂)/(√I₁ − √I₂))²",
    "Single slit central width = 2λD/a",
  ],
  traps: [
    "Lens and mirror formulas have opposite signs on 1/u; do not mix them.",
    "Focal length of a mirror does not change in water; a lens's does.",
    "Plano-convex half from cutting perpendicular to the axis has f = 2f; cutting along the axis keeps f.",
    "Light reflected at Brewster's angle is polarised perpendicular to the plane of incidence; check the polaroid orientation.",
    "In YDSE, use amplitude ratio (√ of intensity ratio) when finding I_max/I_min.",
  ],
  examTips: [
    "NEET asks mirror/lens image nature, prism minimum deviation, eye defects and YDSE fringe width.",
    "JEE Main adds lens–mirror combinations, TIR with prisms, slab shifts in YDSE and Brewster–Malus chains.",
    "Match-the-column questions on object position versus image nature appear often.",
  ],
};

export default notes;

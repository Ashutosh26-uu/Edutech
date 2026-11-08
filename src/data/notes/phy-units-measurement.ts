import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "SI units",
      points: [
        "Seven base units: metre, kilogram, second, ampere, kelvin, mole, candela; radian and steradian are dimensionless.",
        "Light year and parsec are units of length; pascal = N/m² = [ML⁻¹T⁻²]; tesla = Wb/m².",
        "Pure numbers and ratios (strain, angle, refractive index, Reynolds number) have no dimensions.",
      ],
    },
    {
      heading: "Dimensions and their uses",
      points: [
        "Principle of homogeneity: every added or equated term must have the same dimensions; arguments of sin, log, exp are dimensionless.",
        "Check equations, convert units and derive relations (assume Q = k aˣ bʸ cᶻ, equate powers of M, L, T).",
        "Example: a period depending only on density gives T ∝ (Gρ)^(−1/2).",
        "Limits: cannot find constants like 2π, cannot handle sums of terms or trigonometric/exponential relations, fails with more than three unknown powers in M, L, T.",
        "Unit conversion: n₂ = n₁ (M₁/M₂)ᵃ (L₁/L₂)ᵇ (T₁/T₂)ᶜ for a quantity [MᵃLᵇTᶜ].",
        "Useful combinations: GM/c² is a length; h/e has the dimensions of magnetic flux; ε₀ dΦ/dt (e.g. ε₀L·ΔV/Δt) is a current; RC and L/R are times; 1/√(μ₀ε₀) is a speed.",
      ],
    },
    {
      heading: "Errors",
      points: [
        "Absolute error = |true − measured|; mean absolute error = average of the absolute errors; relative error = Δa/a; percentage = relative × 100.",
        "Sum or difference: absolute errors add (ΔZ = ΔA + ΔB).",
        "Product or quotient: relative errors add; for Z = AᵖBᑫ/Cʳ, ΔZ/Z = pΔA/A + qΔB/B + rΔC/C.",
        "The quantity with the highest power contributes most error, so measure it most carefully.",
        "Systematic errors (zero error, faulty calibration) push readings one way; random errors shrink by averaging many readings.",
      ],
    },
    {
      heading: "Significant figures",
      points: [
        "All non-zero digits are significant; zeros between them are significant; leading zeros are not.",
        "Trailing zeros after a decimal point count; trailing zeros in a whole number without a decimal point are ambiguous (use powers of ten).",
        "Multiplication/division: answer keeps the fewest significant figures; addition/subtraction: the fewest decimal places.",
        "Rounding: drop digits less than 5, raise for more than 5; for exactly 5 make the previous digit even.",
      ],
    },
    {
      heading: "Instruments and experiments",
      points: [
        "Vernier callipers: LC = 1 MSD − 1 VSD; reading = main scale + (coinciding vernier division × LC).",
        "Screw gauge: pitch = linear distance per rotation; LC = pitch/number of circular divisions.",
        "Zero error is positive when the instrument reads above zero with the jaws closed; corrected reading = observed − zero error (with sign).",
        "In lab-based questions plot the linear form (e.g. ln A against t for damping, 1/v against 1/u for lenses) and read the slope.",
      ],
    },
  ],
  formulas: [
    "Force [MLT⁻²]; energy [ML²T⁻²]; power [ML²T⁻³]; pressure, stress, energy density [ML⁻¹T⁻²]",
    "h and angular momentum [ML²T⁻¹]; G [M⁻¹L³T⁻²]; η [ML⁻¹T⁻¹]; surface tension [MT⁻²]",
    "ε₀ [M⁻¹L⁻³T⁴A²]; μ₀ [MLT⁻²A⁻²]; B [MT⁻²A⁻¹]; flux [ML²T⁻²A⁻¹]",
    "Voltage [ML²T⁻³A⁻¹]; resistance [ML²T⁻³A⁻²]; capacitance [M⁻¹L⁻²T⁴A²]; inductance [ML²T⁻²A⁻²]",
  ],
  traps: [
    "Errors never subtract: for A − B the absolute errors still add.",
    "Dimensional correctness does not prove an equation is right (constants may be wrong).",
    "Subtracting a negative zero error means adding it to the observed reading.",
    "0.00450 has three significant figures, not five.",
    "Same dimensions do not mean same quantity: torque and energy share [ML²T⁻²].",
  ],
  examTips: [
    "NEET asks dimension matching and percentage error almost every year; JEE Main adds unit-system conversion.",
    "Instrument readings with zero error and least count are frequent in both exams.",
    "JEE Main 'experimental skills' statements (method of mixtures, lens u–v, diode curves) are counted with this topic.",
  ],
};

export default notes;

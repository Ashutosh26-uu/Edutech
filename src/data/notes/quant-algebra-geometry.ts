import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Algebraic identities",
      points: [
        "(a + b)² − (a − b)² = 4ab; (a + b)² + (a − b)² = 2(a² + b²)",
        "a³ + b³ = (a + b)³ − 3ab(a + b); a³ − b³ = (a − b)³ + 3ab(a − b)",
        "a³ + b³ + c³ − 3abc = (a + b + c)(a² + b² + c² − ab − bc − ca)",
        "If a + b + c = 0: a³ + b³ + c³ = 3abc and a²/bc + b²/ca + c²/ab = 3",
        "(a + b + c)² = a² + b² + c² + 2(ab + bc + ca)",
        "Remainder theorem: p(x) ÷ (x − a) leaves remainder p(a)",
      ],
    },
    {
      heading: "x + 1/x shortcuts",
      points: [
        "x + 1/x = k ⇒ x² + 1/x² = k² − 2, x³ + 1/x³ = k³ − 3k, x⁴ + 1/x⁴ = (k² − 2)² − 2",
        "x − 1/x = k ⇒ x² + 1/x² = k² + 2, x³ − 1/x³ = k³ + 3k",
        "x⁵ + 1/x⁵ = (x² + 1/x²)(x³ + 1/x³) − (x + 1/x)",
        "x² − kx + 1 = 0 ⇒ divide by x to get x + 1/x = k",
        "x = 2 + √3 ⇒ 1/x = 2 − √3, so x + 1/x = 4; same idea for √3 + √2",
        "x + 1/x = 1 ⇒ x³ = −1, so x³ + 1/x³ = −2; x + 1/x = 2 ⇒ x = 1",
      ],
    },
    {
      heading: "Triangles and polygons",
      points: [
        "Interior angle sum = (n − 2) × 180°; each exterior angle of a regular polygon = 360°/n",
        "Triangle inequality: sum of any two sides > third side",
        "Incentre I: ∠BIC = 90° + A/2, always inside; circumcentre O: ∠BOC = 2A (acute triangle)",
        "Orthocentre H: ∠BHC = 180° − A; in a right triangle H is at the right-angle vertex and O at the mid-point of the hypotenuse",
        "Centroid divides each median 2 : 1 from the vertex",
        "Angle bisector theorem: BD/DC = AB/AC",
        "Right triangle: circumradius R = hypotenuse/2, inradius r = (a + b − c)/2; median to hypotenuse = half the hypotenuse",
        "Heron: area = √[s(s − a)(s − b)(s − c)], s = half the perimeter; altitude = 2 × area/base",
      ],
    },
    {
      heading: "Circles",
      points: [
        "Angle at the centre = 2 × angle at the circumference on the same arc",
        "Angles in the same segment are equal; angle in a semicircle = 90°",
        "Opposite angles of a cyclic quadrilateral sum to 180°",
        "Tangents from an external point are equal; tangent ⟂ radius at the point of contact",
        "Tangent–secant: PT² = PA × PB; alternate segment: angle between tangent and chord = angle in the alternate segment",
      ],
    },
    {
      heading: "Trigonometry and heights",
      points: [
        "sin²θ + cos²θ = 1; sec²θ − tan²θ = 1; cosec²θ − cot²θ = 1",
        "sec θ − tan θ = 1/(sec θ + tan θ); cosec θ − cot θ = 1/(cosec θ + cot θ)",
        "sin⁶θ + cos⁶θ = 1 − 3sin²θcos²θ; sin⁴θ + cos⁴θ = 1 − 2sin²θcos²θ",
        "Min of a tan²θ + b cot²θ = 2√(ab) (AM ≥ GM)",
        "Values: sin 30° = 1/2, sin 45° = 1/√2, sin 60° = √3/2; tan 30° = 1/√3, tan 45° = 1, tan 60° = √3",
        "Heights: tan(angle) = height/horizontal distance; angle of depression from the top equals angle of elevation from below",
      ],
    },
  ],
  formulas: [
    "Area cut by line ax + by = c with axes = c²/(2|ab|)",
    "Median to side a: mₐ = ½√(2b² + 2c² − a²)",
  ],
  traps: [
    "Using k² − 2 for x − 1/x; it becomes k² + 2",
    "Taking ∠BOC = 2A for an obtuse angle A; the formula holds for acute triangles",
    "Measuring height from the ground when the observer's eye level is given",
    "Using PA × AB instead of PA × PB (PB = PA + AB) in the tangent–secant rule",
    "Forgetting the triangle inequality when counting integer-sided triangles",
  ],
  examTips: [
    "SSC CGL Tier 1/2 and CHSL ask several 'advance maths' questions per paper; x + 1/x and triangle centres are the most repeated",
    "Trigonometric value questions often reduce to standard angles; substitute θ = 45° or 30° to check options quickly",
    "CDS and NDA include heights and distances with two angles of depression; draw the figure first",
  ],
  hi: {
    sections: [
      {
        heading: "बीजगणितीय सर्वसमिकाएँ",
        points: [
          "(a + b)² − (a − b)² = 4ab; (a + b)² + (a − b)² = 2(a² + b²)",
          "a³ + b³ = (a + b)³ − 3ab(a + b); a³ − b³ = (a − b)³ + 3ab(a − b)",
          "a³ + b³ + c³ − 3abc = (a + b + c)(a² + b² + c² − ab − bc − ca)",
          "यदि a + b + c = 0: a³ + b³ + c³ = 3abc तथा a²/bc + b²/ca + c²/ab = 3",
          "(a + b + c)² = a² + b² + c² + 2(ab + bc + ca)",
          "शेषफल प्रमेय: p(x) ÷ (x − a) करने पर शेषफल p(a) होता है",
        ],
      },
      {
        heading: "x + 1/x के शॉर्टकट",
        points: [
          "x + 1/x = k ⇒ x² + 1/x² = k² − 2, x³ + 1/x³ = k³ − 3k, x⁴ + 1/x⁴ = (k² − 2)² − 2",
          "x − 1/x = k ⇒ x² + 1/x² = k² + 2, x³ − 1/x³ = k³ + 3k",
          "x⁵ + 1/x⁵ = (x² + 1/x²)(x³ + 1/x³) − (x + 1/x)",
          "x² − kx + 1 = 0 ⇒ x से भाग देने पर x + 1/x = k मिलता है",
          "x = 2 + √3 ⇒ 1/x = 2 − √3, अतः x + 1/x = 4; √3 + √2 के लिए भी यही विधि है",
          "x + 1/x = 1 ⇒ x³ = −1, अतः x³ + 1/x³ = −2; x + 1/x = 2 ⇒ x = 1",
        ],
      },
      {
        heading: "त्रिभुज और बहुभुज",
        points: [
          "आंतरिक कोणों का योग = (n − 2) × 180°; सम बहुभुज का प्रत्येक बाह्य कोण = 360°/n",
          "त्रिभुज असमिका: किन्हीं दो भुजाओं का योग तीसरी भुजा से अधिक होता है",
          "अंतःकेंद्र I: ∠BIC = 90° + A/2, यह सदैव त्रिभुज के अंदर होता है; परिकेंद्र O: ∠BOC = 2A (न्यूनकोण त्रिभुज में)",
          "लंबकेंद्र H: ∠BHC = 180° − A; समकोण त्रिभुज में H समकोण वाले शीर्ष पर तथा O कर्ण के मध्य-बिंदु पर होता है",
          "केंद्रक (centroid) प्रत्येक माध्यिका को शीर्ष से 2 : 1 के अनुपात में बाँटता है",
          "कोण-समद्विभाजक प्रमेय: BD/DC = AB/AC",
          "समकोण त्रिभुज: परिकेंद्र की त्रिज्या R = कर्ण/2, अंतःत्रिज्या r = (a + b − c)/2; कर्ण पर माध्यिका = कर्ण का आधा",
          "हीरोन: क्षेत्रफल = √[s(s − a)(s − b)(s − c)], s = परिमाप का आधा; शीर्षलंब = 2 × क्षेत्रफल/आधार",
        ],
      },
      {
        heading: "वृत्त",
        points: [
          "केंद्र पर बना कोण = उसी चाप द्वारा परिधि पर बने कोण का 2 गुना",
          "एक ही वृत्तखंड के कोण बराबर होते हैं; अर्धवृत्त में बना कोण = 90°",
          "चक्रीय चतुर्भुज के सम्मुख कोणों का योग 180° होता है",
          "बाह्य बिंदु से खींची गई स्पर्श रेखाएँ बराबर होती हैं; स्पर्श बिंदु पर स्पर्श रेखा ⟂ त्रिज्या",
          "स्पर्श रेखा–छेदक रेखा: PT² = PA × PB; एकांतर खंड: स्पर्श रेखा और जीवा के बीच का कोण = एकांतर खंड में बना कोण",
        ],
      },
      {
        heading: "त्रिकोणमिति और ऊँचाई",
        points: [
          "sin²θ + cos²θ = 1; sec²θ − tan²θ = 1; cosec²θ − cot²θ = 1",
          "sec θ − tan θ = 1/(sec θ + tan θ); cosec θ − cot θ = 1/(cosec θ + cot θ)",
          "sin⁶θ + cos⁶θ = 1 − 3sin²θcos²θ; sin⁴θ + cos⁴θ = 1 − 2sin²θcos²θ",
          "a tan²θ + b cot²θ का न्यूनतम मान = 2√(ab) (AM ≥ GM)",
          "मान: sin 30° = 1/2, sin 45° = 1/√2, sin 60° = √3/2; tan 30° = 1/√3, tan 45° = 1, tan 60° = √3",
          "ऊँचाई: tan(कोण) = ऊँचाई/क्षैतिज दूरी; शीर्ष से अवनमन कोण नीचे से उन्नयन कोण के बराबर होता है",
        ],
      },
    ],
    formulas: [
      "रेखा ax + by = c तथा अक्षों से कटा क्षेत्रफल = c²/(2|ab|)",
      "भुजा a पर माध्यिका: mₐ = ½√(2b² + 2c² − a²)",
    ],
    traps: [
      "x − 1/x के लिए k² − 2 का प्रयोग करना; यह k² + 2 हो जाता है",
      "अधिक कोण A के लिए ∠BOC = 2A मान लेना; यह सूत्र न्यूनकोण त्रिभुजों में ही लागू होता है",
      "प्रेक्षक की आँख की ऊँचाई दी होने पर भी ऊँचाई जमीन से नापना",
      "स्पर्श रेखा–छेदक रेखा नियम में PA × PB (PB = PA + AB) की जगह PA × AB लेना",
      "पूर्णांक भुजाओं वाले त्रिभुज गिनते समय त्रिभुज असमिका भूल जाना",
    ],
    examTips: [
      "SSC CGL Tier 1/2 और CHSL के प्रत्येक पेपर में कई 'एडवांस मैथ्स' प्रश्न आते हैं; x + 1/x और त्रिभुज के केंद्र सबसे अधिक दोहराए जाते हैं",
      "त्रिकोणमितीय मान वाले प्रश्न प्रायः मानक कोणों तक सिमट जाते हैं; विकल्पों को जल्दी जाँचने के लिए θ = 45° या 30° रखकर देखें",
      "CDS और NDA में दो अवनमन कोणों वाले ऊँचाई और दूरी के प्रश्न आते हैं; पहले आकृति बनाएँ",
    ],
  },
};

export default notes;

import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Triangles and quadrilaterals",
      points: [
        "Triangle area = ½ × base × height; Heron's: √(s(s − a)(s − b)(s − c)), s = (a + b + c)/2.",
        "Equilateral triangle of side a: area = (√3/4)a², height = (√3/2)a.",
        "Rectangle: area lb, perimeter 2(l + b), diagonal √(l² + b²).",
        "Square: area a² = d²/2, diagonal a√2.",
        "Rhombus: area = ½d₁d₂; side = √((d₁/2)² + (d₂/2)²).",
        "Parallelogram: base × height; trapezium: ½(sum of parallel sides) × height.",
      ],
    },
    {
      heading: "Circles",
      points: [
        "Area πr², circumference 2πr; semicircle perimeter = πr + 2r.",
        "Sector of angle θ: area = (θ/360)πr², arc length = (θ/360)2πr.",
        "Largest circle in a square of side a has r = a/2; circle around a square has r = a/√2.",
        "Distance covered by a wheel in one revolution = its circumference.",
      ],
    },
    {
      heading: "Cuboid, cube and cylinder",
      points: [
        "Cuboid: V = lbh, TSA = 2(lb + bh + hl), diagonal √(l² + b² + h²).",
        "Cube: V = a³, TSA = 6a², LSA = 4a², diagonal a√3.",
        "Cylinder: V = πr²h, CSA = 2πrh, TSA = 2πr(r + h).",
        "Hollow cylinder: V = π(R² − r²)h.",
      ],
    },
    {
      heading: "Cone, sphere, hemisphere",
      points: [
        "Cone: V = ⅓πr²h, slant l = √(r² + h²), CSA = πrl, TSA = πr(l + r).",
        "Sphere: V = ⁴⁄₃πr³, SA = 4πr².",
        "Hemisphere: V = ⅔πr³, CSA = 2πr², TSA = 3πr².",
        "Cone cut parallel to base at half height: small cone volume = 1/8 of the original.",
      ],
    },
    {
      heading: "Scaling and recasting",
      points: [
        "Lengths × k ⇒ areas × k², volumes × k³.",
        "Radius up x% ⇒ circle area up (2x + x²/100)%.",
        "Melting and recasting keeps volume constant: number of small solids = big volume ÷ small volume.",
        "Solid dropped in water: rise in level × base area of vessel = volume of solid.",
        "Canvas or sheet length = area needed ÷ width of the material.",
      ],
    },
  ],
  formulas: [
    "Equilateral triangle area = (√3/4)a²",
    "Cylinder V = πr²h; cone V = ⅓πr²h; sphere V = ⁴⁄₃πr³",
    "Cone slant l = √(r² + h²)",
    "Hemisphere TSA = 3πr²",
    "1 m³ = 1000 L; 1 hectare = 10,000 m²",
  ],
  traps: [
    "Use the slant height, not vertical height, for a cone's curved surface area.",
    "Hemisphere TSA (solid) is 3πr², but a hollow bowl has only 2πr².",
    "Diameter given? Halve it before using r.",
    "Keep units the same (cm vs m) before computing area or volume.",
    "Doubling the radius makes volume 8 times, not 2 times.",
  ],
  examTips: [
    "Appears in SSC CGL/CHSL, railway and placement tests; 2D in easier papers, 3D solids in tougher ones.",
    "Common: recasting solids, water level rise, tent canvas, inscribed circles, % change in area.",
    "Pick π = 22/7 when the radius is a multiple of 7; options are usually clean numbers.",
  ],
  hi: {
    sections: [
      {
        heading: "त्रिभुज और चतुर्भुज",
        points: [
          "त्रिभुज का क्षेत्रफल = ½ × आधार × ऊँचाई; हीरोन सूत्र: √(s(s − a)(s − b)(s − c)), s = (a + b + c)/2।",
          "भुजा a वाले समबाहु त्रिभुज का क्षेत्रफल = (√3/4)a², ऊँचाई = (√3/2)a।",
          "आयत: क्षेत्रफल lb, परिमाप 2(l + b), विकर्ण √(l² + b²)।",
          "वर्ग: क्षेत्रफल a² = d²/2, विकर्ण a√2।",
          "समचतुर्भुज: क्षेत्रफल = ½d₁d₂; भुजा = √((d₁/2)² + (d₂/2)²)।",
          "समांतर चतुर्भुज: आधार × ऊँचाई; समलंब चतुर्भुज: ½(समांतर भुजाओं का योग) × ऊँचाई।",
        ],
      },
      {
        heading: "वृत्त",
        points: [
          "क्षेत्रफल πr², परिधि 2πr; अर्धवृत्त का परिमाप = πr + 2r।",
          "कोण θ वाले त्रिज्यखंड का क्षेत्रफल = (θ/360)πr², चाप की लंबाई = (θ/360)2πr।",
          "भुजा a वाले वर्ग में बने सबसे बड़े वृत्त की त्रिज्या r = a/2; वर्ग के परिगत वृत्त की त्रिज्या r = a/√2।",
          "पहिये द्वारा एक चक्कर में तय की गई दूरी = उसकी परिधि।",
        ],
      },
      {
        heading: "घनाभ, घन और बेलन",
        points: [
          "घनाभ: V = lbh, TSA = 2(lb + bh + hl), विकर्ण √(l² + b² + h²)।",
          "घन: V = a³, TSA = 6a², LSA = 4a², विकर्ण a√3।",
          "बेलन: V = πr²h, CSA = 2πrh, TSA = 2πr(r + h)।",
          "खोखला बेलन: V = π(R² − r²)h।",
        ],
      },
      {
        heading: "शंकु, गोला, अर्धगोला",
        points: [
          "शंकु: V = ⅓πr²h, तिर्यक ऊँचाई l = √(r² + h²), CSA = πrl, TSA = πr(l + r)।",
          "गोला: V = ⁴⁄₃πr³, SA = 4πr²।",
          "अर्धगोला: V = ⅔πr³, CSA = 2πr², TSA = 3πr²।",
          "शंकु को आधार के समांतर आधी ऊँचाई पर काटने पर छोटे शंकु का आयतन मूल का 1/8 होता है।",
        ],
      },
      {
        heading: "पैमाना और पुनः ढालना",
        points: [
          "लंबाइयाँ × k ⇒ क्षेत्रफल × k², आयतन × k³।",
          "त्रिज्या x% बढ़ने पर वृत्त का क्षेत्रफल (2x + x²/100)% बढ़ता है।",
          "पिघलाकर पुनः ढालने पर आयतन स्थिर रहता है: छोटे ठोसों की संख्या = बड़ा आयतन ÷ छोटा आयतन।",
          "पानी में ठोस डालने पर: जल-स्तर में वृद्धि × बर्तन के आधार का क्षेत्रफल = ठोस का आयतन।",
          "कैनवास या चादर की लंबाई = आवश्यक क्षेत्रफल ÷ सामग्री की चौड़ाई।",
        ],
      },
    ],
    formulas: [
      "समबाहु त्रिभुज का क्षेत्रफल = (√3/4)a²",
      "बेलन V = πr²h; शंकु V = ⅓πr²h; गोला V = ⁴⁄₃πr³",
      "शंकु की तिर्यक ऊँचाई l = √(r² + h²)",
      "अर्धगोला TSA = 3πr²",
      "1 m³ = 1000 L; 1 हेक्टेयर = 10,000 m²",
    ],
    traps: [
      "शंकु का वक्र पृष्ठीय क्षेत्रफल निकालने में ऊर्ध्वाधर ऊँचाई नहीं, तिर्यक ऊँचाई लें।",
      "ठोस अर्धगोले का TSA 3πr² होता है, पर खोखले कटोरे का केवल 2πr²।",
      "व्यास दिया है? r प्रयोग करने से पहले उसे आधा करें।",
      "क्षेत्रफल या आयतन निकालने से पहले इकाइयाँ एक जैसी करें (cm बनाम m)।",
      "त्रिज्या दोगुनी करने पर आयतन 8 गुना होता है, 2 गुना नहीं।",
    ],
    examTips: [
      "SSC CGL/CHSL, रेलवे और प्लेसमेंट टेस्टों में आता है; आसान पेपरों में 2D, कठिन पेपरों में 3D ठोस।",
      "सामान्य प्रश्न: ठोसों को पुनः ढालना, जल-स्तर में वृद्धि, तंबू का कैनवास, अंतर्गत वृत्त, क्षेत्रफल में % परिवर्तन।",
      "त्रिज्या 7 का गुणज हो तो π = 22/7 लें; विकल्प प्रायः पूर्ण संख्याएँ होते हैं।",
    ],
  },
};

export default notes;

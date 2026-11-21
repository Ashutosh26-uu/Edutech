import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "The Sun and the system",
      points: [
        "The Sun is a G-type main-sequence star, made mostly of hydrogen (about three-quarters) and helium.",
        "Energy comes from nuclear fusion of hydrogen into helium in the core.",
        "Sunlight takes about 8 minutes 20 seconds to reach Earth (average distance about 150 million km = 1 AU).",
        "The Solar System lies in the Orion Arm (Orion Spur) of the Milky Way galaxy.",
        "Eight planets since the IAU’s 2006 definition; Pluto was reclassified as a dwarf planet.",
      ],
    },
    {
      heading: "Planets",
      points: [
        "Order from the Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.",
        "Inner (terrestrial, rocky): Mercury, Venus, Earth, Mars. Outer: Jupiter and Saturn (gas giants), Uranus and Neptune (ice giants).",
        "Mercury: smallest and closest to the Sun; shortest year (about 88 days); no moon.",
        "Venus: hottest planet (thick CO₂ atmosphere, runaway greenhouse effect); rotates east to west (retrograde); no moon; brightest planet in our sky.",
        "Earth: densest planet; only known life. Mars: “Red Planet” (iron oxide); moons Phobos and Deimos; Olympus Mons is the tallest known volcano.",
        "Jupiter: largest planet; fastest rotation (day just under 10 hours); Great Red Spot storm.",
        "Saturn: most prominent rings; least dense (would float in water). All four giant planets have rings.",
        "Uranus: rotates on its side (axial tilt about 98°). Neptune: farthest planet, strongest winds.",
        "Size order: Jupiter > Saturn > Uranus > Neptune > Earth > Venus > Mars > Mercury.",
      ],
    },
    {
      heading: "Moons and small bodies",
      points: [
        "Ganymede (Jupiter) is the largest moon, bigger than Mercury; Titan (Saturn) is second and has a thick nitrogen atmosphere.",
        "Galilean moons of Jupiter (Io, Europa, Ganymede, Callisto) were seen by Galileo in 1610.",
        "Triton (Neptune) orbits backwards (retrograde). Charon is Pluto’s largest moon.",
        "Earth’s Moon is the fifth-largest moon in the Solar System.",
        "Asteroid belt lies between Mars and Jupiter; Ceres is the only dwarf planet in it.",
        "IAU dwarf planets: Ceres, Pluto, Eris, Haumea, Makemake. Pluto lies in the Kuiper Belt.",
        "Comets come from the Kuiper Belt and Oort Cloud; their tails point away from the Sun. Halley’s Comet returns about every 76 years.",
      ],
    },
    {
      heading: "Kepler’s laws",
      points: [
        "First law: planets move in ellipses with the Sun at one focus.",
        "Second law: a line from the Sun to a planet sweeps equal areas in equal times — fastest at perihelion (nearest), slowest at aphelion.",
        "Third law: T² ∝ a³ (T = orbital period, a = mean distance from the Sun).",
      ],
    },
  ],
  formulas: [
    "Kepler III: T² ∝ a³. In Earth units, T (years) = a^(3/2) with a in AU — 4 AU → 8 years.",
    "1 AU ≈ 1.5 × 10⁸ km; light from Sun ≈ 8 min 20 s.",
    "Planet order mnemonic: “My Very Educated Mother Just Served Us Noodles”.",
    "No moons: Mercury and Venus. Mars: 2 moons.",
  ],
  traps: [
    "Venus, not Mercury, is the hottest planet even though Mercury is closer to the Sun.",
    "Saturn is not the only ringed planet — Jupiter, Uranus and Neptune have faint rings.",
    "Ganymede and Titan are larger than Mercury but less massive.",
    "Venus and Uranus rotate “backwards” (east to west); others west to east.",
    "Earth is nearest the Sun (perihelion) in early January, not in summer.",
  ],
  examTips: [
    "SSC and Railways ask superlatives (largest, hottest, fastest, ringed) and planet–moon matching.",
    "UPSC and CDS ask statement questions on dwarf planets, rotation and Kepler’s laws, sometimes with a simple T² ∝ a³ calculation.",
  ],
  hi: {
    sections: [
      {
        heading: "सूर्य और सौरमंडल",
        points: [
          "सूर्य G-प्रकार का मुख्य अनुक्रम तारा है, जो मुख्यतः हाइड्रोजन (लगभग तीन-चौथाई) और हीलियम से बना है।",
          "ऊर्जा क्रोड में हाइड्रोजन के हीलियम में नाभिकीय संलयन से आती है।",
          "सूर्य के प्रकाश को पृथ्वी तक पहुँचने में लगभग 8 मिनट 20 सेकंड लगते हैं (औसत दूरी लगभग 15 करोड़ km = 1 AU)।",
          "सौरमंडल मिल्की वे आकाशगंगा की ओरायन भुजा (ओरायन स्पर) में स्थित है।",
          "IAU की 2006 की परिभाषा के बाद से आठ ग्रह हैं; प्लूटो को बौना ग्रह के रूप में पुनर्वर्गीकृत किया गया।",
        ],
      },
      {
        heading: "ग्रह",
        points: [
          "सूर्य से क्रम: बुध, शुक्र, पृथ्वी, मंगल, बृहस्पति, शनि, अरुण, वरुण।",
          "आंतरिक (स्थलीय, चट्टानी): बुध, शुक्र, पृथ्वी, मंगल। बाह्य: बृहस्पति और शनि (गैस दानव), अरुण और वरुण (हिम दानव)।",
          "बुध: सबसे छोटा और सूर्य के सबसे निकट; सबसे छोटा वर्ष (लगभग 88 दिन); कोई चंद्रमा नहीं।",
          "शुक्र: सबसे गर्म ग्रह (मोटा CO₂ वायुमंडल, अनियंत्रित ग्रीनहाउस प्रभाव); पूर्व से पश्चिम घूमता है (वक्री); कोई चंद्रमा नहीं; हमारे आकाश का सबसे चमकीला ग्रह।",
          "पृथ्वी: सबसे सघन ग्रह; एकमात्र ज्ञात जीवन। मंगल: “लाल ग्रह” (आयरन ऑक्साइड); चंद्रमा फ़ोबोस और डीमोस; ओलंपस मोंस ज्ञात सबसे ऊँचा ज्वालामुखी है।",
          "बृहस्पति: सबसे बड़ा ग्रह; सबसे तेज़ घूर्णन (दिन 10 घंटे से थोड़ा कम); विशाल लाल धब्बा तूफ़ान।",
          "शनि: सबसे प्रमुख वलय; सबसे कम घनत्व (पानी में तैरेगा)। चारों दानव ग्रहों के वलय हैं।",
          "अरुण: बगल में लुढ़ककर घूमता है (अक्षीय झुकाव लगभग 98°)। वरुण: सबसे दूर का ग्रह, सबसे तेज़ पवनें।",
          "आकार का क्रम: बृहस्पति > शनि > अरुण > वरुण > पृथ्वी > शुक्र > मंगल > बुध।",
        ],
      },
      {
        heading: "चंद्रमा और छोटे पिंड",
        points: [
          "गैनीमीड (बृहस्पति) सबसे बड़ा चंद्रमा है, बुध से भी बड़ा; टाइटन (शनि) दूसरा है और उसका नाइट्रोजन का मोटा वायुमंडल है।",
          "बृहस्पति के गैलीलियन चंद्रमा (आयो, यूरोपा, गैनीमीड, कैलिस्टो) गैलीलियो ने 1610 में देखे थे।",
          "ट्राइटन (वरुण) उलटी दिशा में परिक्रमा करता है (वक्री)। शेरोन प्लूटो का सबसे बड़ा चंद्रमा है।",
          "पृथ्वी का चंद्रमा सौरमंडल का पाँचवाँ सबसे बड़ा चंद्रमा है।",
          "क्षुद्रग्रह पट्टी मंगल और बृहस्पति के बीच है; सेरेस इसमें एकमात्र बौना ग्रह है।",
          "IAU के बौने ग्रह: सेरेस, प्लूटो, एरिस, हौमिया, मेकमेक। प्लूटो कुइपर पट्टी में है।",
          "धूमकेतु कुइपर पट्टी और ऊर्ट बादल से आते हैं; उनकी पूँछ सूर्य से दूर की ओर होती है। हैली धूमकेतु लगभग हर 76 वर्ष में लौटता है।",
        ],
      },
      {
        heading: "केपलर के नियम",
        points: [
          "पहला नियम: ग्रह दीर्घवृत्त में गति करते हैं, जिसकी एक नाभि पर सूर्य होता है।",
          "दूसरा नियम: सूर्य से ग्रह तक खींची गई रेखा समान समय में समान क्षेत्रफल घेरती है — उपसौर (निकटतम) पर सबसे तेज़, अपसौर पर सबसे धीमी।",
          "तीसरा नियम: T² ∝ a³ (T = परिक्रमण काल, a = सूर्य से माध्य दूरी)।",
        ],
      },
    ],
    formulas: [
      "केपलर III: T² ∝ a³। पृथ्वी की इकाइयों में, T (वर्ष) = a^(3/2), जहाँ a AU में है — 4 AU → 8 वर्ष।",
      "1 AU ≈ 1.5 × 10⁸ km; सूर्य से प्रकाश ≈ 8 मिनट 20 सेकंड।",
      "ग्रहों के क्रम का स्मरण-सूत्र: “My Very Educated Mother Just Served Us Noodles”।",
      "कोई चंद्रमा नहीं: बुध और शुक्र। मंगल: 2 चंद्रमा।",
    ],
    traps: [
      "बुध सूर्य के अधिक निकट है, फिर भी सबसे गर्म ग्रह शुक्र है, बुध नहीं।",
      "शनि अकेला वलययुक्त ग्रह नहीं है — बृहस्पति, अरुण और वरुण के भी धुँधले वलय हैं।",
      "गैनीमीड और टाइटन बुध से बड़े हैं, पर उससे कम द्रव्यमान वाले हैं।",
      "शुक्र और अरुण “उलटे” (पूर्व से पश्चिम) घूमते हैं; अन्य पश्चिम से पूर्व।",
      "पृथ्वी सूर्य के सबसे निकट (उपसौर) जनवरी के आरंभ में होती है, गर्मियों में नहीं।",
    ],
    examTips: [
      "SSC और रेलवे में उत्कृष्टता वाले प्रश्न (सबसे बड़ा, सबसे गर्म, सबसे तेज़, वलययुक्त) और ग्रह–चंद्रमा सुमेलन पूछे जाते हैं।",
      "UPSC और CDS में बौने ग्रहों, घूर्णन और केपलर के नियमों पर कथन-आधारित प्रश्न आते हैं, कभी-कभी T² ∝ a³ की सरल गणना के साथ।",
    ],
  },
};

export default notes;

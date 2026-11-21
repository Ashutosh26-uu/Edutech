import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Units and quantities",
      points: [
        "Seven SI base units: metre, kilogram, second, ampere (current), kelvin, mole, candela.",
        "Derived: newton (force), joule (work/energy), watt (power), pascal (pressure), coulomb (charge), volt, ohm, hertz.",
        "1 N = 1 kg·m/s²; 1 Pa = 1 N/m²; 1 J = 1 N·m; 1 W = 1 J/s; 1 Ω = 1 V/A.",
        "Vectors have direction: displacement, velocity, acceleration, force, momentum. Scalars do not: mass, speed, distance, energy, work, time.",
        "Instruments: barometer – air pressure; hygrometer – humidity; anemometer – wind speed; lactometer – milk purity; sphygmomanometer – blood pressure.",
      ],
    },
    {
      heading: "Motion, force and gravitation",
      points: [
        "Newton’s first law (law of inertia): a body stays at rest or in uniform motion unless a net force acts.",
        "Second law: F = ma; force equals rate of change of momentum. Third law: every action has an equal and opposite reaction.",
        "Equations of motion: v = u + at; s = ut + ½at²; v² = u² + 2as.",
        "A ball thrown up has zero velocity at the top but its acceleration is still g (≈ 9.8 m/s²) downward.",
        "Gravitation: F = Gm₁m₂/r². Doubling both masses and the distance leaves F unchanged.",
        "In a lift accelerating down, apparent weight falls (feel lighter); in free fall, weightlessness.",
      ],
    },
    {
      heading: "Work, energy, pressure and fluids",
      points: [
        "Work W = F × s (along the force). Kinetic energy = ½mv²; potential energy = mgh.",
        "Power = work ÷ time. 1 kWh = 3.6 × 10⁶ J; 1 horsepower ≈ 746 W.",
        "Efficiency = useful output ÷ input × 100.",
        "Pressure = force ÷ area. Pascal’s law: pressure in a confined fluid is transmitted equally (hydraulic lift, brakes).",
        "Archimedes’ principle: buoyant force = weight of fluid displaced. A floating body’s fraction submerged = its density ÷ fluid density.",
      ],
    },
    {
      heading: "Light and sound",
      points: [
        "Speed of light in vacuum ≈ 3 × 10⁸ m/s; light slows in denser media (refraction).",
        "Blue sky and red sunsets: scattering of light (Rayleigh). Rainbow: refraction, dispersion and internal reflection in raindrops.",
        "Optical fibres and the sparkle of diamond use total internal reflection.",
        "Myopia (near-sightedness) corrected by a concave lens; hypermetropia by a convex lens.",
        "Sound is a mechanical wave and needs a medium; it cannot travel in vacuum. Fastest in solids, slowest in gases.",
        "Speed of sound in air ≈ 343 m/s at 20 °C. Human hearing 20 Hz–20 kHz; above it ultrasound, below it infrasound.",
        "Pitch depends on frequency; loudness on amplitude. Echo needs a distance of at least about 17 m.",
      ],
    },
    {
      heading: "Electricity",
      points: [
        "Ohm’s law: V = IR. Power P = VI = I²R = V²/R.",
        "Series: R = R₁ + R₂ (same current). Parallel: 1/R = 1/R₁ + 1/R₂ (same voltage); homes are wired in parallel.",
        "Bulb resistance R = V²/P (from its rating); at half the rated voltage it uses one-quarter of the rated power.",
        "In series, the lower-wattage bulb (higher resistance) glows brighter.",
        "Faraday: electromagnetic induction (generators, transformers).",
      ],
    },
  ],
  formulas: [
    "F = ma; p = mv; W = Fs; KE = ½mv²; PE = mgh; P = W/t.",
    "v = u + at; s = ut + ½at²; v² = u² + 2as.",
    "V = IR; P = VI = I²R = V²/R; energy (kWh) = kW × hours.",
    "Density = mass ÷ volume; pressure = force ÷ area.",
  ],
  traps: [
    "Mass is constant everywhere; weight (mg) changes with g.",
    "At the top of a vertical throw, velocity = 0 but acceleration ≠ 0.",
    "1 kWh is 3.6 × 10⁶ J, not 1,000 J — convert kW to W and hours to seconds.",
    "Speed is scalar; velocity is vector.",
    "Bulbs in series: the 60 W bulb is brighter than the 100 W bulb.",
  ],
  examTips: [
    "SSC and Railways ask SI units, instruments, laws and everyday phenomena (blue sky, mirage, echo).",
    "RRB NTPC/Group D and SSC include one-step numericals on F = ma, KE, power, energy bills and bulb ratings.",
  ],
  hi: {
    sections: [
      {
        heading: "मात्रक और राशियाँ",
        points: [
          "सात SI मूल मात्रक: मीटर, किलोग्राम, सेकंड, ऐम्पियर (धारा), केल्विन, मोल, कैंडेला।",
          "व्युत्पन्न: न्यूटन (बल), जूल (कार्य/ऊर्जा), वाट (शक्ति), पास्कल (दाब), कूलॉम (आवेश), वोल्ट, ओम, हर्ट्ज़।",
          "1 N = 1 kg·m/s²; 1 Pa = 1 N/m²; 1 J = 1 N·m; 1 W = 1 J/s; 1 Ω = 1 V/A।",
          "सदिश राशियों में दिशा होती है: विस्थापन, वेग, त्वरण, बल, संवेग। अदिश राशियों में नहीं: द्रव्यमान, चाल, दूरी, ऊर्जा, कार्य, समय।",
          "उपकरण: बैरोमीटर – वायुदाब; आर्द्रतामापी (हाइग्रोमीटर) – आर्द्रता; पवनवेगमापी (एनीमोमीटर) – पवन की चाल; दुग्धमापी (लैक्टोमीटर) – दूध की शुद्धता; स्फिग्मोमैनोमीटर – रक्तचाप।",
        ],
      },
      {
        heading: "गति, बल और गुरुत्वाकर्षण",
        points: [
          "न्यूटन का पहला नियम (जड़त्व का नियम): कोई पिंड विराम या एकसमान गति में तब तक रहता है जब तक उस पर कोई नेट बल न लगे।",
          "दूसरा नियम: F = ma; बल संवेग परिवर्तन की दर के बराबर होता है। तीसरा नियम: प्रत्येक क्रिया की समान और विपरीत प्रतिक्रिया होती है।",
          "गति के समीकरण: v = u + at; s = ut + ½at²; v² = u² + 2as।",
          "ऊपर फेंकी गई गेंद का शीर्ष पर वेग शून्य होता है, पर उसका त्वरण फिर भी नीचे की ओर g (≈ 9.8 m/s²) होता है।",
          "गुरुत्वाकर्षण: F = Gm₁m₂/r²। दोनों द्रव्यमान और दूरी दोगुनी करने पर F अपरिवर्तित रहता है।",
          "नीचे की ओर त्वरित होती लिफ़्ट में आभासी भार घटता है (हल्का महसूस होता है); मुक्त पतन में भारहीनता।",
        ],
      },
      {
        heading: "कार्य, ऊर्जा, दाब और तरल",
        points: [
          "कार्य W = F × s (बल की दिशा में)। गतिज ऊर्जा = ½mv²; स्थितिज ऊर्जा = mgh।",
          "शक्ति = कार्य ÷ समय। 1 kWh = 3.6 × 10⁶ J; 1 अश्वशक्ति ≈ 746 W।",
          "दक्षता = उपयोगी निर्गत ÷ निवेश × 100।",
          "दाब = बल ÷ क्षेत्रफल। पास्कल का नियम: परिबद्ध तरल में दाब समान रूप से संचरित होता है (द्रवचालित लिफ़्ट, ब्रेक)।",
          "आर्किमिडीज़ का सिद्धांत: उत्प्लावन बल = विस्थापित तरल का भार। तैरते पिंड का डूबा हुआ भाग = उसका घनत्व ÷ तरल का घनत्व।",
        ],
      },
      {
        heading: "प्रकाश और ध्वनि",
        points: [
          "निर्वात में प्रकाश की चाल ≈ 3 × 10⁸ m/s; सघन माध्यमों में प्रकाश धीमा हो जाता है (अपवर्तन)।",
          "नीला आकाश और लाल सूर्यास्त: प्रकाश का प्रकीर्णन (रैले)। इंद्रधनुष: वर्षा की बूँदों में अपवर्तन, परिक्षेपण और आंतरिक परावर्तन।",
          "प्रकाशीय तंतु (ऑप्टिकल फ़ाइबर) और हीरे की चमक पूर्ण आंतरिक परावर्तन पर आधारित हैं।",
          "निकट-दृष्टि दोष (मायोपिया) अवतल लेंस से, दीर्घ-दृष्टि दोष (हाइपरमेट्रोपिया) उत्तल लेंस से ठीक होता है।",
          "ध्वनि यांत्रिक तरंग है और उसे माध्यम चाहिए; वह निर्वात में नहीं चल सकती। ठोसों में सबसे तेज़, गैसों में सबसे धीमी।",
          "वायु में ध्वनि की चाल 20 °C पर ≈ 343 m/s। मनुष्य की श्रव्य सीमा 20 Hz–20 kHz; इससे ऊपर पराश्रव्य (अल्ट्रासाउंड), नीचे अवश्रव्य (इन्फ्रासाउंड)।",
          "तारत्व आवृत्ति पर और प्रबलता आयाम पर निर्भर करती है। प्रतिध्वनि के लिए कम-से-कम लगभग 17 m की दूरी चाहिए।",
        ],
      },
      {
        heading: "विद्युत",
        points: [
          "ओम का नियम: V = IR। शक्ति P = VI = I²R = V²/R।",
          "श्रेणी: R = R₁ + R₂ (समान धारा)। समानांतर: 1/R = 1/R₁ + 1/R₂ (समान वोल्टता); घरों में वायरिंग समानांतर होती है।",
          "बल्ब का प्रतिरोध R = V²/P (उसकी रेटिंग से); आधी रेटेड वोल्टता पर वह रेटेड शक्ति का एक-चौथाई उपयोग करता है।",
          "श्रेणी में कम वाट वाला बल्ब (अधिक प्रतिरोध) अधिक चमकता है।",
          "फ़ैराडे: विद्युत चुंबकीय प्रेरण (जनित्र, ट्रांसफ़ॉर्मर)।",
        ],
      },
    ],
    formulas: [
      "F = ma; p = mv; W = Fs; KE = ½mv²; PE = mgh; P = W/t।",
      "v = u + at; s = ut + ½at²; v² = u² + 2as।",
      "V = IR; P = VI = I²R = V²/R; ऊर्जा (kWh) = kW × घंटे।",
      "घनत्व = द्रव्यमान ÷ आयतन; दाब = बल ÷ क्षेत्रफल।",
    ],
    traps: [
      "द्रव्यमान हर जगह स्थिर रहता है; भार (mg) g के साथ बदलता है।",
      "ऊर्ध्वाधर फेंक के शीर्ष पर वेग = 0 है पर त्वरण ≠ 0।",
      "1 kWh = 3.6 × 10⁶ J है, 1,000 J नहीं — kW को W में और घंटों को सेकंड में बदलें।",
      "चाल अदिश है; वेग सदिश है।",
      "श्रेणी में बल्ब: 60 W का बल्ब 100 W के बल्ब से अधिक चमकता है।",
    ],
    examTips: [
      "SSC और रेलवे में SI मात्रक, उपकरण, नियम और दैनिक घटनाएँ (नीला आकाश, मरीचिका, प्रतिध्वनि) पूछी जाती हैं।",
      "RRB NTPC/ग्रुप D और SSC में F = ma, KE, शक्ति, ऊर्जा बिल और बल्ब रेटिंग पर एक-चरण के संख्यात्मक प्रश्न आते हैं।",
    ],
  },
};

export default notes;

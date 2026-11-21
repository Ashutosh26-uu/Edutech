import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Two drainage systems",
      points: [
        "Himalayan rivers: perennial (snow + rain), deep gorges, meanders, big floods; e.g. Indus, Ganga, Brahmaputra.",
        "Peninsular rivers: mostly rain-fed and seasonal, older, shallower valleys; e.g. Godavari, Krishna, Kaveri, Narmada.",
        "Most peninsular rivers flow east to the Bay of Bengal and form deltas.",
        "Narmada and Tapi flow west through rift valleys into the Arabian Sea and form estuaries, not deltas.",
      ],
    },
    {
      heading: "Indus and Ganga systems",
      points: [
        "Indus (about 2,880 km) rises in Tibet near Mansarovar; tributaries: Jhelum, Chenab, Ravi, Beas, Sutlej.",
        "Jhelum rises at Verinag (Kashmir); Beas rises at Beas Kund near Rohtang and flows wholly in India; Beas meets Sutlej at Harike.",
        "Indus Waters Treaty (1960): India uses the eastern rivers (Ravi, Beas, Sutlej), Pakistan the western (Indus, Jhelum, Chenab).",
        "Ganga: Bhagirathi (from Gangotri glacier) and Alaknanda meet at Devprayag to form the Ganga.",
        "Ganga is the longest river flowing in India; enters Bangladesh as the Padma.",
        "Left-bank tributaries: Ramganga, Gomti, Ghaghara, Gandak, Kosi. Right-bank: Yamuna, Son.",
        "Yamuna rises at Yamunotri and joins the Ganga at Prayagraj; Chambal, Betwa and Ken join the Yamuna.",
        "Kosi = “Sorrow of Bihar” (shifts course, heavy silt); Damodar = “Sorrow of Bengal”.",
      ],
    },
    {
      heading: "Brahmaputra",
      points: [
        "Rises near Mansarovar (Chemayungdung glacier); called Tsangpo in Tibet.",
        "Enters India in Arunachal as the Siang/Dihang; flows through Assam as the Brahmaputra; called Jamuna in Bangladesh.",
        "Majuli in Assam is a large river island. Ganga–Brahmaputra form the Sundarbans delta, the world’s largest.",
      ],
    },
    {
      heading: "Peninsular rivers",
      points: [
        "Godavari: longest peninsular river and longest wholly within India (about 1,465 km); rises at Trimbakeshwar (Nashik); “Dakshin Ganga”.",
        "Krishna rises near Mahabaleshwar; tributaries Tungabhadra and Bhima.",
        "Kaveri rises at Talakaveri (Kodagu, Karnataka); Shivanasamudra falls; mostly perennial due to both monsoons.",
        "Mahanadi rises near Sihawa (Chhattisgarh); Hirakud Dam (Odisha).",
        "Narmada rises at Amarkantak; flows between Vindhya and Satpura; Dhuandhar falls (Jabalpur); Sardar Sarovar Dam.",
        "Tapi rises at Multai (Betul, MP); Ukai Dam (Gujarat). Mahi and Sabarmati also flow west.",
      ],
    },
    {
      heading: "Dams on rivers",
      points: [
        "Tehri – Bhagirathi (near Bhilangana confluence); Bhakra Nangal – Sutlej; Hirakud – Mahanadi.",
        "Sardar Sarovar and Indira Sagar – Narmada; Ukai – Tapi; Gandhi Sagar – Chambal; Nagarjuna Sagar – Krishna.",
        "Mettur – Kaveri; Koyna – Koyna (Maharashtra); Salal – Chenab.",
      ],
    },
  ],
  formulas: [
    "Indus five: Jhelum, Chenab, Ravi, Beas, Sutlej (west → east).",
    "West-flowing: Narmada, Tapi, Mahi, Sabarmati → estuaries. East-flowing: Mahanadi, Godavari, Krishna, Kaveri → deltas.",
    "Brahmaputra names: Tsangpo (Tibet) → Siang/Dihang (Arunachal) → Brahmaputra (Assam) → Jamuna (Bangladesh).",
  ],
  traps: [
    "Longest river in India = Ganga; longest entirely within India = Godavari.",
    "Alaknanda–Bhagirathi meet at Devprayag; Tehri is at Bhagirathi–Bhilangana.",
    "Yamuna and Son are right-bank tributaries; Kosi, Gandak, Ghaghara are left-bank.",
    "Ukai is on the Tapi, not the Mahi; Gandhi Sagar is on the Chambal, not the Betwa.",
    "Narmada and Tapi do not form deltas.",
  ],
  examTips: [
    "SSC and Railways ask origins, nicknames and dam–river pairs.",
    "UPSC and State PSCs ask tributary sides, west-flowing rivers and dam-matching with “NOT correctly matched” options.",
  ],
  hi: {
    sections: [
      {
        heading: "दो अपवाह तंत्र",
        points: [
          "हिमालयी नदियाँ: बारहमासी (हिम + वर्षा), गहरी घाटियाँ, विसर्प, बड़ी बाढ़ें; जैसे सिंधु, गंगा, ब्रह्मपुत्र।",
          "प्रायद्वीपीय नदियाँ: अधिकांशतः वर्षा-आधारित और मौसमी, अधिक पुरानी, उथली घाटियाँ; जैसे गोदावरी, कृष्णा, कावेरी, नर्मदा।",
          "अधिकांश प्रायद्वीपीय नदियाँ पूर्व की ओर बंगाल की खाड़ी में बहती हैं और डेल्टा बनाती हैं।",
          "नर्मदा और तापी भ्रंश घाटियों से होकर पश्चिम में अरब सागर में गिरती हैं और ज्वारनदमुख (एश्चुअरी) बनाती हैं, डेल्टा नहीं।",
        ],
      },
      {
        heading: "सिंधु और गंगा तंत्र",
        points: [
          "सिंधु (लगभग 2,880 km) तिब्बत में मानसरोवर के निकट से निकलती है; सहायक नदियाँ: झेलम, चिनाब, रावी, ब्यास, सतलुज।",
          "झेलम वेरीनाग (कश्मीर) से निकलती है; ब्यास रोहतांग के निकट ब्यास कुंड से निकलकर पूरी तरह भारत में बहती है; ब्यास हरिके में सतलुज से मिलती है।",
          "सिंधु जल संधि (1960): भारत पूर्वी नदियों (रावी, ब्यास, सतलुज) का उपयोग करता है, पाकिस्तान पश्चिमी नदियों (सिंधु, झेलम, चिनाब) का।",
          "गंगा: भागीरथी (गंगोत्री हिमनद से) और अलकनंदा देवप्रयाग में मिलकर गंगा बनाती हैं।",
          "गंगा भारत में बहने वाली सबसे लंबी नदी है; बांग्लादेश में पद्मा के नाम से प्रवेश करती है।",
          "बाएँ तट की सहायक नदियाँ: रामगंगा, गोमती, घाघरा, गंडक, कोसी। दाएँ तट की: यमुना, सोन।",
          "यमुना यमुनोत्री से निकलती है और प्रयागराज में गंगा से मिलती है; चंबल, बेतवा और केन यमुना में मिलती हैं।",
          "कोसी = “बिहार का शोक” (मार्ग बदलती है, भारी गाद); दामोदर = “बंगाल का शोक”।",
        ],
      },
      {
        heading: "ब्रह्मपुत्र",
        points: [
          "मानसरोवर के निकट (चेमायुंगडुंग हिमनद) से निकलती है; तिब्बत में इसे त्सांगपो कहते हैं।",
          "अरुणाचल में सियांग/दिहांग के नाम से भारत में प्रवेश करती है; असम में ब्रह्मपुत्र के नाम से बहती है; बांग्लादेश में इसे जमुना कहते हैं।",
          "असम का माजुली एक विशाल नदी द्वीप है। गंगा–ब्रह्मपुत्र मिलकर सुंदरबन डेल्टा बनाती हैं, जो विश्व का सबसे बड़ा डेल्टा है।",
        ],
      },
      {
        heading: "प्रायद्वीपीय नदियाँ",
        points: [
          "गोदावरी: सबसे लंबी प्रायद्वीपीय नदी और पूरी तरह भारत के भीतर बहने वाली सबसे लंबी नदी (लगभग 1,465 km); त्र्यंबकेश्वर (नासिक) से निकलती है; “दक्षिण गंगा”।",
          "कृष्णा महाबलेश्वर के निकट से निकलती है; सहायक नदियाँ तुंगभद्रा और भीमा।",
          "कावेरी तालकावेरी (कोडागु, कर्नाटक) से निकलती है; शिवसमुद्रम जलप्रपात; दोनों मानसूनों के कारण अधिकांशतः बारहमासी।",
          "महानदी सिहावा (छत्तीसगढ़) के निकट से निकलती है; हीराकुंड बाँध (ओडिशा)।",
          "नर्मदा अमरकंटक से निकलती है; विंध्य और सतपुड़ा के बीच बहती है; धुआँधार जलप्रपात (जबलपुर); सरदार सरोवर बाँध।",
          "तापी मुलताई (बैतूल, मध्य प्रदेश) से निकलती है; उकाई बाँध (गुजरात)। माही और साबरमती भी पश्चिम की ओर बहती हैं।",
        ],
      },
      {
        heading: "नदियों पर बाँध",
        points: [
          "टिहरी – भागीरथी (भिलंगना संगम के निकट); भाखड़ा नांगल – सतलुज; हीराकुंड – महानदी।",
          "सरदार सरोवर और इंदिरा सागर – नर्मदा; उकाई – तापी; गांधी सागर – चंबल; नागार्जुन सागर – कृष्णा।",
          "मेट्टूर – कावेरी; कोयना – कोयना (महाराष्ट्र); सलाल – चिनाब।",
        ],
      },
    ],
    formulas: [
      "सिंधु की पाँच सहायक नदियाँ: झेलम, चिनाब, रावी, ब्यास, सतलुज (पश्चिम → पूर्व)।",
      "पश्चिम की ओर बहने वाली: नर्मदा, तापी, माही, साबरमती → ज्वारनदमुख। पूर्व की ओर बहने वाली: महानदी, गोदावरी, कृष्णा, कावेरी → डेल्टा।",
      "ब्रह्मपुत्र के नाम: त्सांगपो (तिब्बत) → सियांग/दिहांग (अरुणाचल) → ब्रह्मपुत्र (असम) → जमुना (बांग्लादेश)।",
    ],
    traps: [
      "भारत की सबसे लंबी नदी = गंगा; पूरी तरह भारत के भीतर सबसे लंबी = गोदावरी।",
      "अलकनंदा–भागीरथी देवप्रयाग में मिलती हैं; टिहरी भागीरथी–भिलंगना के संगम पर है।",
      "यमुना और सोन दाएँ तट की सहायक नदियाँ हैं; कोसी, गंडक, घाघरा बाएँ तट की हैं।",
      "उकाई तापी पर है, माही पर नहीं; गांधी सागर चंबल पर है, बेतवा पर नहीं।",
      "नर्मदा और तापी डेल्टा नहीं बनातीं।",
    ],
    examTips: [
      "SSC और रेलवे में उद्गम, उपनाम और बाँध–नदी के जोड़े पूछे जाते हैं।",
      "UPSC और राज्य PSC में सहायक नदियों के तट, पश्चिम की ओर बहने वाली नदियाँ और “सही सुमेलित नहीं है” विकल्पों वाले बाँध-मिलान पूछे जाते हैं।",
    ],
  },
};

export default notes;

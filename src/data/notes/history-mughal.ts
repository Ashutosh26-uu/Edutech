import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Babur and Humayun",
      points: [
        "Babur founded the Mughal Empire after the First Battle of Panipat (1526), defeating Ibrahim Lodi.",
        "Battle of Khanwa (1527): Babur defeated Rana Sanga of Mewar. Chanderi (1528), Ghaghra (1529) followed.",
        "Babur wrote his memoir, Tuzuk-i-Baburi (Baburnama), in Turki; used artillery and the tulughma tactic.",
        "Humayun lost to Sher Shah Suri at Chausa (1539) and Kannauj (1540), went into exile, regained Delhi in 1555.",
        "Humayun died in 1556 after falling from the library stairs (Sher Mandal); his tomb in Delhi was built by his widow.",
      ],
    },
    {
      heading: "Sher Shah Suri (Sur interlude)",
      points: [
        "Introduced the silver rupiya; rebuilt the Grand Trunk Road (Sadak-e-Azam) with sarais.",
        "Land measurement-based revenue system; his tomb is at Sasaram (Bihar).",
      ],
    },
    {
      heading: "Akbar (1556–1605)",
      points: [
        "Second Battle of Panipat (1556): Akbar’s army under regent Bairam Khan defeated Hemu.",
        "Battle of Haldighati (1576): Mughal army led by Man Singh fought Maharana Pratap.",
        "Introduced the Mansabdari system (rank-based military/civil service); Todar Mal’s Dahsala (Zabti) revenue system.",
        "Abolished jizya (1564); built Ibadat Khana (1575) at Fatehpur Sikri; started Din-i-Ilahi (1582).",
        "Buland Darwaza at Fatehpur Sikri commemorates the conquest of Gujarat.",
        "Court: Abul Fazl (Akbarnama, Ain-i-Akbari), Birbal, Tansen, Todar Mal; tomb at Sikandra.",
      ],
    },
    {
      heading: "Jahangir and Shah Jahan",
      points: [
        "Jahangir hung a “chain of justice”; wife Nur Jahan wielded great influence.",
        "Sir Thomas Roe, envoy of James I, reached his court in 1615; Guru Arjan Dev executed in 1606.",
        "Nur Jahan built the tomb of Itimad-ud-Daulah at Agra, noted for pietra dura inlay.",
        "Shah Jahan: “Golden Age of Mughal architecture” — Taj Mahal (for Mumtaz Mahal), Red Fort and Jama Masjid of Delhi, Peacock Throne.",
        "Shah Jahan founded Shahjahanabad (Delhi); he was imprisoned by Aurangzeb in Agra Fort.",
      ],
    },
    {
      heading: "Aurangzeb and decline",
      points: [
        "Aurangzeb defeated Dara Shikoh at Samugarh (1658) in the war of succession.",
        "Treaty of Purandar (1665) between Shivaji and Jai Singh.",
        "Reimposed jizya (1679); Guru Tegh Bahadur executed (1675); Bibi ka Maqbara at Aurangabad built in his reign.",
        "Last of the great Mughals; died in 1707, after which the empire declined quickly.",
        "Nadir Shah’s invasion (1739) carried off the Peacock Throne and Koh-i-noor.",
        "Third Battle of Panipat (1761): Ahmad Shah Abdali defeated the Marathas.",
        "Bahadur Shah Zafar, the last Mughal emperor, was exiled to Rangoon after 1857.",
      ],
    },
  ],
  formulas: [
    "Order: Babur → Humayun → (Sher Shah) → Akbar → Jahangir → Shah Jahan → Aurangzeb.",
    "Panipat I 1526 (Babur–Ibrahim Lodi), II 1556 (Akbar–Hemu), III 1761 (Abdali–Marathas).",
    "Khanwa 1527 → Chausa 1539 → Kannauj 1540 → Haldighati 1576 → Samugarh 1658 → Purandar 1665.",
  ],
  traps: [
    "Second Panipat was fought against Hemu, not Sher Shah (who died in 1545).",
    "At Haldighati the Mughal commander was Man Singh, not Akbar himself.",
    "Mansabdari is Akbar’s; the silver rupiya and GT Road reforms are Sher Shah’s.",
    "Jizya: abolished by Akbar, reimposed by Aurangzeb — not the other way round.",
    "Bibi ka Maqbara (Aurangabad) is often called the “poor man’s Taj” — it is not by Shah Jahan.",
  ],
  examTips: [
    "SSC and Railways ask battles with years, monuments with builders and books with authors.",
    "State PSCs and UPSC ask chronology arrangement and administrative systems (Mansabdari, Zabti).",
  ],
  hi: {
    sections: [
      {
        heading: "बाबर और हुमायूँ",
        points: [
          "बाबर ने पानीपत के प्रथम युद्ध (1526) में इब्राहिम लोदी को हराकर मुगल साम्राज्य की स्थापना की।",
          "खानवा का युद्ध (1527): बाबर ने मेवाड़ के राणा सांगा को हराया। इसके बाद चंदेरी (1528), घाघरा (1529)।",
          "बाबर ने अपनी आत्मकथा तुजुक-ए-बाबरी (बाबरनामा) तुर्की भाषा में लिखी; तोपखाने और तुलुगमा रणनीति का प्रयोग किया।",
          "हुमायूँ शेरशाह सूरी से चौसा (1539) और कन्नौज (1540) में हारा, निर्वासन में गया, 1555 में दिल्ली वापस पाई।",
          "हुमायूँ की मृत्यु 1556 में पुस्तकालय की सीढ़ियों (शेर मंडल) से गिरने से हुई; दिल्ली में उसका मकबरा उसकी विधवा ने बनवाया।",
        ],
      },
      {
        heading: "शेरशाह सूरी (सूर काल)",
        points: [
          "चाँदी का रुपया (रुपया) चलाया; सरायों के साथ ग्रांड ट्रंक रोड (सड़क-ए-आज़म) का पुनर्निर्माण किया।",
          "भूमि-माप पर आधारित राजस्व व्यवस्था; उसका मकबरा सासाराम (बिहार) में है।",
        ],
      },
      {
        heading: "अकबर (1556–1605)",
        points: [
          "पानीपत का द्वितीय युद्ध (1556): संरक्षक बैरम खाँ के नेतृत्व में अकबर की सेना ने हेमू को हराया।",
          "हल्दीघाटी का युद्ध (1576): मान सिंह के नेतृत्व वाली मुगल सेना महाराणा प्रताप से लड़ी।",
          "मनसबदारी प्रणाली (पद-आधारित सैन्य/नागरिक सेवा) लागू की; टोडरमल की दहसाला (ज़ब्ती) राजस्व व्यवस्था।",
          "जज़िया समाप्त किया (1564); फतेहपुर सीकरी में इबादतखाना (1575) बनवाया; दीन-ए-इलाही (1582) आरंभ किया।",
          "फतेहपुर सीकरी का बुलंद दरवाज़ा गुजरात की विजय की स्मृति में है।",
          "दरबार: अबुल फज़ल (अकबरनामा, आइन-ए-अकबरी), बीरबल, तानसेन, टोडरमल; मकबरा सिकंदरा में।",
        ],
      },
      {
        heading: "जहाँगीर और शाहजहाँ",
        points: [
          "जहाँगीर ने “न्याय की जंजीर” लगवाई; पत्नी नूरजहाँ का बहुत प्रभाव था।",
          "जेम्स प्रथम के राजदूत सर थॉमस रो 1615 में उसके दरबार पहुँचे; गुरु अर्जन देव को 1606 में मृत्युदंड दिया गया।",
          "नूरजहाँ ने आगरा में इतिमाद-उद-दौला का मकबरा बनवाया, जो पित्रा ड्यूरा जड़ाई के लिए प्रसिद्ध है।",
          "शाहजहाँ: “मुगल स्थापत्य का स्वर्ण युग” — ताजमहल (मुमताज महल के लिए), दिल्ली का लाल किला और जामा मस्जिद, तख्त-ए-ताऊस (मयूर सिंहासन)।",
          "शाहजहाँ ने शाहजहाँनाबाद (दिल्ली) बसाया; औरंगज़ेब ने उसे आगरा किले में कैद किया।",
        ],
      },
      {
        heading: "औरंगज़ेब और पतन",
        points: [
          "उत्तराधिकार के युद्ध में औरंगज़ेब ने दारा शिकोह को सामूगढ़ (1658) में हराया।",
          "पुरंदर की संधि (1665) शिवाजी और जयसिंह के बीच।",
          "जज़िया पुनः लगाया (1679); गुरु तेग बहादुर को मृत्युदंड (1675); औरंगाबाद का बीबी का मकबरा उसके शासनकाल में बना।",
          "अंतिम महान मुगल; 1707 में मृत्यु, जिसके बाद साम्राज्य तेज़ी से क्षीण हुआ।",
          "नादिर शाह के आक्रमण (1739) में तख्त-ए-ताऊस और कोहिनूर ले जाए गए।",
          "पानीपत का तृतीय युद्ध (1761): अहमद शाह अब्दाली ने मराठों को हराया।",
          "अंतिम मुगल सम्राट बहादुर शाह ज़फर को 1857 के बाद रंगून निर्वासित किया गया।",
        ],
      },
    ],
    formulas: [
      "क्रम: बाबर → हुमायूँ → (शेरशाह) → अकबर → जहाँगीर → शाहजहाँ → औरंगज़ेब।",
      "पानीपत I 1526 (बाबर–इब्राहिम लोदी), II 1556 (अकबर–हेमू), III 1761 (अब्दाली–मराठे)।",
      "खानवा 1527 → चौसा 1539 → कन्नौज 1540 → हल्दीघाटी 1576 → सामूगढ़ 1658 → पुरंदर 1665।",
    ],
    traps: [
      "पानीपत का द्वितीय युद्ध हेमू के विरुद्ध लड़ा गया, शेरशाह के नहीं (जिसकी मृत्यु 1545 में हो चुकी थी)।",
      "हल्दीघाटी में मुगल सेनापति मान सिंह था, स्वयं अकबर नहीं।",
      "मनसबदारी अकबर की है; चाँदी का रुपया और GT रोड के सुधार शेरशाह के हैं।",
      "जज़िया: अकबर ने समाप्त किया, औरंगज़ेब ने पुनः लगाया — उलटा नहीं।",
      "बीबी का मकबरा (औरंगाबाद) को प्रायः “गरीबों का ताज” कहा जाता है — यह शाहजहाँ का बनवाया नहीं है।",
    ],
    examTips: [
      "SSC और रेलवे वर्ष सहित युद्ध, निर्माता सहित स्मारक और लेखक सहित ग्रंथ पूछते हैं।",
      "राज्य लोक सेवा आयोग और UPSC कालक्रम-व्यवस्था और प्रशासनिक व्यवस्थाएँ (मनसबदारी, ज़ब्ती) पूछते हैं।",
    ],
  },
};

export default notes;

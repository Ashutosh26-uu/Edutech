import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Space: institutions and milestones",
      points: [
        "INCOSPAR (1962, Vikram Sarabhai) became ISRO on 15 August 1969; HQ Antariksh Bhavan, Bengaluru.",
        "Centres: SDSC Sriharikota (launch), VSSC Thiruvananthapuram, URSC Bengaluru, SAC Ahmedabad, NRSC Hyderabad.",
        "Aryabhata (19 April 1975) was launched by the Soviet Union from Kapustin Yar; SLV-3 put Rohini in orbit in 1980 (project director A.P.J. Abdul Kalam).",
        "Chandrayaan-1 (2008, PSLV-C11) found water signatures; Chandrayaan-2 (2019) lost lander Vikram but its orbiter still works.",
        "Chandrayaan-3 (LVM3, July 2023): lander Vikram and rover Pragyan landed near the south pole on 23 August 2023, now National Space Day.",
        "Mars Orbiter Mission: PSLV-C25, November 2013; entered Mars orbit 24 September 2014, first attempt success.",
        "AstroSat (2015) multi-wavelength astronomy; Aditya-L1 (PSLV-C57, 2023) studies the Sun from a halo orbit at L1 with seven payloads; XPoSat (January 2024) measures X-ray polarisation.",
        "SpaDeX (January 2025): India became the fourth country to dock two spacecraft in orbit; NISAR (ISRO–NASA radar satellite) launched on a GSLV in July 2025.",
        "Gaganyaan: TV-D1 (2023) tested crew escape; Vyommitra is a humanoid robot; Shubhanshu Shukla reached the ISS on Axiom-4 (June 2025); space station by 2035; Shukrayaan (Venus) approved 2024.",
      ],
    },
    {
      heading: "Launch vehicles and satellites",
      points: [
        "PSLV: four stages alternating solid–liquid (PS1 solid, PS2 liquid Vikas, PS3 solid, PS4 liquid, not cryogenic); PSLV-C37 carried 104 satellites in February 2017.",
        "LVM3 (GSLV Mk III): two S200 solid boosters, L110 liquid core, C25 cryogenic upper stage (liquid hydrogen + liquid oxygen).",
        "SSLV puts satellites up to about 500 kg in low Earth orbit at short notice; Vikas is an engine, not a vehicle.",
        "NavIC (IRNSS) is regional: satellites in geostationary and inclined geosynchronous orbits.",
        "Series: GSAT communication, Cartosat mapping, RISAT all-weather radar imaging, Oceansat oceans and winds.",
        "Orbits: geostationary about 36,000 km over the equator (poor polar coverage); remote sensing uses polar sun-synchronous orbits; GPS uses medium Earth orbit.",
      ],
    },
    {
      heading: "Defence",
      points: [
        "DRDO (1958, HQ New Delhi); IGMDP missiles: Prithvi surface-to-surface, Agni ballistic, Akash and Trishul surface-to-air, Nag anti-tank.",
        "Astra beyond-visual-range air-to-air; Nirbhay subsonic cruise; Pralay quasi-ballistic tactical; Agni-Prime new-generation canisterised ballistic missile.",
        "BrahMos is an India–Russia supersonic cruise missile (Brahmaputra + Moskva), not purely DRDO.",
        "Mission Shakti (2019) anti-satellite test, not Operation Shakti (1998); Mission Divyastra (March 2024) Agni-V with MIRV.",
        "Tejas (HAL) light combat aircraft; Prachand light combat helicopter (2022); Rafale is French (Dassault).",
        "INS Vikrant (September 2022) first indigenous aircraft carrier; INS Vikramaditya ex-Russian carrier; INS Arihant (2016) and Arighaat are nuclear ballistic-missile submarines (SSBN).",
      ],
    },
    {
      heading: "Nuclear programme",
      points: [
        "Smiling Buddha (May 1974); Operation Shakti (May 1998), hence National Technology Day on 11 May.",
        "Doctrine (2003): credible minimum deterrence, no first use, massive retaliation; India has signed neither NPT nor CTBT.",
        "Three stages: PHWRs on natural uranium → fast breeders on plutonium (PFBR Kalpakkam, mixed-oxide fuel) → thorium.",
        "Plants: Kudankulam Tamil Nadu, Kakrapar Gujarat, Kaiga Karnataka, Narora Uttar Pradesh.",
      ],
    },
    {
      heading: "Biotech and IT",
      points: [
        "Bt cotton (approved 2002) carries a cry gene from Bacillus thuringiensis; Bt brinjal release under moratorium since 2010; GEAC under MoEFCC approves GM crops.",
        "Golden Rice has beta-carotene (vitamin A precursor); CRISPR-Cas9 edits genes; DNA fingerprinting by Alec Jeffreys; Dolly cloned in Scotland (1996).",
        "1 byte = 8 bits; IPv4 32-bit, IPv6 128-bit; HTTPS uses TLS on port 443; RAM is volatile.",
        "Phishing tricks users; ransomware encrypts for payment; botnet = hijacked machines; zero-day = unpatched unknown flaw; firewall filters traffic.",
        "CERT-In handles cyber incidents; IT Act 2000; UPI by NPCI; PARAM supercomputers by C-DAC.",
      ],
    },
  ],
  formulas: [
    "Sarabhai: father of space programme; Bhabha: nuclear programme (BARC, Trombay); Kalam: Missile Man, SLV-3 director.",
    "Space chronology: Aryabhata 1975 → Rohini 1980 → Chandrayaan-1 2008 → MOM in Mars orbit 2014 → PSLV-C37 2017 → Chandrayaan-3 2023 → SpaDeX 2025.",
  ],
  traps: [
    "PSLV's fourth stage is liquid, not cryogenic; the cryogenic C25 is on LVM3.",
    "Aryabhata was launched from the USSR, not Sriharikota.",
    "Chandrayaan-2's orbiter is still working; only the lander failed.",
    "BrahMos is a joint venture, so it is the usual answer to 'not developed by DRDO'.",
  ],
  examTips: [
    "SSC and RRB ask one-liners: HQs, firsts, missile types, mission launch vehicles.",
    "UPSC and state PSCs use statement counts, match-the-pair and chronological order mixing missions, vehicles and purposes.",
    "Recent missions (Gaganyaan, SpaDeX, NISAR, Divyastra) are favourites; learn the year with each.",
  ],
  hi: {
    sections: [
      {
        heading: "अंतरिक्ष: संस्थान और उपलब्धियाँ",
        points: [
          "INCOSPAR (1962, विक्रम साराभाई) 15 अगस्त 1969 को ISRO बना; मुख्यालय अंतरिक्ष भवन, बेंगलुरु।",
          "केंद्र: SDSC श्रीहरिकोटा (प्रक्षेपण), VSSC तिरुवनंतपुरम, URSC बेंगलुरु, SAC अहमदाबाद, NRSC हैदराबाद।",
          "आर्यभट (19 अप्रैल 1975) को सोवियत संघ ने कापुस्तिन यार से प्रक्षेपित किया; SLV-3 ने 1980 में रोहिणी को कक्षा में स्थापित किया (परियोजना निदेशक ए.पी.जे. अब्दुल कलाम)।",
          "चंद्रयान-1 (2008, PSLV-C11) ने जल के संकेत खोजे; चंद्रयान-2 (2019) का लैंडर विक्रम खो गया पर उसका ऑर्बिटर अब भी काम कर रहा है।",
          "चंद्रयान-3 (LVM3, जुलाई 2023): लैंडर विक्रम और रोवर प्रज्ञान 23 अगस्त 2023 को दक्षिणी ध्रुव के निकट उतरे, जो अब राष्ट्रीय अंतरिक्ष दिवस है।",
          "मंगल कक्षित्र मिशन: PSLV-C25, नवंबर 2013; 24 सितंबर 2014 को मंगल की कक्षा में पहुँचा, पहले प्रयास में सफल।",
          "एस्ट्रोसैट (2015) बहु-तरंगदैर्ध्य खगोल विज्ञान; आदित्य-L1 (PSLV-C57, 2023) L1 पर हेलो कक्षा से सात पेलोड के साथ सूर्य का अध्ययन करता है; XPoSat (जनवरी 2024) X-किरण ध्रुवण मापता है।",
          "SpaDeX (जनवरी 2025): भारत कक्षा में दो अंतरिक्ष यानों को जोड़ने वाला चौथा देश बना; NISAR (ISRO–NASA रडार उपग्रह) जुलाई 2025 में GSLV से प्रक्षेपित हुआ।",
          "गगनयान: TV-D1 (2023) ने चालक दल के निकासी तंत्र का परीक्षण किया; व्योममित्र एक ह्यूमनॉइड रोबोट है; शुभांशु शुक्ला Axiom-4 से ISS पहुँचे (जून 2025); 2035 तक अंतरिक्ष स्टेशन; शुक्रयान (शुक्र) को 2024 में मंज़ूरी।",
        ],
      },
      {
        heading: "प्रक्षेपण यान और उपग्रह",
        points: [
          "PSLV: चार चरण, ठोस–द्रव बारी-बारी से (PS1 ठोस, PS2 द्रव विकास, PS3 ठोस, PS4 द्रव, क्रायोजेनिक नहीं); PSLV-C37 ने फ़रवरी 2017 में 104 उपग्रह ले जाए।",
          "LVM3 (GSLV Mk III): दो S200 ठोस बूस्टर, L110 द्रव क्रोड, C25 क्रायोजेनिक ऊपरी चरण (द्रव हाइड्रोजन + द्रव ऑक्सीजन)।",
          "SSLV लगभग 500 kg तक के उपग्रहों को कम सूचना पर निम्न भू-कक्षा में स्थापित करता है; विकास इंजन है, यान नहीं।",
          "NavIC (IRNSS) क्षेत्रीय है: उपग्रह भूस्थिर और झुकी हुई भू-समकालिक कक्षाओं में हैं।",
          "शृंखलाएँ: GSAT संचार, कार्टोसैट मानचित्रण, RISAT सर्व-मौसम रडार इमेजिंग, ओशनसैट महासागर और पवनें।",
          "कक्षाएँ: भूस्थिर लगभग 36,000 km पर भूमध्य रेखा के ऊपर (ध्रुवीय कवरेज कमज़ोर); सुदूर संवेदन ध्रुवीय सूर्य-समकालिक कक्षाएँ प्रयोग करता है; GPS मध्य भू-कक्षा का उपयोग करता है।",
        ],
      },
      {
        heading: "रक्षा",
        points: [
          "DRDO (1958, मुख्यालय नई दिल्ली); IGMDP की मिसाइलें: पृथ्वी भूमि-से-भूमि, अग्नि बैलिस्टिक, आकाश और त्रिशूल भूमि-से-वायु, नाग टैंक-रोधी।",
          "अस्त्र दृश्य सीमा से परे वायु-से-वायु; निर्भय अवध्वनिक क्रूज़; प्रलय अर्ध-बैलिस्टिक सामरिक; अग्नि-प्राइम नई पीढ़ी की कैनिस्टर-आधारित बैलिस्टिक मिसाइल।",
          "ब्रह्मोस भारत–रूस की पराध्वनिक क्रूज़ मिसाइल है (ब्रह्मपुत्र + मोस्कवा), पूर्णतः DRDO की नहीं।",
          "मिशन शक्ति (2019) उपग्रह-रोधी परीक्षण, ऑपरेशन शक्ति (1998) नहीं; मिशन दिव्यास्त्र (मार्च 2024) MIRV के साथ अग्नि-V।",
          "तेजस (HAL) हल्का लड़ाकू विमान; प्रचंड हल्का लड़ाकू हेलीकॉप्टर (2022); राफ़ेल फ़्रांसीसी (डसॉल्ट) है।",
          "INS विक्रांत (सितंबर 2022) पहला स्वदेशी विमानवाहक पोत; INS विक्रमादित्य पूर्व-रूसी विमानवाहक; INS अरिहंत (2016) और अरिघात परमाणु बैलिस्टिक मिसाइल पनडुब्बियाँ (SSBN) हैं।",
        ],
      },
      {
        heading: "परमाणु कार्यक्रम",
        points: [
          "स्माइलिंग बुद्धा (मई 1974); ऑपरेशन शक्ति (मई 1998), इसीलिए राष्ट्रीय प्रौद्योगिकी दिवस 11 मई को।",
          "सिद्धांत (2003): विश्वसनीय न्यूनतम प्रतिरोध, पहले प्रयोग नहीं, व्यापक प्रतिशोध; भारत ने न NPT पर, न CTBT पर हस्ताक्षर किए हैं।",
          "तीन चरण: प्राकृतिक यूरेनियम पर PHWR → प्लूटोनियम पर तीव्र ब्रीडर (PFBR कलपक्कम, मिश्रित-ऑक्साइड ईंधन) → थोरियम।",
          "संयंत्र: कुडनकुलम तमिलनाडु, काकरापार गुजरात, कैगा कर्नाटक, नरोरा उत्तर प्रदेश।",
        ],
      },
      {
        heading: "जैव प्रौद्योगिकी और IT",
        points: [
          "Bt कपास (2002 में स्वीकृत) में बैसिलस थुरिंजिएंसिस का cry जीन होता है; Bt बैंगन की रिलीज़ 2010 से स्थगन में है; MoEFCC के अधीन GEAC GM फ़सलों को मंज़ूरी देती है।",
          "गोल्डन राइस में बीटा-कैरोटीन (विटामिन A का पूर्वगामी) होता है; CRISPR-Cas9 जीन संपादित करता है; डीएनए फ़िंगरप्रिंटिंग ऐलेक जेफ़्रीज़ द्वारा; डॉली का क्लोन स्कॉटलैंड में (1996)।",
          "1 बाइट = 8 बिट; IPv4 32-बिट, IPv6 128-बिट; HTTPS पोर्ट 443 पर TLS का उपयोग करता है; RAM वाष्पशील है।",
          "फ़िशिंग उपयोगकर्ताओं को छलती है; रैनसमवेयर भुगतान के लिए एन्क्रिप्ट करता है; बॉटनेट = अपहृत मशीनें; ज़ीरो-डे = अज्ञात, बिना पैच वाली खामी; फ़ायरवॉल ट्रैफ़िक को छानता है।",
          "CERT-In साइबर घटनाओं को संभालता है; IT अधिनियम 2000; UPI NPCI द्वारा; PARAM सुपरकंप्यूटर C-DAC द्वारा।",
        ],
      },
    ],
    formulas: [
      "साराभाई: अंतरिक्ष कार्यक्रम के जनक; भाभा: परमाणु कार्यक्रम (BARC, ट्रॉम्बे); कलाम: मिसाइल मैन, SLV-3 निदेशक।",
      "अंतरिक्ष कालक्रम: आर्यभट 1975 → रोहिणी 1980 → चंद्रयान-1 2008 → MOM मंगल की कक्षा में 2014 → PSLV-C37 2017 → चंद्रयान-3 2023 → SpaDeX 2025।",
    ],
    traps: [
      "PSLV का चौथा चरण द्रव है, क्रायोजेनिक नहीं; क्रायोजेनिक C25 LVM3 पर है।",
      "आर्यभट USSR से प्रक्षेपित हुआ था, श्रीहरिकोटा से नहीं।",
      "चंद्रयान-2 का ऑर्बिटर अब भी काम कर रहा है; केवल लैंडर विफल हुआ।",
      "ब्रह्मोस संयुक्त उद्यम है, इसलिए 'DRDO द्वारा विकसित नहीं' का यही सामान्य उत्तर है।",
    ],
    examTips: [
      "SSC और RRB में एक-पंक्ति प्रश्न: मुख्यालय, प्रथम, मिसाइल के प्रकार, मिशनों के प्रक्षेपण यान।",
      "UPSC और राज्य PSC में कथनों की गिनती, सुमेलन और मिशनों, यानों व उद्देश्यों को मिलाने वाले कालानुक्रम पूछे जाते हैं।",
      "हाल के मिशन (गगनयान, SpaDeX, NISAR, दिव्यास्त्र) पसंदीदा हैं; हर एक के साथ वर्ष याद करें।",
    ],
  },
};

export default notes;

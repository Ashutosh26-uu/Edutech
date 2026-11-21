import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core idea",
      points: [
        "India has a tropical monsoon climate; 'monsoon' comes from the Arabic mausim, meaning season.",
        "Monsoon = seasonal reversal of winds: south-west in summer (sea to land), north-east in winter (land to sea).",
        "SE trades cross the equator and the Coriolis force turns them into the SW monsoon; the Somali (Findlater) jet carries them off East Africa.",
        "Controls: latitude, Himalaya (block cold winds, force rain), distance from sea, relief, pressure and winds.",
      ],
    },
    {
      heading: "Mechanism",
      points: [
        "Summer: intense heating of the north-west creates a low; the ITCZ (monsoon trough) shifts to the Ganga plain, about 20°–25°N, in July.",
        "Subtropical westerly jet moving north of the Himalaya in June triggers the monsoon 'burst'; tropical easterly jet at about 14°N over the peninsula strengthens it.",
        "El Niño (warm eastern Pacific) tends to weaken the monsoon; La Niña tends to strengthen it; SOI = pressure difference Tahiti − Darwin.",
        "Positive IOD (western Indian Ocean warmer than eastern) tends to help the monsoon; MJO pulses cause active and break spells.",
        "Break: monsoon trough shifts north to the Himalayan foothills — heavy rain in the hills, dry plains.",
      ],
    },
    {
      heading: "Seasons (IMD)",
      points: [
        "Winter Dec–Feb (January coldest in north); hot weather Mar–May (May peak in Rajasthan); SW monsoon Jun–Sep; retreating/post-monsoon Oct–Nov.",
        "Onset over Kerala about 1 June (after the Andaman Sea); Mumbai about 11 June; covers all India about 8 July (normals revised 2020).",
        "Withdrawal starts from west Rajasthan in September; complete by about 15 October.",
        "'October heat': hot, humid spell after withdrawal.",
      ],
    },
    {
      heading: "Rainfall distribution",
      points: [
        "Arabian Sea branch: Western Ghats windward (Mumbai, Konkan); rain shadow on Deccan (Bengaluru, Marathwada) and Tamil Nadu.",
        "Bay of Bengal branch: Mawsynram–Cherrapunji (funnel-shaped Khasi hills); deflected by the Himalaya, moves east to west along the Ganga plain; Shillong lies in rain shadow.",
        "Rainfall decreases west along the plains; Jaisalmer lowest; western Rajasthan has the highest variability; Leh is a cold desert in rain shadow.",
        "Tamil Nadu/Coromandel: most rain Oct–Dec from the NE monsoon and retreating-monsoon cyclones; Chennai's wettest month is November.",
        "Thiruvananthapuram has two peaks (June–July and October); lowest annual range of temperature; Thar has the greatest diurnal range.",
        "Isohyet = equal rainfall; isohel = sunshine; isoneph = cloudiness; isobar = pressure.",
      ],
    },
    {
      heading: "Local winds and storms",
      points: [
        "Loo: hot dry afternoon wind of NW plains in May–June.",
        "Kalbaisakhi (Bengal) = Bardoli Chheerha (Assam): evening thunderstorms; mango showers (Kerala, coastal Karnataka); blossom (coffee) showers.",
        "Western disturbances: extratropical lows from the Mediterranean giving winter rain to Punjab–Haryana (good for wheat) and snow to the hills; cold waves follow.",
        "Cyclones: Bay of Bengal (warmer, gets river water, more lows) far exceeds the Arabian Sea; peak Oct–Nov; few in July–August due to vertical wind shear; no cyclones on the equator (no Coriolis).",
        "Storm surges are worst at the funnel-shaped head of the Bay (West Bengal, Bangladesh).",
        "World winds: Chinook (Rockies, warm), Foehn (Alps, warm), Sirocco (Sahara to Italy), Mistral (cold, Rhone).",
      ],
    },
  ],
  formulas: [
    "Normal lapse rate ≈ 6.5 °C per 1,000 m.",
    "Heat wave (plains): only if max temp ≥ 40 °C.",
    "Onset Kerala ~1 June · Mumbai ~11 June · all-India ~8 July · withdrawal complete ~15 October.",
  ],
  traps: [
    "Bengaluru is in the Western Ghats' rain shadow, not on the windward side.",
    "Western disturbances are extratropical, not tropical cyclones.",
    "The Loo is hot and dry, not a humid thunderstorm.",
    "Coldest month in north India is January, not December; Chennai's wettest month is November, not July.",
    "A 'tornado' is not the name for an Indian Ocean cyclone (that is simply 'cyclone'; Pacific = typhoon, Atlantic = hurricane).",
  ],
  examTips: [
    "SSC and railways: onset date, local wind names, wettest/driest places and El Niño basics.",
    "UPSC prelims and state PSCs: jet streams, IOD and ENSO statements, rainfall order sequencing and assertion-reason on rain shadows.",
  ],
  hi: {
    sections: [
      {
        heading: "मूल विचार",
        points: [
          "भारत में उष्णकटिबंधीय मानसूनी जलवायु है; 'मानसून' शब्द अरबी शब्द मौसिम से बना है, जिसका अर्थ है ऋतु।",
          "मानसून = पवनों का मौसमी उलटाव: गर्मियों में दक्षिण-पश्चिमी (समुद्र से स्थल की ओर), सर्दियों में उत्तर-पूर्वी (स्थल से समुद्र की ओर)।",
          "दक्षिण-पूर्वी व्यापारिक पवनें भूमध्य रेखा पार करती हैं और कोरिऑलिस बल उन्हें दक्षिण-पश्चिमी मानसून में मोड़ देता है; सोमाली (फिंडलेटर) जेट उन्हें पूर्वी अफ्रीका के तट से आगे ले जाती है।",
          "नियंत्रक कारक: अक्षांश, हिमालय (ठंडी पवनों को रोकना, वर्षा करवाना), समुद्र से दूरी, उच्चावच, दाब और पवनें।",
        ],
      },
      {
        heading: "क्रियाविधि",
        points: [
          "गर्मियों में उत्तर-पश्चिम के तीव्र गर्म होने से निम्न दाब बनता है; जुलाई में ITCZ (मानसून द्रोणी) लगभग 20°–25°N पर गंगा के मैदान की ओर खिसक जाती है।",
          "जून में हिमालय के उत्तर की ओर खिसकती उपोष्णकटिबंधीय पछुआ जेट धारा मानसून के 'प्रस्फोट' को आरंभ करती है; प्रायद्वीप के ऊपर लगभग 14°N पर उष्णकटिबंधीय पूर्वी जेट धारा उसे और मज़बूत करती है।",
          "अल नीनो (गर्म पूर्वी प्रशांत) मानसून को कमज़ोर करता है; ला नीना उसे मज़बूत करता है; SOI = ताहिती − डार्विन का दाबांतर।",
          "धनात्मक IOD (पश्चिमी हिंद महासागर का पूर्वी की तुलना में गर्म होना) मानसून के लिए सहायक होता है; MJO की तरंगें सक्रिय और विराम काल पैदा करती हैं।",
          "विराम: मानसून द्रोणी उत्तर में हिमालय की तलहटी की ओर खिसक जाती है — पहाड़ों में भारी वर्षा, मैदान सूखे।",
        ],
      },
      {
        heading: "ऋतुएँ (IMD)",
        points: [
          "शीत ऋतु दिसंबर–फरवरी (उत्तर में जनवरी सबसे ठंडा); ग्रीष्म ऋतु मार्च–मई (राजस्थान में मई चरम); दक्षिण-पश्चिमी मानसून जून–सितंबर; लौटता/मानसूनोत्तर काल अक्टूबर–नवंबर।",
          "केरल में आगमन लगभग 1 जून (अंडमान सागर के बाद); मुंबई में लगभग 11 जून; पूरे भारत में लगभग 8 जुलाई (सामान्य तिथियाँ 2020 में संशोधित)।",
          "वापसी सितंबर में पश्चिमी राजस्थान से आरंभ होती है; लगभग 15 अक्टूबर तक पूर्ण।",
          "'अक्टूबर की गर्मी': वापसी के बाद गर्म और उमस भरा दौर।",
        ],
      },
      {
        heading: "वर्षा का वितरण",
        points: [
          "अरब सागर शाखा: पश्चिमी घाट का पवनमुखी ढाल (मुंबई, कोंकण); दक्कन (बेंगलुरु, मराठवाड़ा) और तमिलनाडु वृष्टि छाया में।",
          "बंगाल की खाड़ी शाखा: मावसिनराम–चेरापूंजी (कीप के आकार की खासी पहाड़ियाँ); हिमालय से मुड़कर गंगा के मैदान में पूर्व से पश्चिम की ओर बढ़ती है; शिलांग वृष्टि छाया में स्थित है।",
          "मैदानों में पश्चिम की ओर वर्षा घटती है; जैसलमेर में सबसे कम; पश्चिमी राजस्थान में वर्षा की परिवर्तिता सर्वाधिक; लेह वृष्टि छाया में स्थित शीत मरुस्थल है।",
          "तमिलनाडु/कोरोमंडल: अधिकांश वर्षा अक्टूबर–दिसंबर में उत्तर-पूर्वी मानसून और लौटते मानसून के चक्रवातों से; चेन्नई का सबसे अधिक वर्षा वाला महीना नवंबर है।",
          "तिरुवनंतपुरम में दो वर्षा-शिखर (जून–जुलाई और अक्टूबर); तापमान का वार्षिक परिसर सबसे कम; थार में दैनिक परिसर सबसे अधिक।",
          "समवर्षा रेखा (आइसोहाइट) = समान वर्षा; आइसोहेल = धूप; आइसोनेफ = बादल; आइसोबार = दाब।",
        ],
      },
      {
        heading: "स्थानीय पवनें और तूफ़ान",
        points: [
          "लू: मई–जून में उत्तर-पश्चिमी मैदानों की दोपहर बाद चलने वाली गर्म, शुष्क पवन।",
          "काल बैसाखी (बंगाल) = बारदोली छीड़ा (असम): सायंकालीन आँधी-तूफ़ान; आम की बौछारें (केरल, तटीय कर्नाटक); फूलों की (कॉफ़ी) बौछारें।",
          "पश्चिमी विक्षोभ: भूमध्य सागर से आने वाले बहिरुष्णकटिबंधीय निम्न दाब, जो पंजाब–हरियाणा में शीतकालीन वर्षा (गेहूँ के लिए लाभदायक) और पहाड़ों में हिमपात लाते हैं; इसके बाद शीत लहर आती है।",
          "चक्रवात: बंगाल की खाड़ी (अधिक गर्म, नदियों का जल मिलता है, अधिक निम्न दाब) में अरब सागर से कहीं अधिक; चरम अक्टूबर–नवंबर; ऊर्ध्वाधर पवन अपरूपण के कारण जुलाई–अगस्त में कम; भूमध्य रेखा पर चक्रवात नहीं बनते (कोरिऑलिस बल नहीं)।",
          "तूफ़ानी लहरें (स्टॉर्म सर्ज) खाड़ी के कीपनुमा शीर्ष (पश्चिम बंगाल, बांग्लादेश) पर सबसे विनाशकारी होती हैं।",
          "विश्व की पवनें: चिनूक (रॉकीज़, गर्म), फ़ोन (आल्प्स, गर्म), सिरोको (सहारा से इटली), मिस्ट्रल (ठंडी, रोन)।",
        ],
      },
    ],
    formulas: [
      "सामान्य ताप ह्रास दर ≈ 6.5 °C प्रति 1,000 m।",
      "तापघात (मैदानों में): केवल तभी जब अधिकतम तापमान ≥ 40 °C हो।",
      "आगमन केरल ~1 जून · मुंबई ~11 जून · पूरा भारत ~8 जुलाई · वापसी पूर्ण ~15 अक्टूबर।",
    ],
    traps: [
      "बेंगलुरु पश्चिमी घाट की वृष्टि छाया में है, पवनमुखी ढाल पर नहीं।",
      "पश्चिमी विक्षोभ बहिरुष्णकटिबंधीय होते हैं, उष्णकटिबंधीय चक्रवात नहीं।",
      "लू गर्म और शुष्क होती है, उमस भरा आँधी-तूफ़ान नहीं।",
      "उत्तर भारत का सबसे ठंडा महीना जनवरी है, दिसंबर नहीं; चेन्नई का सबसे अधिक वर्षा वाला महीना नवंबर है, जुलाई नहीं।",
      "'टॉरनेडो' हिंद महासागर के चक्रवात का नाम नहीं है (उसे केवल 'चक्रवात' कहते हैं; प्रशांत में = टाइफून, अटलांटिक में = हरिकेन)।",
    ],
    examTips: [
      "SSC और रेलवे: आगमन की तिथि, स्थानीय पवनों के नाम, सबसे अधिक/सबसे कम वर्षा वाले स्थान और अल नीनो की मूल बातें।",
      "UPSC प्रीलिम्स और राज्य PSC: जेट धाराएँ, IOD और ENSO पर कथन, वर्षा के क्रम का अनुक्रमण और वृष्टि छाया पर अभिकथन-कारण।",
    ],
  },
};

export default notes;

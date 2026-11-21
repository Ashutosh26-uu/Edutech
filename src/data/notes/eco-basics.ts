import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "National income",
      points: [
        "GDP: market value of all final goods and services produced within a country’s borders in a year.",
        "GNP = GDP + net factor income from abroad (counts nationals, not territory).",
        "Net = Gross − depreciation; factor cost = market price − net indirect taxes (indirect taxes − subsidies).",
        "National income = NNP at factor cost. Per capita income = national income ÷ population.",
        "Three methods: production (value added), income, expenditure. Only final goods are counted to avoid double counting.",
        "Nominal GDP uses current prices; real GDP uses base-year prices. GDP deflator = nominal ÷ real × 100.",
        "In India, GDP estimates are released by the National Statistical Office (NSO), Ministry of Statistics.",
      ],
    },
    {
      heading: "RBI and monetary policy",
      points: [
        "RBI set up on 1 April 1935 under the RBI Act, 1934 (Hilton Young Commission); nationalised in 1949; HQ Mumbai.",
        "First Governor: Sir Osborne Smith; first Indian Governor: C. D. Deshmukh.",
        "Repo rate: rate at which RBI lends short-term to banks against securities. Reverse repo: rate at which RBI absorbs money from banks.",
        "CRR: share of deposits banks keep as cash with the RBI. SLR: share kept in liquid assets (cash, gold, government securities) by the bank itself.",
        "MSF: emergency overnight borrowing by banks above the repo rate. Bank rate: longer-term lending rate with no repurchase agreement; kept aligned to MSF.",
        "Higher repo/CRR/SLR = tight money (fights inflation); lower = cheap money (boosts growth).",
        "Monetary Policy Committee (since 2016): 6 members, 3 from RBI, Governor has the casting vote; decides the repo rate.",
        "Inflation target (RBI Act amended 2016): CPI inflation 4% with a band of 2%–6%, reviewed every five years.",
      ],
    },
    {
      heading: "Money, inflation and budget",
      points: [
        "M1 (narrow money) = currency with public + demand deposits + other deposits with RBI. M3 (broad money) = M1 + time deposits.",
        "WPI is released by the Office of the Economic Adviser (DPIIT); CPI (Combined) by the NSO. RBI targets CPI.",
        "Core inflation excludes volatile food and fuel. Inflation hurts lenders and fixed-income earners, helps borrowers.",
        "Phillips curve: short-run inverse relation between inflation and unemployment.",
        "Revenue deficit = revenue expenditure − revenue receipts.",
        "Fiscal deficit = total expenditure − (revenue receipts + non-debt capital receipts) = government’s borrowing need.",
        "Primary deficit = fiscal deficit − interest payments.",
      ],
    },
    {
      heading: "Institutions and reforms",
      points: [
        "NITI Aayog replaced the Planning Commission (1950) on 1 January 2015; the Prime Minister is its chairperson.",
        "GST launched 1 July 2017 via the 101st Amendment (2016); GST Council (Art 279A) chaired by the Union Finance Minister.",
        "GST rates were rationalised to mainly 5% and 18% (plus 40% on sin/luxury goods) from 22 September 2025.",
        "“Hindu rate of growth” (about 3.5% in 1950–80) was coined by Raj Krishna.",
        "Disguised unemployment is most common in agriculture.",
        "Reports: Human Development Report – UNDP; World Development Report – World Bank; World Economic Outlook – IMF.",
      ],
    },
  ],
  formulas: [
    "GDP (expenditure) = C + I + G + (X − M).",
    "NDP = GDP − depreciation; GNP = GDP + NFIA; GDP at FC = GDP at MP − indirect taxes + subsidies.",
    "Money multiplier = 1 ÷ reserve ratio. 20% reserve → ×5, so ₹1,000 crore new reserves → up to ₹5,000 crore deposits.",
    "Primary deficit = fiscal deficit − interest payments.",
  ],
  traps: [
    "Repo = RBI lends to banks; reverse repo = RBI borrows from banks — do not swap.",
    "CRR is held with the RBI; SLR is held by the bank itself.",
    "GDP counts production within borders; GNP counts production by nationals anywhere.",
    "WPI is not released by the RBI or NSO but by the Office of the Economic Adviser, DPIIT.",
    "RBI was nationalised in 1949, not founded then.",
  ],
  examTips: [
    "Banking (IBPS, SBI, RBI) exams ask policy rates, MPC, inflation target and money supply measures.",
    "SSC and UPSC ask national income identities, deficit definitions and small numerical cases (expenditure method, multiplier).",
  ],
  hi: {
    sections: [
      {
        heading: "राष्ट्रीय आय",
        points: [
          "GDP: किसी देश की सीमाओं के भीतर एक वर्ष में उत्पादित सभी अंतिम वस्तुओं और सेवाओं का बाज़ार मूल्य।",
          "GNP = GDP + विदेशों से शुद्ध कारक आय (नागरिकों की गणना होती है, क्षेत्र की नहीं)।",
          "शुद्ध = सकल − मूल्यह्रास; कारक लागत = बाज़ार कीमत − शुद्ध अप्रत्यक्ष कर (अप्रत्यक्ष कर − सब्सिडी)।",
          "राष्ट्रीय आय = कारक लागत पर NNP। प्रति व्यक्ति आय = राष्ट्रीय आय ÷ जनसंख्या।",
          "तीन विधियाँ: उत्पादन (मूल्य वर्धन), आय, व्यय। दोहरी गणना से बचने के लिए केवल अंतिम वस्तुएँ गिनी जाती हैं।",
          "सांकेतिक GDP चालू कीमतों का उपयोग करता है; वास्तविक GDP आधार वर्ष की कीमतों का। GDP अपस्फीतिक = सांकेतिक ÷ वास्तविक × 100।",
          "भारत में GDP के अनुमान सांख्यिकी मंत्रालय के राष्ट्रीय सांख्यिकी कार्यालय (NSO) द्वारा जारी किए जाते हैं।",
        ],
      },
      {
        heading: "RBI और मौद्रिक नीति",
        points: [
          "RBI की स्थापना 1 अप्रैल 1935 को RBI अधिनियम, 1934 के तहत हुई (हिल्टन यंग आयोग); 1949 में राष्ट्रीयकृत; मुख्यालय मुंबई।",
          "पहले गवर्नर: सर ओसबोर्न स्मिथ; पहले भारतीय गवर्नर: सी. डी. देशमुख।",
          "रेपो दर: वह दर जिस पर RBI प्रतिभूतियों के बदले बैंकों को अल्पकालिक ऋण देता है। रिवर्स रेपो: वह दर जिस पर RBI बैंकों से धन सोखता है।",
          "CRR: जमाओं का वह हिस्सा जो बैंक RBI के पास नकद रखते हैं। SLR: वह हिस्सा जो बैंक स्वयं तरल परिसंपत्तियों (नकद, सोना, सरकारी प्रतिभूतियाँ) में रखता है।",
          "MSF: रेपो दर से ऊपर बैंकों द्वारा आपातकालीन रात-भर का उधार। बैंक दर: पुनर्खरीद समझौते के बिना दीर्घ अवधि की ऋण दर; MSF के अनुरूप रखी जाती है।",
          "रेपो/CRR/SLR अधिक = तंग मुद्रा (मुद्रास्फीति से लड़ना); कम = सस्ती मुद्रा (वृद्धि को बढ़ावा)।",
          "मौद्रिक नीति समिति (2016 से): 6 सदस्य, 3 RBI से, गवर्नर के पास निर्णायक मत होता है; रेपो दर तय करती है।",
          "मुद्रास्फीति लक्ष्य (RBI अधिनियम में 2016 में संशोधन): CPI मुद्रास्फीति 4%, 2%–6% की सीमा के साथ, हर पाँच वर्ष में समीक्षा।",
        ],
      },
      {
        heading: "मुद्रा, मुद्रास्फीति और बजट",
        points: [
          "M1 (संकीर्ण मुद्रा) = जनता के पास मुद्रा + माँग जमाएँ + RBI के पास अन्य जमाएँ। M3 (व्यापक मुद्रा) = M1 + सावधि जमाएँ।",
          "WPI आर्थिक सलाहकार कार्यालय (DPIIT) द्वारा जारी होता है; CPI (संयुक्त) NSO द्वारा। RBI CPI को लक्ष्य बनाता है।",
          "कोर मुद्रास्फीति में अस्थिर खाद्य और ईंधन शामिल नहीं होते। मुद्रास्फीति ऋणदाताओं और निश्चित आय वालों को हानि पहुँचाती है, उधार लेने वालों को लाभ।",
          "फ़िलिप्स वक्र: मुद्रास्फीति और बेरोज़गारी के बीच अल्पकालिक विपरीत संबंध।",
          "राजस्व घाटा = राजस्व व्यय − राजस्व प्राप्तियाँ।",
          "राजकोषीय घाटा = कुल व्यय − (राजस्व प्राप्तियाँ + गैर-ऋण पूँजीगत प्राप्तियाँ) = सरकार की उधार की आवश्यकता।",
          "प्राथमिक घाटा = राजकोषीय घाटा − ब्याज भुगतान।",
        ],
      },
      {
        heading: "संस्थाएँ और सुधार",
        points: [
          "NITI Aayog ने 1 जनवरी 2015 को योजना आयोग (1950) का स्थान लिया; प्रधानमंत्री इसके अध्यक्ष हैं।",
          "GST 1 जुलाई 2017 को 101वें संशोधन (2016) द्वारा लागू; GST परिषद (अनुच्छेद 279A) की अध्यक्षता केंद्रीय वित्त मंत्री करते हैं।",
          "22 सितंबर 2025 से GST दरों को मुख्यतः 5% और 18% (साथ ही अहितकर/विलासिता वस्तुओं पर 40%) में युक्तिसंगत बनाया गया।",
          "“हिंदू वृद्धि दर” (1950–80 में लगभग 3.5%) शब्द राज कृष्ण ने गढ़ा।",
          "प्रच्छन्न बेरोज़गारी कृषि में सबसे आम है।",
          "रिपोर्टें: मानव विकास रिपोर्ट – UNDP; विश्व विकास रिपोर्ट – विश्व बैंक; वर्ल्ड इकोनॉमिक आउटलुक – IMF।",
        ],
      },
    ],
    formulas: [
      "GDP (व्यय) = C + I + G + (X − M)।",
      "NDP = GDP − मूल्यह्रास; GNP = GDP + NFIA; कारक लागत पर GDP = बाज़ार कीमत पर GDP − अप्रत्यक्ष कर + सब्सिडी।",
      "मुद्रा गुणक = 1 ÷ आरक्षित अनुपात। 20% आरक्षित → ×5, अतः ₹1,000 करोड़ के नए आरक्षित कोष → अधिकतम ₹5,000 करोड़ की जमाएँ।",
      "प्राथमिक घाटा = राजकोषीय घाटा − ब्याज भुगतान।",
    ],
    traps: [
      "रेपो = RBI बैंकों को उधार देता है; रिवर्स रेपो = RBI बैंकों से उधार लेता है — आपस में न बदलें।",
      "CRR RBI के पास रखा जाता है; SLR बैंक स्वयं रखता है।",
      "GDP सीमाओं के भीतर उत्पादन गिनता है; GNP नागरिकों द्वारा कहीं भी किया गया उत्पादन गिनता है।",
      "WPI RBI या NSO द्वारा नहीं, बल्कि DPIIT के आर्थिक सलाहकार कार्यालय द्वारा जारी होता है।",
      "RBI का 1949 में राष्ट्रीयकरण हुआ था, स्थापना नहीं।",
    ],
    examTips: [
      "बैंकिंग (IBPS, SBI, RBI) परीक्षाओं में नीतिगत दरें, MPC, मुद्रास्फीति लक्ष्य और मुद्रा आपूर्ति के मापक पूछे जाते हैं।",
      "SSC और UPSC में राष्ट्रीय आय के सर्वसमिकाएँ, घाटों की परिभाषाएँ और छोटे संख्यात्मक प्रश्न (व्यय विधि, गुणक) आते हैं।",
    ],
  },
};

export default notes;

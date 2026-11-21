import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Money supply",
      points: [
        "M0 (reserve/high-powered money) = currency in circulation + bankers' deposits with RBI + other deposits with RBI.",
        "M1 (narrow, most liquid) = currency with public + demand deposits with banks + other deposits with RBI; cash in hand with banks is excluded.",
        "M2 = M1 + post office savings deposits; M3 (broad money) = M1 + time deposits with banks; M4 = M3 + all post office deposits (except NSCs).",
        "₹1 notes and all coins are issued by the Government (Ministry of Finance); other notes by the RBI; ₹1-and-above coins are legal tender up to ₹1,000 (Coinage Act 2011).",
        "Minimum Reserve System 1957: RBI holds ₹200 crore in gold and forex, of which ₹115 crore in gold.",
        "₹ symbol adopted 2010; ₹2,000 notes withdrawn from circulation 19 May 2023 (still legal tender); retail e-rupee pilot from 1 December 2022.",
      ],
    },
    {
      heading: "Inflation",
      points: [
        "Inflation: sustained rise in the general price level. Demand-pull: demand exceeds supply. Cost-push: input costs rise, can coexist with unemployment (stagflation).",
        "By speed: creeping (2–3%), walking, galloping (double/triple digit), hyperinflation (often >50% a month).",
        "Disinflation: slower rise; deflation: fall in prices; reflation: deliberate push-up from a slump; skewflation: rise in a few items (e.g. food); shrinkflation: smaller pack, same price.",
        "Base effect: low or high base last year distorts year-on-year inflation. Wage-price spiral: wages and prices chase each other.",
        "Unexpected inflation hurts creditors, pensioners and fixed-income earners; helps borrowers.",
        "WPI: Office of the Economic Adviser, DPIIT (Ministry of Commerce), no services; CPI (Combined): NSO, MoSPI, much bigger food weight; GDP deflator covers all domestic output.",
      ],
    },
    {
      heading: "Monetary policy and the RBI",
      points: [
        "Urjit Patel Committee (2014) → RBI Act 1934 amended 2016 for flexible inflation targeting and the MPC.",
        "Target CPI 4% ± 2%, set by the Government every five years; failure = outside the band for three consecutive quarters.",
        "MPC: six members (three RBI incl. Governor, three Government nominees), quorum four, Governor's casting vote, at least four meetings a year; it fixes the repo rate.",
        "Corridor: SDF floor (since April 2022) < repo < MSF = bank rate (ceiling). CRR kept with RBI as cash; SLR held in liquid assets by the bank itself.",
        "OMO purchase injects liquidity; sale absorbs it. MSS (2004) absorbed surplus liquidity from capital inflows. External benchmark lending from 1 October 2019 speeds transmission.",
        "Qualitative tools: moral suasion, margin requirements. Bimal Jalan Committee set the Economic Capital Framework; RBI's year became April–March from 2020–21.",
      ],
    },
    {
      heading: "BoP and the rupee",
      points: [
        "Current account = merchandise trade + invisibles (services, primary income, transfers/remittances).",
        "Capital account: FDI, FPI, external commercial borrowing, external aid, NRI deposits; overall balance changes forex reserves.",
        "Forex reserves: foreign currency assets, gold, SDRs, reserve tranche with the IMF.",
        "LERMS 1992 → unified market rate 1993 → current account convertibility 1994 → FEMA replaced FERA (in force 2000); Tarapore committees on capital account convertibility.",
        "Regime: managed float. Depreciation is market-driven; devaluation is official. Appreciation makes exports costlier and cuts imported inflation.",
        "REER: trade-weighted, inflation-adjusted rupee value.",
      ],
    },
  ],
  formulas: [
    "Money multiplier = M3 ÷ M0 (e.g. 240 ÷ 40 = 6); simple deposit multiplier = 1 ÷ CRR.",
    "Fisher: MV = PT (M money, V velocity, P price level, T transactions).",
    "Inflation % = (new index − old index) ÷ old index × 100; fall in purchasing power = rise ÷ new index × 100.",
    "Real interest ≈ nominal − inflation; post-tax real = nominal × (1 − tax rate) − inflation.",
    "Rule of 70: years for prices to double ≈ 70 ÷ inflation rate.",
    "PPP: rupee depreciates ≈ Indian inflation − foreign inflation.",
  ],
  traps: [
    "M1 is the most liquid; M3 is broad money — don't reverse them.",
    "Selling securities through OMOs reduces money supply; buying increases it.",
    "Cost-push inflation is not cured well by rate hikes; that mainly tames demand-pull.",
    "Merchandise exports are not 'invisibles'; external borrowing is capital account, not current.",
  ],
  examTips: [
    "Bank PO and SSC: M0–M4 definitions, tool effects and who publishes WPI/CPI.",
    "UPSC: statement traps on the MPC and BoP plus short numericals on multipliers, real rates and index changes.",
  ],
  hi: {
    sections: [
      {
        heading: "मुद्रा आपूर्ति",
        points: [
          "M0 (आरक्षित/उच्च-शक्ति मुद्रा) = प्रचलन में मुद्रा + RBI के पास बैंकों की जमाएँ + RBI के पास अन्य जमाएँ।",
          "M1 (संकीर्ण, सबसे तरल) = जनता के पास मुद्रा + बैंकों में माँग जमाएँ + RBI के पास अन्य जमाएँ; बैंकों के पास हाथ की नकदी शामिल नहीं।",
          "M2 = M1 + डाकघर बचत जमाएँ; M3 (व्यापक मुद्रा) = M1 + बैंकों में सावधि जमाएँ; M4 = M3 + सभी डाकघर जमाएँ (NSC को छोड़कर)।",
          "₹1 के नोट और सभी सिक्के सरकार (वित्त मंत्रालय) जारी करती है; अन्य नोट RBI; ₹1 और उससे ऊपर के सिक्के ₹1,000 तक वैध मुद्रा हैं (सिक्का निर्माण अधिनियम 2011)।",
          "न्यूनतम आरक्षित प्रणाली 1957: RBI ₹200 करोड़ का सोना और विदेशी मुद्रा रखता है, जिसमें ₹115 करोड़ सोने में।",
          "₹ चिह्न 2010 में अपनाया गया; ₹2,000 के नोट 19 मई 2023 को प्रचलन से वापस लिए गए (अब भी वैध मुद्रा); खुदरा ई-रुपया पायलट 1 दिसंबर 2022 से।",
        ],
      },
      {
        heading: "मुद्रास्फीति",
        points: [
          "मुद्रास्फीति: सामान्य मूल्य स्तर में निरंतर वृद्धि। माँग-जनित: माँग आपूर्ति से अधिक। लागत-जनित: आगत लागतें बढ़ती हैं, बेरोज़गारी के साथ भी रह सकती है (स्टैगफ़्लेशन)।",
          "गति के अनुसार: रेंगती (2–3%), चलती, दौड़ती (दो/तीन अंकों में), अति-मुद्रास्फीति (प्रायः >50% प्रति माह)।",
          "विस्फीति (डिसइन्फ्लेशन): वृद्धि धीमी; अपस्फीति: कीमतों में गिरावट; पुनःस्फीति (रिफ़्लेशन): मंदी से उबारने के लिए जानबूझकर कीमतें बढ़ाना; स्क्यूफ़्लेशन: कुछ वस्तुओं (जैसे खाद्य) में वृद्धि; श्रिंकफ़्लेशन: छोटा पैक, वही कीमत।",
          "आधार प्रभाव: पिछले वर्ष का कम या अधिक आधार वर्ष-दर-वर्ष मुद्रास्फीति को विकृत करता है। मज़दूरी-कीमत सर्पिल: मज़दूरी और कीमतें एक-दूसरे का पीछा करती हैं।",
          "अप्रत्याशित मुद्रास्फीति लेनदारों, पेंशनभोगियों और निश्चित आय वालों को हानि पहुँचाती है; उधार लेने वालों को लाभ।",
          "WPI: आर्थिक सलाहकार कार्यालय, DPIIT (वाणिज्य मंत्रालय), सेवाएँ नहीं; CPI (संयुक्त): NSO, MoSPI, खाद्य का भार कहीं अधिक; GDP अपस्फीतिक सभी घरेलू उत्पादन को कवर करता है।",
        ],
      },
      {
        heading: "मौद्रिक नीति और RBI",
        points: [
          "उर्जित पटेल समिति (2014) → लचीले मुद्रास्फीति लक्ष्यीकरण और MPC के लिए RBI अधिनियम 1934 में 2016 में संशोधन।",
          "लक्ष्य CPI 4% ± 2%, सरकार द्वारा हर पाँच वर्ष में तय; विफलता = लगातार तीन तिमाहियों तक सीमा से बाहर।",
          "MPC: छह सदस्य (तीन RBI से, गवर्नर सहित; तीन सरकार द्वारा नामित), गणपूर्ति चार, गवर्नर का निर्णायक मत, वर्ष में कम-से-कम चार बैठकें; यह रेपो दर तय करती है।",
          "गलियारा: SDF निम्न सीमा (अप्रैल 2022 से) < रेपो < MSF = बैंक दर (उच्च सीमा)। CRR RBI के पास नकद के रूप में रखा जाता है; SLR बैंक स्वयं तरल परिसंपत्तियों में रखता है।",
          "OMO क्रय तरलता डालता है; विक्रय उसे सोखता है। MSS (2004) ने पूँजी प्रवाह से आई अतिरिक्त तरलता को सोखा। 1 अक्टूबर 2019 से बाह्य बेंचमार्क ऋण-दर संप्रेषण को तेज़ करती है।",
          "गुणात्मक उपकरण: नैतिक दबाव, मार्जिन आवश्यकताएँ। बिमल जालान समिति ने आर्थिक पूँजी ढाँचा तय किया; RBI का वर्ष 2020–21 से अप्रैल–मार्च हो गया।",
        ],
      },
      {
        heading: "भुगतान संतुलन और रुपया",
        points: [
          "चालू खाता = वस्तु व्यापार + अदृश्य मदें (सेवाएँ, प्राथमिक आय, अंतरण/विप्रेषण)।",
          "पूँजी खाता: FDI, FPI, बाह्य वाणिज्यिक उधार, बाह्य सहायता, NRI जमाएँ; समग्र शेष विदेशी मुद्रा भंडार को बदलता है।",
          "विदेशी मुद्रा भंडार: विदेशी मुद्रा परिसंपत्तियाँ, सोना, SDR, IMF में आरक्षित किस्त।",
          "LERMS 1992 → एकीकृत बाज़ार दर 1993 → चालू खाता परिवर्तनीयता 1994 → FEMA ने FERA का स्थान लिया (2000 में लागू); पूँजी खाता परिवर्तनीयता पर तारापोर समितियाँ।",
          "व्यवस्था: प्रबंधित प्लवन। अवमूल्यन (डिप्रिसिएशन) बाज़ार-संचालित होता है; डीवैल्यूएशन आधिकारिक। मूल्यवृद्धि निर्यात को महँगा करती है और आयातित मुद्रास्फीति घटाती है।",
          "REER: व्यापार-भारित, मुद्रास्फीति-समायोजित रुपये का मूल्य।",
        ],
      },
    ],
    formulas: [
      "मुद्रा गुणक = M3 ÷ M0 (जैसे 240 ÷ 40 = 6); सरल जमा गुणक = 1 ÷ CRR।",
      "फ़िशर: MV = PT (M मुद्रा, V वेग, P मूल्य स्तर, T लेन-देन)।",
      "मुद्रास्फीति % = (नया सूचकांक − पुराना सूचकांक) ÷ पुराना सूचकांक × 100; क्रय शक्ति में गिरावट = वृद्धि ÷ नया सूचकांक × 100।",
      "वास्तविक ब्याज ≈ सांकेतिक − मुद्रास्फीति; कर-पश्चात वास्तविक = सांकेतिक × (1 − कर दर) − मुद्रास्फीति।",
      "70 का नियम: कीमतों के दोगुना होने के वर्ष ≈ 70 ÷ मुद्रास्फीति दर।",
      "PPP: रुपये का मूल्यह्रास ≈ भारतीय मुद्रास्फीति − विदेशी मुद्रास्फीति।",
    ],
    traps: [
      "M1 सबसे तरल है; M3 व्यापक मुद्रा है — इन्हें उलटें नहीं।",
      "OMO के माध्यम से प्रतिभूतियाँ बेचने से मुद्रा आपूर्ति घटती है; खरीदने से बढ़ती है।",
      "लागत-जनित मुद्रास्फीति दरें बढ़ाने से ठीक नहीं होती; इससे मुख्यतः माँग-जनित मुद्रास्फीति पर काबू पाया जाता है।",
      "वस्तु निर्यात 'अदृश्य मदें' नहीं हैं; बाह्य उधार पूँजी खाते में आता है, चालू खाते में नहीं।",
    ],
    examTips: [
      "बैंक PO और SSC: M0–M4 की परिभाषाएँ, उपकरणों के प्रभाव और WPI/CPI कौन प्रकाशित करता है।",
      "UPSC: MPC और भुगतान संतुलन पर कथन-जाल तथा गुणकों, वास्तविक दरों और सूचकांक परिवर्तनों पर छोटे संख्यात्मक प्रश्न।",
    ],
  },
};

export default notes;

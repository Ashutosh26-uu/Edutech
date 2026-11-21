import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "RBI basics",
      points: [
        "Set up under the RBI Act, 1934; began operations on 1 April 1935.",
        "Nationalised on 1 January 1949; central office moved from Kolkata to Mumbai in 1937.",
        "Functions: monetary policy, issuing currency (except ₹1 notes and coins, issued by the Government), banker to government, banker’s bank, regulator, forex manager.",
        "RBI does NOT accept deposits from or lend to the general public.",
        "Monetary Policy Committee: 6 members; inflation target 4% with a band of ±2% (CPI).",
      ],
    },
    {
      heading: "Monetary tools",
      points: [
        "CRR: share of deposits kept as cash with the RBI; earns no interest.",
        "SLR: share of deposits kept by banks themselves in liquid assets (cash, gold, approved securities).",
        "Repo rate: rate at which RBI lends short-term to banks against securities.",
        "Reverse repo / SDF: rate RBI pays banks for parking surplus funds; SDF sits below repo.",
        "MSF: emergency overnight borrowing for banks, priced above the repo rate.",
        "Since October 2019, new floating retail loans must be linked to an external benchmark (mostly the repo rate).",
      ],
    },
    {
      heading: "Banking history",
      points: [
        "Banking Regulation Act: 1949.",
        "SBI formed on 1 July 1955 from the Imperial Bank of India.",
        "14 major banks nationalised in July 1969; 6 more in 1980.",
        "Regional Rural Banks: 1975. NABARD: 1982. SIDBI: 1990.",
        "Mergers in 2019–20 cut public sector banks to 12 (effective April 2020).",
      ],
    },
    {
      heading: "Payment systems",
      points: [
        "NEFT: National Electronic Funds Transfer, settles in half-hourly batches, 24×7 since December 2019.",
        "RTGS: Real Time Gross Settlement, minimum ₹2 lakh, 24×7 since December 2020.",
        "IMPS: instant 24×7 transfer run by NPCI.",
        "NPCI set up in 2008; runs UPI (2016), RuPay, IMPS, NACH, AePS and FASTag (NETC).",
        "IFSC: 11 characters (4 letters for bank, 0, 6-character branch code); MICR: 9 digits.",
      ],
    },
    {
      heading: "Bank types, safety and schemes",
      points: [
        "Payments banks: no loans or credit cards; deposits up to ₹2 lakh per customer (since 2021).",
        "Small finance banks: lend mainly to small businesses, farmers and the unorganised sector.",
        "DICGC (wholly owned RBI subsidiary) insures deposits up to ₹5 lakh per depositor per bank (since 2020).",
        "CRAR minimum for Indian banks: 9%, plus a 2.5% capital conservation buffer.",
        "Priority sector lending target for domestic scheduled commercial banks: 40% of ANBC.",
        "Pradhan Mantri Jan Dhan Yojana launched in August 2014 for financial inclusion.",
      ],
    },
    {
      heading: "Instruments and terms",
      points: [
        "Cheque valid for 3 months from its date; bounce for insufficient funds is an offence under Section 138, NI Act 1881.",
        "Certificate of Deposit: issued by banks; Commercial Paper: issued by companies.",
        "KYC: Know Your Customer; NPA: loan overdue for more than 90 days.",
        "ATM: Automated Teller Machine; CBS: Core Banking Solution.",
      ],
    },
  ],
  formulas: [
    "CRR → with RBI, no interest; SLR → with the bank itself",
    "SDF < Repo < MSF (corridor)",
    "Deposit insurance ₹5 lakh; payments bank deposit cap ₹2 lakh; RTGS minimum ₹2 lakh",
    "CRAR 9% + CCB 2.5%; PSL 40% of ANBC",
  ],
  traps: [
    "Saying CRR is kept with the bank; it is with the RBI. SLR stays with the bank.",
    "Thinking MSF is cheaper than repo; it is a penalty-style higher rate.",
    "Believing payments banks can give loans.",
    "Confusing RBI’s start (1935) with its Act (1934) and nationalisation (1949).",
    "Rates like repo and CRR change often; check the latest RBI policy before the exam.",
  ],
  examTips: [
    "IBPS/SBI PO and Clerk mains and RBI Assistant/Grade B ask the most banking awareness.",
    "Statement-count and assertion–reason forms are common in recent papers.",
    "Current policy rates and newly launched schemes are asked from the last 6 months of news.",
  ],
  hi: {
    sections: [
      {
        heading: "RBI की मूल बातें",
        points: [
          "RBI अधिनियम, 1934 के तहत स्थापित; 1 अप्रैल 1935 को कार्य आरंभ किया।",
          "1 जनवरी 1949 को राष्ट्रीयकृत; केंद्रीय कार्यालय 1937 में कोलकाता से मुंबई स्थानांतरित हुआ।",
          "कार्य: मौद्रिक नीति, मुद्रा जारी करना (₹1 के नोट और सिक्कों को छोड़कर, जिन्हें सरकार जारी करती है), सरकार का बैंकर, बैंकों का बैंक, नियामक, विदेशी मुद्रा प्रबंधक।",
          "RBI आम जनता से जमा स्वीकार नहीं करता और न ही उसे ऋण देता है।",
          "मौद्रिक नीति समिति: 6 सदस्य; मुद्रास्फीति लक्ष्य 4%, ±2% की सीमा के साथ (CPI)।",
        ],
      },
      {
        heading: "मौद्रिक उपकरण",
        points: [
          "CRR: जमाओं का वह हिस्सा जो RBI के पास नकद रखा जाता है; इस पर ब्याज नहीं मिलता।",
          "SLR: जमाओं का वह हिस्सा जो बैंक स्वयं तरल परिसंपत्तियों (नकद, सोना, अनुमोदित प्रतिभूतियाँ) में रखते हैं।",
          "रेपो दर: वह दर जिस पर RBI प्रतिभूतियों के बदले बैंकों को अल्पकालिक ऋण देता है।",
          "रिवर्स रेपो / SDF: अधिशेष धन रखने पर RBI बैंकों को जो दर देता है; SDF रेपो से नीचे होती है।",
          "MSF: बैंकों के लिए आपातकालीन रात-भर का उधार, रेपो दर से ऊपर की दर पर।",
          "अक्टूबर 2019 से नए फ़्लोटिंग खुदरा ऋण को बाह्य बेंचमार्क (अधिकतर रेपो दर) से जोड़ना अनिवार्य है।",
        ],
      },
      {
        heading: "बैंकिंग का इतिहास",
        points: [
          "बैंकिंग विनियमन अधिनियम: 1949।",
          "SBI का गठन 1 जुलाई 1955 को इंपीरियल बैंक ऑफ़ इंडिया से हुआ।",
          "जुलाई 1969 में 14 प्रमुख बैंकों का राष्ट्रीयकरण; 1980 में 6 और।",
          "क्षेत्रीय ग्रामीण बैंक: 1975। NABARD: 1982। SIDBI: 1990।",
          "2019–20 के विलयों से सार्वजनिक क्षेत्र के बैंक घटकर 12 रह गए (अप्रैल 2020 से प्रभावी)।",
        ],
      },
      {
        heading: "भुगतान प्रणालियाँ",
        points: [
          "NEFT: राष्ट्रीय इलेक्ट्रॉनिक निधि अंतरण, आधे-आधे घंटे के बैचों में निपटान, दिसंबर 2019 से 24×7।",
          "RTGS: रियल टाइम ग्रॉस सेटलमेंट, न्यूनतम ₹2 लाख, दिसंबर 2020 से 24×7।",
          "IMPS: NPCI द्वारा संचालित तात्कालिक 24×7 अंतरण।",
          "NPCI की स्थापना 2008 में; UPI (2016), रुपे, IMPS, NACH, AePS और FASTag (NETC) चलाता है।",
          "IFSC: 11 अक्षर (बैंक के लिए 4 अक्षर, 0, 6 अक्षर का शाखा कोड); MICR: 9 अंक।",
        ],
      },
      {
        heading: "बैंकों के प्रकार, सुरक्षा और योजनाएँ",
        points: [
          "भुगतान बैंक: ऋण या क्रेडिट कार्ड नहीं; प्रति ग्राहक ₹2 लाख तक जमा (2021 से)।",
          "लघु वित्त बैंक: मुख्यतः छोटे व्यवसायों, किसानों और असंगठित क्षेत्र को ऋण देते हैं।",
          "DICGC (RBI की पूर्ण स्वामित्व वाली सहायक कंपनी) प्रति जमाकर्ता प्रति बैंक ₹5 लाख तक की जमाओं का बीमा करती है (2020 से)।",
          "भारतीय बैंकों के लिए CRAR न्यूनतम: 9%, साथ ही 2.5% पूँजी संरक्षण बफ़र।",
          "घरेलू अनुसूचित वाणिज्यिक बैंकों के लिए प्राथमिकता क्षेत्र ऋण लक्ष्य: ANBC का 40%।",
          "प्रधानमंत्री जन धन योजना अगस्त 2014 में वित्तीय समावेशन के लिए शुरू हुई।",
        ],
      },
      {
        heading: "लिखत और शब्दावली",
        points: [
          "चेक अपनी तिथि से 3 माह तक वैध; अपर्याप्त धन के कारण बाउंस होना परक्राम्य लिखत अधिनियम 1881 की धारा 138 के तहत अपराध है।",
          "जमा प्रमाणपत्र (CD): बैंकों द्वारा जारी; वाणिज्यिक पत्र (CP): कंपनियों द्वारा जारी।",
          "KYC: अपने ग्राहक को जानें; NPA: 90 दिन से अधिक बकाया ऋण।",
          "ATM: स्वचालित टेलर मशीन; CBS: कोर बैंकिंग समाधान।",
        ],
      },
    ],
    formulas: [
      "CRR → RBI के पास, ब्याज नहीं; SLR → बैंक के पास स्वयं",
      "SDF < रेपो < MSF (गलियारा)",
      "जमा बीमा ₹5 लाख; भुगतान बैंक जमा सीमा ₹2 लाख; RTGS न्यूनतम ₹2 लाख",
      "CRAR 9% + CCB 2.5%; PSL ANBC का 40%",
    ],
    traps: [
      "CRR को बैंक के पास रखा बताना; यह RBI के पास रहता है। SLR बैंक के पास रहता है।",
      "MSF को रेपो से सस्ता समझना; यह दंड-स्वरूप ऊँची दर है।",
      "भुगतान बैंक ऋण दे सकते हैं, ऐसा मानना।",
      "RBI की शुरुआत (1935) को उसके अधिनियम (1934) और राष्ट्रीयकरण (1949) से भ्रमित करना।",
      "रेपो और CRR जैसी दरें अक्सर बदलती हैं; परीक्षा से पहले नवीनतम RBI नीति देखें।",
    ],
    examTips: [
      "IBPS/SBI PO और क्लर्क मुख्य परीक्षा तथा RBI असिस्टेंट/ग्रेड B में बैंकिंग जागरूकता के सबसे अधिक प्रश्न आते हैं।",
      "हाल के पेपरों में कथन-गणना और अभिकथन–कारण प्रारूप आम हैं।",
      "वर्तमान नीतिगत दरें और नई शुरू की गई योजनाएँ पिछले 6 महीनों की खबरों से पूछी जाती हैं।",
    ],
  },
};

export default notes;

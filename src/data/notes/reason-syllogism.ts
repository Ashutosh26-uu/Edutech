import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core idea",
      points: [
        "Treat statements as true even if they contradict real life.",
        "A conclusion follows only if it is true in every possible Venn diagram of the statements.",
        "Draw the minimum overlap the statements force; then try to break each conclusion with another diagram.",
      ],
    },
    {
      heading: "Four standard statements",
      points: [
        "All A are B (universal positive): circle A fully inside B.",
        "No A is B (universal negative): A and B do not touch.",
        "Some A are B (particular positive): A and B overlap at least partly; “some” can also mean all.",
        "Some A are not B (particular negative): part of A lies outside B.",
      ],
    },
    {
      heading: "Conversion (immediate inference)",
      points: [
        "All A are B → Some B are A (and Some A are B). Never “All B are A”.",
        "No A is B → No B is A; also Some A are not B, Some B are not A.",
        "Some A are B → Some B are A.",
        "Some A are not B → no valid conversion.",
      ],
    },
    {
      heading: "Two-statement combinations",
      points: [
        "All + All ⇒ All: All A are B, All B are C ⇒ All A are C.",
        "All + No ⇒ No: All A are B, No B is C ⇒ No A is C.",
        "Some + All ⇒ Some: Some A are B, All B are C ⇒ Some A are C.",
        "Some + No ⇒ Some not: Some A are B, No B is C ⇒ Some A are not C.",
        "All + Some, Some + Some, No + No ⇒ no definite conclusion between the end terms.",
        "No A is B + All B are C ⇒ only “Some C are not A” (reverse form), not “No A is C”.",
      ],
    },
    {
      heading: "Possibility and special cases",
      points: [
        "“X being Y is a possibility” is true if some valid diagram allows it and no statement forbids it.",
        "A possibility is false if a definite “No” or “All” rules it out.",
        "“Only a few A are B” = Some A are B and Some A are not B; so “All A are B” is impossible.",
        "Either–or pair: if two conclusions are about the same terms, neither follows alone, and one is “Some” and the other “No”, answer “either I or II”.",
        "“Some A are not C” is NOT the same as “No A is C”.",
      ],
    },
  ],
  formulas: [
    "All + All = All; All + No = No; Some + All = Some; Some + No = Some not",
    "All + Some, Some + Some, No + No, Some not + anything = no definite link",
    "Complementary pair (Some/No on same two terms, neither definite) ⇒ either I or II follows",
  ],
  traps: [
    "Converting “All A are B” into “All B are A”.",
    "Using real-world knowledge instead of the given statements.",
    "Thinking “Some + Some” gives a conclusion; it never does.",
    "Applying the either–or rule when one conclusion already follows definitely.",
    "Marking a possibility true when an earlier “No” statement blocks it.",
  ],
  examTips: [
    "SBI/IBPS PO and Clerk, SSC CGL and railway exams use 2–3 statement sets with 2 conclusions.",
    "Bank papers lean heavily on possibility and “only a few” statements.",
    "Draw each set in under 30 seconds; use the combination table to verify quickly.",
  ],
  hi: {
    sections: [
      {
        heading: "मूल विचार",
        points: [
          "कथनों को सत्य मानिए, भले वे वास्तविक जीवन के विपरीत हों।",
          "निष्कर्ष तभी निकलता है जब वह कथनों के हर संभव वेन आरेख में सत्य हो।",
          "कथनों द्वारा बाध्य न्यूनतम अतिव्यापन बनाइए; फिर किसी अन्य आरेख से हर निष्कर्ष को तोड़ने का प्रयास कीजिए।",
        ],
      },
      {
        heading: "चार मानक कथन",
        points: [
          "सभी A, B हैं (सार्वभौमिक सकारात्मक): वृत्त A पूरी तरह B के भीतर।",
          "कोई A, B नहीं है (सार्वभौमिक नकारात्मक): A और B एक-दूसरे को नहीं छूते।",
          "कुछ A, B हैं (विशेष सकारात्मक): A और B कम से कम आंशिक रूप से अतिव्यापित होते हैं; “कुछ” का अर्थ सभी भी हो सकता है।",
          "कुछ A, B नहीं हैं (विशेष नकारात्मक): A का एक भाग B के बाहर है।",
        ],
      },
      {
        heading: "परिवर्तन (प्रत्यक्ष अनुमान)",
        points: [
          "सभी A, B हैं → कुछ B, A हैं (और कुछ A, B हैं)। कभी “सभी B, A हैं” नहीं।",
          "कोई A, B नहीं है → कोई B, A नहीं है; साथ ही कुछ A, B नहीं हैं, कुछ B, A नहीं हैं।",
          "कुछ A, B हैं → कुछ B, A हैं।",
          "कुछ A, B नहीं हैं → कोई वैध परिवर्तन नहीं।",
        ],
      },
      {
        heading: "दो-कथन संयोजन",
        points: [
          "सभी + सभी ⇒ सभी: सभी A, B हैं, सभी B, C हैं ⇒ सभी A, C हैं।",
          "सभी + कोई नहीं ⇒ कोई नहीं: सभी A, B हैं, कोई B, C नहीं है ⇒ कोई A, C नहीं है।",
          "कुछ + सभी ⇒ कुछ: कुछ A, B हैं, सभी B, C हैं ⇒ कुछ A, C हैं।",
          "कुछ + कोई नहीं ⇒ कुछ नहीं हैं: कुछ A, B हैं, कोई B, C नहीं है ⇒ कुछ A, C नहीं हैं।",
          "सभी + कुछ, कुछ + कुछ, कोई नहीं + कोई नहीं ⇒ सिरों के पदों के बीच कोई निश्चित निष्कर्ष नहीं।",
          "कोई A, B नहीं है + सभी B, C हैं ⇒ केवल “कुछ C, A नहीं हैं” (उलटा रूप), “कोई A, C नहीं है” नहीं।",
        ],
      },
      {
        heading: "संभावना और विशेष स्थितियाँ",
        points: [
          "“X का Y होना एक संभावना है” सत्य है यदि कोई वैध आरेख उसे अनुमति दे और कोई कथन उसे निषिद्ध न करे।",
          "संभावना असत्य है यदि कोई निश्चित “कोई नहीं” या “सभी” उसे बाहर कर दे।",
          "“केवल कुछ A, B हैं” = कुछ A, B हैं और कुछ A, B नहीं हैं; इसलिए “सभी A, B हैं” असंभव है।",
          "या तो–या जोड़ा: यदि दो निष्कर्ष एक ही पदों के बारे में हों, अकेले कोई न निकले, और एक “कुछ” तथा दूसरा “कोई नहीं” हो, तो उत्तर “I या II में से कोई एक” है।",
          "“कुछ A, C नहीं हैं” वही नहीं है जो “कोई A, C नहीं है”।",
        ],
      },
    ],
    formulas: [
      "सभी + सभी = सभी; सभी + कोई नहीं = कोई नहीं; कुछ + सभी = कुछ; कुछ + कोई नहीं = कुछ नहीं हैं",
      "सभी + कुछ, कुछ + कुछ, कोई नहीं + कोई नहीं, कुछ नहीं हैं + कुछ भी = कोई निश्चित संबंध नहीं",
      "पूरक जोड़ा (उन्हीं दो पदों पर कुछ/कोई नहीं, कोई निश्चित नहीं) ⇒ I या II में से कोई एक निकलता है",
    ],
    traps: [
      "“सभी A, B हैं” को “सभी B, A हैं” में बदल देना।",
      "दिए गए कथनों की जगह वास्तविक दुनिया का ज्ञान प्रयोग करना।",
      "“कुछ + कुछ” से निष्कर्ष मान लेना; यह कभी निष्कर्ष नहीं देता।",
      "जब एक निष्कर्ष पहले से निश्चित रूप से निकल रहा हो, तब भी या तो–या नियम लगाना।",
      "जब पहले का कोई “कोई नहीं” कथन रोकता हो, तब भी संभावना को सत्य चिह्नित करना।",
    ],
    examTips: [
      "SBI/IBPS PO और क्लर्क, SSC CGL और रेलवे परीक्षाओं में 2–3 कथनों वाले समूह 2 निष्कर्षों के साथ आते हैं।",
      "बैंक पेपर संभावना और “केवल कुछ” कथनों पर बहुत निर्भर हैं।",
      "हर समूह 30 सेकंड से कम में बनाइए; शीघ्र जाँचने के लिए संयोजन तालिका का प्रयोग कीजिए।",
    ],
  },
};

export default notes;

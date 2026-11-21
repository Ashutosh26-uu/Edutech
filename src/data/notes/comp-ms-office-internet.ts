import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "MS Word and PowerPoint shortcuts",
      points: [
        "Ctrl + B / I / U: bold, italic, underline; Ctrl + L / E / R / J: left, centre, right, justify",
        "Ctrl + K hyperlink; Ctrl + Enter page break; Ctrl + Home / End: start / end of document",
        "Ctrl + F find; Ctrl + H replace; Ctrl + Z undo; Ctrl + Y redo; Ctrl + A select all",
        "F7 spelling and grammar; Shift + F3 changes case; F12 Save As",
        "PowerPoint: F5 starts the show from the first slide; Shift + F5 from the current slide; Esc ends it",
      ],
    },
    {
      heading: "MS Excel",
      points: [
        "Relative A1 changes when copied; absolute $A$1 never changes; mixed $A1 or A$1 locks one part; F4 toggles",
        "COUNT counts numeric cells; COUNTA counts non-empty cells (text and 0 included); COUNTBLANK counts empty ones",
        "AVERAGE, SUM, MIN and MAX ignore text and blank cells in a range",
        "IF(condition, value-if-true, value-if-false); AND is true only if all are true; OR if any one is true",
        "INT rounds down to the integer; ROUND(x, n) to n decimals",
        "Errors: #DIV/0! divide by zero or blank, #NAME? unknown function name, #VALUE! wrong data type, #REF! invalid cell reference",
        "Extensions: .docx, .xlsx, .pptx (2007 onwards); .doc, .xls, .ppt (older); .xlsm macro-enabled workbook",
      ],
    },
    {
      heading: "Internet, e-mail and file formats",
      points: [
        "SMTP sends mail; POP3 downloads and usually removes it from the server; IMAP keeps it on the server and syncs devices",
        "Ports: HTTP 80, HTTPS 443, FTP 21, SSH 22, SMTP 25, DNS 53",
        "IPv4 is 32-bit, four numbers 0–255 (e.g. 172.31.0.1); IPv6 is 128-bit in hexadecimal",
        "DNS turns domain names into IP addresses",
        "CC recipients are visible to all; BCC recipients are hidden from others",
        "JPEG: lossy, for photos; PNG: lossless with transparency; GIF: 256 colours, simple animation",
      ],
    },
    {
      heading: "Networks and devices",
      points: [
        "By area: PAN < LAN < MAN < WAN; the internet is the largest WAN",
        "Hub broadcasts to all ports; switch sends to the right device using MAC addresses inside a LAN",
        "Router connects different networks using IP addresses; modem converts digital and analogue signals",
        "Topologies: bus, star, ring, mesh, tree; star depends on a central device",
      ],
    },
    {
      heading: "Cyber security and law",
      points: [
        "Virus needs a host file and runs when it is opened; worm spreads on its own across networks; Trojan hides inside useful-looking software",
        "Ransomware encrypts files and demands payment; WannaCry (May 2017) demanded Bitcoin",
        "Spyware and keyloggers steal data; adware shows unwanted ads",
        "Phishing (e-mail), vishing (voice call), smishing (SMS), pharming (redirect to a fake site via DNS)",
        "Two-factor authentication: password plus OTP; a firewall filters incoming and outgoing traffic",
        "IT Act 2000; Section 66A struck down in Shreya Singhal v. Union of India (2015); 66C identity theft, 66D cheating by personation",
        "CERT-In, India's cyber incident response agency, works under MeitY",
      ],
    },
  ],
  traps: [
    "Thinking COUNTA skips zeros or text; it counts every non-empty cell",
    "Mixing up POP3 and IMAP: only IMAP keeps mail synced on the server",
    "Calling a switch a router; the router joins different networks",
    "Accepting 256 as a valid IPv4 octet; the maximum is 255",
    "Saying a virus spreads by itself; that is a worm",
  ],
  examTips: [
    "IBPS/SBI PO and Clerk, RRB and SSC CHSL ask direct shortcut, extension and protocol questions",
    "Excel formula outputs (COUNT, COUNTA, AVERAGE, IF) and statement-count questions on malware are rising",
    "Recent papers add questions on cyber fraud types and the IT Act; keep years attached to cases and attacks",
  ],
  hi: {
    sections: [
      {
        heading: "MS Word और PowerPoint शॉर्टकट",
        points: [
          "Ctrl + B / I / U: बोल्ड, इटैलिक, रेखांकन; Ctrl + L / E / R / J: बाएँ, केंद्र, दाएँ, समायोजित (जस्टिफ़ाई)",
          "Ctrl + K हाइपरलिंक; Ctrl + Enter पृष्ठ विराम; Ctrl + Home / End: दस्तावेज़ की शुरुआत / अंत",
          "Ctrl + F खोजें; Ctrl + H बदलें; Ctrl + Z पूर्ववत; Ctrl + Y पुनः करें; Ctrl + A सब चुनें",
          "F7 वर्तनी और व्याकरण; Shift + F3 अक्षर-रूप (केस) बदलता है; F12 इस रूप में सहेजें (Save As)",
          "PowerPoint: F5 पहली स्लाइड से शो शुरू करता है; Shift + F5 वर्तमान स्लाइड से; Esc उसे समाप्त करता है",
        ],
      },
      {
        heading: "MS Excel",
        points: [
          "सापेक्ष A1 कॉपी करने पर बदलता है; निरपेक्ष $A$1 कभी नहीं बदलता; मिश्रित $A1 या A$1 एक भाग को स्थिर रखता है; F4 इन्हें बदलता है",
          "COUNT संख्यात्मक कक्ष गिनता है; COUNTA गैर-रिक्त कक्ष गिनता है (पाठ और 0 सहित); COUNTBLANK रिक्त कक्ष गिनता है",
          "AVERAGE, SUM, MIN और MAX किसी परास में पाठ और रिक्त कक्षों की उपेक्षा करते हैं",
          "IF(शर्त, सत्य-होने-पर-मान, असत्य-होने-पर-मान); AND तभी सत्य है जब सभी सत्य हों; OR तब जब कोई एक सत्य हो",
          "INT पूर्णांक तक नीचे पूर्णांकित करता है; ROUND(x, n) n दशमलव स्थानों तक",
          "त्रुटियाँ: #DIV/0! शून्य या रिक्त से भाग, #NAME? अज्ञात फ़ंक्शन नाम, #VALUE! गलत डेटा प्रकार, #REF! अमान्य कक्ष संदर्भ",
          "एक्सटेंशन: .docx, .xlsx, .pptx (2007 से); .doc, .xls, .ppt (पुराने); .xlsm मैक्रो-सक्षम वर्कबुक",
        ],
      },
      {
        heading: "इंटरनेट, ई-मेल और फ़ाइल प्रारूप",
        points: [
          "SMTP मेल भेजता है; POP3 डाउनलोड करता है और प्रायः सर्वर से हटा देता है; IMAP उसे सर्वर पर रखता है और उपकरणों को सिंक करता है",
          "पोर्ट: HTTP 80, HTTPS 443, FTP 21, SSH 22, SMTP 25, DNS 53",
          "IPv4 32-बिट है, 0–255 की चार संख्याएँ (जैसे 172.31.0.1); IPv6 128-बिट है, षोडशाधारी में",
          "DNS डोमेन नामों को IP पतों में बदलता है",
          "CC प्राप्तकर्ता सभी को दिखते हैं; BCC प्राप्तकर्ता दूसरों से छिपे रहते हैं",
          "JPEG: हानिपूर्ण (lossy) संपीड़न, फ़ोटो के लिए; PNG: हानिरहित, पारदर्शिता सहित; GIF: 256 रंग, सरल एनिमेशन",
        ],
      },
      {
        heading: "नेटवर्क और उपकरण",
        points: [
          "क्षेत्र के अनुसार: PAN < LAN < MAN < WAN; इंटरनेट सबसे बड़ा WAN है",
          "हब सभी पोर्टों को प्रसारित करता है; स्विच LAN के भीतर MAC पतों से सही उपकरण को भेजता है",
          "राउटर IP पतों से भिन्न नेटवर्कों को जोड़ता है; मॉडेम डिजिटल और एनालॉग संकेतों को बदलता है",
          "टोपोलॉजी: बस, स्टार, रिंग, मेश, ट्री; स्टार एक केंद्रीय उपकरण पर निर्भर है",
        ],
      },
      {
        heading: "साइबर सुरक्षा और कानून",
        points: [
          "वायरस को मेज़बान फ़ाइल चाहिए और वह खुलने पर चलता है; वर्म नेटवर्कों पर स्वयं फैलता है; ट्रोजन उपयोगी दिखने वाले सॉफ़्टवेयर में छिपा रहता है",
          "रैंसमवेयर फ़ाइलें एन्क्रिप्ट करता है और भुगतान माँगता है; WannaCry (मई 2017) ने बिटकॉइन माँगा",
          "स्पाइवेयर और कीलॉगर डेटा चुराते हैं; एडवेयर अवांछित विज्ञापन दिखाता है",
          "फ़िशिंग (ई-मेल), विशिंग (वॉयस कॉल), स्मिशिंग (SMS), फ़ार्मिंग (DNS से नकली साइट पर पुनर्निर्देशन)",
          "द्वि-कारक प्रमाणीकरण: पासवर्ड और OTP; फ़ायरवॉल आने-जाने वाले ट्रैफ़िक को छानता है",
          "IT Act 2000; धारा 66A को श्रेया सिंघल बनाम भारत संघ (2015) में रद्द किया गया; 66C पहचान की चोरी, 66D प्रतिरूपण द्वारा धोखाधड़ी",
          "CERT-In, भारत की साइबर घटना प्रतिक्रिया एजेंसी, MeitY के अधीन कार्य करती है",
        ],
      },
    ],
    traps: [
      "यह सोचना कि COUNTA शून्य या पाठ छोड़ देता है; यह हर गैर-रिक्त कक्ष गिनता है",
      "POP3 और IMAP को मिला देना: केवल IMAP मेल को सर्वर पर सिंक रखता है",
      "स्विच को राउटर कहना; राउटर भिन्न नेटवर्कों को जोड़ता है",
      "256 को वैध IPv4 ऑक्टेट मानना; अधिकतम 255 है",
      "यह कहना कि वायरस स्वयं फैलता है; वह वर्म है",
    ],
    examTips: [
      "IBPS/SBI PO और क्लर्क, RRB और SSC CHSL सीधे शॉर्टकट, एक्सटेंशन और प्रोटोकॉल प्रश्न पूछते हैं",
      "Excel सूत्र आउटपुट (COUNT, COUNTA, AVERAGE, IF) और मैलवेयर पर कथन-गणना प्रश्न बढ़ रहे हैं",
      "हाल के पेपर साइबर धोखाधड़ी के प्रकारों और IT Act पर प्रश्न जोड़ते हैं; मामलों और हमलों के साथ वर्ष याद रखिए",
    ],
  },
};

export default notes;

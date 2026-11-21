import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Hardware basics",
      points: [
        "CPU = ALU (arithmetic and logic) + CU (control unit) + registers; called the brain of the computer.",
        "Input devices: keyboard, mouse, scanner, microphone, joystick, light pen, barcode reader.",
        "Output devices: monitor, printer, speaker, plotter, projector. Touchscreen is both.",
        "Motherboard holds CPU, RAM and expansion slots; SMPS supplies power.",
      ],
    },
    {
      heading: "Memory and storage",
      points: [
        "RAM: volatile, read–write, primary memory. ROM: non-volatile, holds firmware/BIOS.",
        "Cache: small, very fast memory between CPU and RAM.",
        "Speed order: registers > cache > RAM > SSD > HDD.",
        "Secondary storage: HDD, SSD, pen drive, CD/DVD, Blu-ray.",
        "1 nibble = 4 bits; 1 byte = 8 bits; 1 KB = 1024 bytes; then MB, GB, TB, PB.",
      ],
    },
    {
      heading: "Software and languages",
      points: [
        "System software: OS (Windows, Linux, macOS, Android), drivers, utilities.",
        "Application software: MS Word, Excel, browsers, games.",
        "Assembler: assembly → machine code. Compiler: whole program at once. Interpreter: line by line.",
        "Machine language is binary (0s and 1s); high-level languages need translation.",
      ],
    },
    {
      heading: "Number systems",
      points: [
        "Binary base 2, octal base 8, decimal base 10, hexadecimal base 16 (0–9, A–F).",
        "Hex to decimal: 1F = 1×16 + 15 = 31; 2A = 42.",
        "Binary to decimal: 1011 = 8 + 0 + 2 + 1 = 11.",
        "Group binary digits in 3s for octal, in 4s for hex.",
      ],
    },
    {
      heading: "Networking and internet",
      points: [
        "LAN (building), MAN (city), WAN (country/world); internet is the largest WAN.",
        "HTTP port 80, HTTPS port 443; FTP transfers files; SMTP sends email; POP3/IMAP receive email.",
        "DHCP assigns IP addresses automatically; DNS converts domain names to IP addresses.",
        "IPv4 = 32 bits; IPv6 = 128 bits. MAC address = 48 bits.",
        "WWW: World Wide Web (Tim Berners-Lee, 1989); URL: Uniform Resource Locator.",
        "Router joins networks; switch connects devices in a LAN; modem converts digital ↔ analogue.",
      ],
    },
    {
      heading: "Generations and shortcuts",
      points: [
        "Generations: 1st vacuum tubes, 2nd transistors, 3rd integrated circuits, 4th microprocessors (VLSI), 5th AI.",
        "Ctrl + Z undo, Ctrl + Y redo, Ctrl + U underline, Ctrl + P print, Ctrl + S save.",
        "Ctrl + C copy, Ctrl + X cut, Ctrl + V paste, Ctrl + A select all, Ctrl + F find.",
        "F5 in PowerPoint starts the slide show; F7 runs spell check in Word; Alt + F4 closes a window.",
      ],
    },
  ],
  formulas: [
    "1 byte = 8 bits; 1 KB = 1024 B; 1 MB = 1024 KB; 1 GB = 1024 MB",
    "Hex digit A = 10 … F = 15",
    "HTTP 80, HTTPS 443, FTP 20/21, SMTP 25, DNS 53",
    "IPv4 32-bit, IPv6 128-bit, MAC 48-bit",
  ],
  traps: [
    "Calling ROM volatile; ROM keeps data without power, RAM does not.",
    "Treating MS Office as system software; it is application software.",
    "Mixing compiler (whole program) with interpreter (line by line).",
    "Using 1 KB = 1000 bytes in computer questions; exams use 1024.",
    "Confusing DNS (names to IP) with DHCP (assigns IP).",
  ],
  examTips: [
    "IBPS/SBI Clerk and PO mains, RRB and SSC papers ask full forms, memory, shortcuts and networking.",
    "Number-system conversions and statement-count items appear in harder papers.",
    "Revise full forms in bulk; they are the quickest marks.",
  ],
  hi: {
    sections: [
      {
        heading: "हार्डवेयर की मूल बातें",
        points: [
          "CPU = ALU (अंकगणितीय और तार्किक) + CU (नियंत्रण इकाई) + रजिस्टर; इसे कंप्यूटर का मस्तिष्क कहा जाता है।",
          "इनपुट उपकरण: कीबोर्ड, माउस, स्कैनर, माइक्रोफ़ोन, जॉयस्टिक, लाइट पेन, बारकोड रीडर।",
          "आउटपुट उपकरण: मॉनिटर, प्रिंटर, स्पीकर, प्लॉटर, प्रोजेक्टर। टचस्क्रीन दोनों है।",
          "मदरबोर्ड में CPU, RAM और विस्तार स्लॉट होते हैं; SMPS बिजली देता है।",
        ],
      },
      {
        heading: "मेमोरी और भंडारण",
        points: [
          "RAM: अस्थायी (वोलेटाइल), पठन–लेखन, प्राथमिक मेमोरी। ROM: स्थायी (नॉन-वोलेटाइल), फ़र्मवेयर/BIOS रखती है।",
          "कैश: CPU और RAM के बीच छोटी, बहुत तेज़ मेमोरी।",
          "गति क्रम: रजिस्टर > कैश > RAM > SSD > HDD।",
          "द्वितीयक भंडारण: HDD, SSD, पेन ड्राइव, CD/DVD, ब्लू-रे।",
          "1 निबल = 4 बिट; 1 बाइट = 8 बिट; 1 KB = 1024 बाइट; फिर MB, GB, TB, PB।",
        ],
      },
      {
        heading: "सॉफ़्टवेयर और भाषाएँ",
        points: [
          "सिस्टम सॉफ़्टवेयर: OS (Windows, Linux, macOS, Android), ड्राइवर, यूटिलिटी।",
          "एप्लिकेशन सॉफ़्टवेयर: MS Word, Excel, ब्राउज़र, खेल।",
          "असेंबलर: असेंबली → मशीन कोड। कंपाइलर: पूरा प्रोग्राम एक साथ। इंटरप्रेटर: पंक्ति-दर-पंक्ति।",
          "मशीन भाषा बाइनरी (0 और 1) होती है; उच्च-स्तरीय भाषाओं को अनुवाद की आवश्यकता होती है।",
        ],
      },
      {
        heading: "संख्या पद्धतियाँ",
        points: [
          "बाइनरी आधार 2, अष्टाधारी आधार 8, दशमलव आधार 10, षोडशाधारी (हेक्साडेसिमल) आधार 16 (0–9, A–F)।",
          "हेक्स से दशमलव: 1F = 1×16 + 15 = 31; 2A = 42।",
          "बाइनरी से दशमलव: 1011 = 8 + 0 + 2 + 1 = 11।",
          "अष्टाधारी के लिए बाइनरी अंकों को 3-3 के समूह में, हेक्स के लिए 4-4 के समूह में बाँटिए।",
        ],
      },
      {
        heading: "नेटवर्किंग और इंटरनेट",
        points: [
          "LAN (भवन), MAN (नगर), WAN (देश/विश्व); इंटरनेट सबसे बड़ा WAN है।",
          "HTTP पोर्ट 80, HTTPS पोर्ट 443; FTP फ़ाइलें स्थानांतरित करता है; SMTP ईमेल भेजता है; POP3/IMAP ईमेल प्राप्त करते हैं।",
          "DHCP स्वतः IP पते देता है; DNS डोमेन नामों को IP पतों में बदलता है।",
          "IPv4 = 32 बिट; IPv6 = 128 बिट। MAC पता = 48 बिट।",
          "WWW: वर्ल्ड वाइड वेब (टिम बर्नर्स-ली, 1989); URL: यूनिफ़ॉर्म रिसोर्स लोकेटर।",
          "राउटर नेटवर्कों को जोड़ता है; स्विच LAN में उपकरणों को जोड़ता है; मॉडेम डिजिटल ↔ एनालॉग में बदलता है।",
        ],
      },
      {
        heading: "पीढ़ियाँ और शॉर्टकट",
        points: [
          "पीढ़ियाँ: पहली निर्वात नलिकाएँ, दूसरी ट्रांज़िस्टर, तीसरी एकीकृत परिपथ, चौथी माइक्रोप्रोसेसर (VLSI), पाँचवीं AI।",
          "Ctrl + Z पूर्ववत, Ctrl + Y पुनः करें, Ctrl + U रेखांकन, Ctrl + P प्रिंट, Ctrl + S सहेजें।",
          "Ctrl + C कॉपी, Ctrl + X कट, Ctrl + V पेस्ट, Ctrl + A सब चुनें, Ctrl + F खोजें।",
          "PowerPoint में F5 स्लाइड शो शुरू करता है; Word में F7 वर्तनी जाँच चलाता है; Alt + F4 विंडो बंद करता है।",
        ],
      },
    ],
    formulas: [
      "1 बाइट = 8 बिट; 1 KB = 1024 B; 1 MB = 1024 KB; 1 GB = 1024 MB",
      "हेक्स अंक A = 10 … F = 15",
      "HTTP 80, HTTPS 443, FTP 20/21, SMTP 25, DNS 53",
      "IPv4 32-बिट, IPv6 128-बिट, MAC 48-बिट",
    ],
    traps: [
      "ROM को अस्थायी कहना; ROM बिजली के बिना भी डेटा रखती है, RAM नहीं।",
      "MS Office को सिस्टम सॉफ़्टवेयर मानना; यह एप्लिकेशन सॉफ़्टवेयर है।",
      "कंपाइलर (पूरा प्रोग्राम) को इंटरप्रेटर (पंक्ति-दर-पंक्ति) से मिला देना।",
      "कंप्यूटर प्रश्नों में 1 KB = 1000 बाइट लेना; परीक्षाएँ 1024 लेती हैं।",
      "DNS (नाम से IP) को DHCP (IP देना) से उलझा देना।",
    ],
    examTips: [
      "IBPS/SBI क्लर्क और PO मुख्य परीक्षा, RRB और SSC पेपरों में पूर्ण रूप, मेमोरी, शॉर्टकट और नेटवर्किंग पूछे जाते हैं।",
      "संख्या-पद्धति रूपांतरण और कथन-गणना प्रश्न कठिन पेपरों में आते हैं।",
      "पूर्ण रूप थोक में दोहराइए; ये सबसे तेज़ अंक हैं।",
    ],
  },
};

export default notes;

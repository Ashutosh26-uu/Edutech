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
};

export default notes;

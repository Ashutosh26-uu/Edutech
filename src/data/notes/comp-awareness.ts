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
};

export default notes;

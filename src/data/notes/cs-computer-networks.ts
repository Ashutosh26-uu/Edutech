import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Layers and devices",
      points: [
        "OSI (bottom → top): Physical, Data Link, Network, Transport, Session, Presentation, Application",
        "TCP/IP merges the top three into Application and the bottom two into Link (or Network Access)",
        "PDUs: bits (L1), frames (L2), packets (L3), segments (L4, TCP) or datagrams (UDP)",
        "Hub L1 – one collision domain; switch L2 – each port its own collision domain; router L3 – splits broadcast domains",
        "MAC address 48 bits (L2); IPv4 32 bits, IPv6 128 bits (L3); port 16 bits (L4)",
      ],
    },
    {
      heading: "IPv4 addressing and subnetting",
      points: [
        "Classes by first octet: A 1–126, B 128–191, C 192–223, D 224–239 (multicast), E 240–255; 127.x is loopback",
        "Private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16",
        "Usable hosts = 2^h − 2 (network and broadcast addresses excluded), h = host bits",
        "Block size = 256 − the interesting mask octet; subnets start at multiples of the block size",
        "Broadcast address = next subnet's address − 1",
        "CIDR aggregation needs contiguous, aligned blocks with a common prefix; routers use the longest-prefix match",
      ],
    },
    {
      heading: "Data link layer",
      points: [
        "Stop-and-wait: one frame per round trip; Go-Back-N resends from the lost frame; Selective Repeat resends only the lost frame",
        "CSMA/CD (wired Ethernet) detects collisions; CSMA/CA (Wi-Fi) avoids them",
        "Pure ALOHA peak throughput 18.4% (1/2e); slotted ALOHA 36.8% (1/e)",
        "CRC: append (degree of generator) zeros, divide by mod-2 (XOR) division, the remainder is the CRC",
        "ARP maps IP → MAC: request is broadcast, reply is unicast",
      ],
    },
    {
      heading: "Transport layer",
      points: [
        "TCP: connection-oriented, reliable, ordered, flow and congestion control; UDP: connectionless, no guarantees, low overhead",
        "3-way handshake SYN → SYN-ACK → ACK; SYN and FIN each consume one sequence number; close is 4-way",
        "TIME_WAIT lasts 2 × MSL so late segments die out",
        "Flow control: receiver window; congestion control: cwnd",
        "Slow start doubles cwnd each RTT up to ssthresh, then congestion avoidance adds 1 MSS per RTT",
        "On timeout: ssthresh = cwnd/2 and cwnd = 1 MSS; on 3 duplicate ACKs (Reno): fast retransmit, cwnd halves",
      ],
    },
    {
      heading: "Routing and application layer",
      points: [
        "Distance vector (RIP, max 15 hops, count-to-infinity problem); link state (OSPF, Dijkstra); BGP is path vector between autonomous systems",
        "Ports: FTP 20/21, SSH 22, Telnet 23, SMTP 25, DNS 53, DHCP 67/68, HTTP 80, POP3 110, IMAP 143, SNMP 161, HTTPS 443",
        "DNS uses UDP 53 for queries and TCP 53 for zone transfers and large replies",
        "DHCP DORA: Discover, Offer, Request, Acknowledge",
        "NAT/PAT lets many private hosts share one public IP by mapping ports",
        "HTTP is stateless; cookies add state; HTTPS = HTTP over TLS",
      ],
    },
  ],
  formulas: [
    "Transmission time Tt = L / B; propagation time Tp = distance / speed",
    "Stop-and-wait efficiency = 1 / (1 + 2a), a = Tp / Tt; window W gives min(1, W / (1 + 2a))",
    "Go-Back-N window ≤ 2^k − 1; Selective Repeat window ≤ 2^(k − 1) (k sequence-number bits)",
    "CSMA/CD minimum frame size = 2 × Tp × B",
    "Hamming check bits r: 2^r ≥ m + r + 1",
    "Detect d errors: d_min = d + 1; correct t errors: d_min = 2t + 1",
    "Nyquist (noiseless) = 2B log₂ L; Shannon capacity = B log₂(1 + SNR)",
  ],
  traps: [
    "Forgetting to subtract 2 for usable hosts (except /31 and /32 special cases)",
    "Using Go-Back-N's window limit for Selective Repeat",
    "Saying DNS is UDP-only",
    "Thinking a switch splits broadcast domains – only routers (or VLANs) do",
    "Forgetting that SYN consumes a sequence number when computing the next sequence number",
  ],
  examTips: [
    "Subnetting numericals (hosts, subnet address, broadcast address) appear in almost every placement CN section",
    "Expect one efficiency or window-size numerical and one TCP congestion-window trace",
    "Interviews ask OSI vs TCP/IP, TCP vs UDP, what happens when you type a URL, and common port numbers",
  ],
};

export default notes;

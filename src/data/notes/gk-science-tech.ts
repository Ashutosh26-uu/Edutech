import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Space: institutions and milestones",
      points: [
        "INCOSPAR (1962, Vikram Sarabhai) became ISRO on 15 August 1969; HQ Antariksh Bhavan, Bengaluru.",
        "Centres: SDSC Sriharikota (launch), VSSC Thiruvananthapuram, URSC Bengaluru, SAC Ahmedabad, NRSC Hyderabad.",
        "Aryabhata (19 April 1975) was launched by the Soviet Union from Kapustin Yar; SLV-3 put Rohini in orbit in 1980 (project director A.P.J. Abdul Kalam).",
        "Chandrayaan-1 (2008, PSLV-C11) found water signatures; Chandrayaan-2 (2019) lost lander Vikram but its orbiter still works.",
        "Chandrayaan-3 (LVM3, July 2023): lander Vikram and rover Pragyan landed near the south pole on 23 August 2023, now National Space Day.",
        "Mars Orbiter Mission: PSLV-C25, November 2013; entered Mars orbit 24 September 2014, first attempt success.",
        "AstroSat (2015) multi-wavelength astronomy; Aditya-L1 (PSLV-C57, 2023) studies the Sun from a halo orbit at L1 with seven payloads; XPoSat (January 2024) measures X-ray polarisation.",
        "SpaDeX (January 2025): India became the fourth country to dock two spacecraft in orbit; NISAR (ISRO–NASA radar satellite) launched on a GSLV in July 2025.",
        "Gaganyaan: TV-D1 (2023) tested crew escape; Vyommitra is a humanoid robot; Shubhanshu Shukla reached the ISS on Axiom-4 (June 2025); space station by 2035; Shukrayaan (Venus) approved 2024.",
      ],
    },
    {
      heading: "Launch vehicles and satellites",
      points: [
        "PSLV: four stages alternating solid–liquid (PS1 solid, PS2 liquid Vikas, PS3 solid, PS4 liquid, not cryogenic); PSLV-C37 carried 104 satellites in February 2017.",
        "LVM3 (GSLV Mk III): two S200 solid boosters, L110 liquid core, C25 cryogenic upper stage (liquid hydrogen + liquid oxygen).",
        "SSLV puts satellites up to about 500 kg in low Earth orbit at short notice; Vikas is an engine, not a vehicle.",
        "NavIC (IRNSS) is regional: satellites in geostationary and inclined geosynchronous orbits.",
        "Series: GSAT communication, Cartosat mapping, RISAT all-weather radar imaging, Oceansat oceans and winds.",
        "Orbits: geostationary about 36,000 km over the equator (poor polar coverage); remote sensing uses polar sun-synchronous orbits; GPS uses medium Earth orbit.",
      ],
    },
    {
      heading: "Defence",
      points: [
        "DRDO (1958, HQ New Delhi); IGMDP missiles: Prithvi surface-to-surface, Agni ballistic, Akash and Trishul surface-to-air, Nag anti-tank.",
        "Astra beyond-visual-range air-to-air; Nirbhay subsonic cruise; Pralay quasi-ballistic tactical; Agni-Prime new-generation canisterised ballistic missile.",
        "BrahMos is an India–Russia supersonic cruise missile (Brahmaputra + Moskva), not purely DRDO.",
        "Mission Shakti (2019) anti-satellite test, not Operation Shakti (1998); Mission Divyastra (March 2024) Agni-V with MIRV.",
        "Tejas (HAL) light combat aircraft; Prachand light combat helicopter (2022); Rafale is French (Dassault).",
        "INS Vikrant (September 2022) first indigenous aircraft carrier; INS Vikramaditya ex-Russian carrier; INS Arihant (2016) and Arighaat are nuclear ballistic-missile submarines (SSBN).",
      ],
    },
    {
      heading: "Nuclear programme",
      points: [
        "Smiling Buddha (May 1974); Operation Shakti (May 1998), hence National Technology Day on 11 May.",
        "Doctrine (2003): credible minimum deterrence, no first use, massive retaliation; India has signed neither NPT nor CTBT.",
        "Three stages: PHWRs on natural uranium → fast breeders on plutonium (PFBR Kalpakkam, mixed-oxide fuel) → thorium.",
        "Plants: Kudankulam Tamil Nadu, Kakrapar Gujarat, Kaiga Karnataka, Narora Uttar Pradesh.",
      ],
    },
    {
      heading: "Biotech and IT",
      points: [
        "Bt cotton (approved 2002) carries a cry gene from Bacillus thuringiensis; Bt brinjal release under moratorium since 2010; GEAC under MoEFCC approves GM crops.",
        "Golden Rice has beta-carotene (vitamin A precursor); CRISPR-Cas9 edits genes; DNA fingerprinting by Alec Jeffreys; Dolly cloned in Scotland (1996).",
        "1 byte = 8 bits; IPv4 32-bit, IPv6 128-bit; HTTPS uses TLS on port 443; RAM is volatile.",
        "Phishing tricks users; ransomware encrypts for payment; botnet = hijacked machines; zero-day = unpatched unknown flaw; firewall filters traffic.",
        "CERT-In handles cyber incidents; IT Act 2000; UPI by NPCI; PARAM supercomputers by C-DAC.",
      ],
    },
  ],
  formulas: [
    "Sarabhai: father of space programme; Bhabha: nuclear programme (BARC, Trombay); Kalam: Missile Man, SLV-3 director.",
    "Space chronology: Aryabhata 1975 → Rohini 1980 → Chandrayaan-1 2008 → MOM in Mars orbit 2014 → PSLV-C37 2017 → Chandrayaan-3 2023 → SpaDeX 2025.",
  ],
  traps: [
    "PSLV's fourth stage is liquid, not cryogenic; the cryogenic C25 is on LVM3.",
    "Aryabhata was launched from the USSR, not Sriharikota.",
    "Chandrayaan-2's orbiter is still working; only the lander failed.",
    "BrahMos is a joint venture, so it is the usual answer to 'not developed by DRDO'.",
  ],
  examTips: [
    "SSC and RRB ask one-liners: HQs, firsts, missile types, mission launch vehicles.",
    "UPSC and state PSCs use statement counts, match-the-pair and chronological order mixing missions, vehicles and purposes.",
    "Recent missions (Gaganyaan, SpaDeX, NISAR, Divyastra) are favourites; learn the year with each.",
  ],
};

export default notes;

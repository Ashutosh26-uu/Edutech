import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "United Nations",
      points: [
        "Charter signed at San Francisco (June 1945); UN came into being 24 October 1945; HQ New York; first General Assembly session in London, January 1946.",
        "Six principal organs: General Assembly, Security Council, ECOSOC, Trusteeship Council (suspended 1994), ICJ, Secretariat.",
        "Security Council: 5 permanent (USA, UK, France, Russia, China) + 10 non-permanent for two years; substantive decisions need 9 votes with no P5 veto.",
        "General Assembly: one vote per member; important questions need a two-thirds majority.",
        "Secretary-General appointed by the General Assembly on Security Council recommendation; António Guterres (Portugal) since 2017.",
        "ICJ at The Hague: 15 judges, nine-year terms; ICC (Rome Statute, in force 2002) is separate, also at The Hague.",
        "193 members: South Sudan the 193rd (2011); Switzerland joined only in 2002 (neutrality).",
        "Six official languages: English, French, Spanish, Russian, Chinese, Arabic.",
        "India has been a non-permanent member eight times, the latest in 2021–22.",
        "Human Rights Council (2006) replaced the Commission on Human Rights.",
      ],
    },
    {
      heading: "Agencies and their headquarters",
      points: [
        "Geneva: WHO, ILO, WIPO, ITU, WMO (also WTO and ICRC, which are not UN agencies).",
        "Paris: UNESCO; Rome: FAO, IFAD; Vienna: UNIDO and IAEA (a related organisation); Bern: UPU; Montreal: ICAO; London: IMO.",
        "Nairobi: UNEP and UN-Habitat; New York: UNICEF (a fund, not a specialised agency).",
        "ITU (1865) is the oldest specialised agency.",
      ],
    },
    {
      heading: "Bretton Woods and WTO",
      points: [
        "IMF and World Bank: Bretton Woods conference 1944; both HQ in Washington, D.C.",
        "SDR basket: US dollar, euro, Chinese renminbi, Japanese yen, British pound.",
        "IMF major decisions need 85% of votes, so the US share (over 15%) is an effective veto.",
        "World Bank Group: IBRD, IDA (soft loans to the poorest), IFC (private sector), MIGA (investment insurance), ICSID (disputes).",
        "WTO from 1 January 1995 (Marrakesh Agreement), replacing GATT; Ministerial Conference meets at least every two years; Appellate Body stalled since December 2019.",
      ],
    },
    {
      heading: "Groupings",
      points: [
        "BRICS: first BRIC summit 2009; South Africa 2010; Egypt, Ethiopia, Iran, UAE 2024; Indonesia 2025; New Development Bank in Shanghai.",
        "AIIB Beijing; Asian Development Bank Manila.",
        "SCO: 2001, Shanghai; secretariat Beijing; India and Pakistan full members 2017, Iran 2023.",
        "G20: 1999; first leaders' summit 2008; presidencies Indonesia 2022, India 2023, Brazil 2024, South Africa 2025; African Union admitted at New Delhi 2023.",
        "G7: USA, UK, France, Germany, Japan, Italy, Canada; became G8 with Russia in 1997, Russia suspended 2014.",
        "ASEAN 1967 (founders Indonesia, Malaysia, Philippines, Singapore, Thailand); secretariat Jakarta.",
        "SAARC 1985, secretariat Kathmandu, Afghanistan joined 2007; BIMSTEC 1997, secretariat Dhaka (Thailand and Myanmar are in BIMSTEC, not SAARC).",
        "NATO 1949, HQ Brussels; Finland joined 2023, Sweden 32nd member March 2024.",
        "Quad: India, USA, Japan, Australia; IBSA India–Brazil–South Africa; BASIC adds China; RIC Russia–India–China; I2U2 India, Israel, UAE, USA.",
        "International Solar Alliance launched by India and France at COP21 (2015); IORA secretariat in Mauritius.",
      ],
    },
    {
      heading: "Other bodies",
      points: [
        "Interpol Lyon; OPEC (1960) Vienna; African Union (2002) Addis Ababa; Arab League Cairo; GCC Riyadh; OAS Washington; APEC Singapore.",
        "Commonwealth Secretariat and Amnesty International London; WWF and IUCN Gland; BIS Basel; OECD, FATF, IEA Paris; IRENA Abu Dhabi.",
        "IUCN publishes the Red List; IPCC assesses climate science; FATF fights money laundering and terror financing.",
        "Export regimes: NSG formed 1974 after India's test (India not a member, not an NPT signatory); India joined MTCR 2016, Wassenaar (dual-use goods) December 2017.",
        "League of Nations 1920; EEC by Treaty of Rome 1957; EU by Maastricht 1993; euro as accounting currency 1999.",
      ],
    },
  ],
  traps: [
    "UNICEF and UNEP are a fund and a programme, not specialised agencies; WTO is outside the UN system.",
    "The G8 was formed with Russia, never China.",
    "NDB is in Shanghai but AIIB is in Beijing; SCO was founded in Shanghai but its secretariat is in Beijing.",
    "SAARC secretariat is Kathmandu; BIMSTEC secretariat is Dhaka (SAARC was founded at Dhaka).",
    "IMF and World Bank are both in Washington, D.C., not New York.",
  ],
  examTips: [
    "SSC and banking exams ask HQs, founding years and members as one-liners.",
    "UPSC prefers match-the-pair (agency–HQ, grouping–year), chronology and statement counts on membership changes.",
    "Membership changes (BRICS, SCO, NATO, G20) are dated; always note the year.",
  ],
};

export default notes;

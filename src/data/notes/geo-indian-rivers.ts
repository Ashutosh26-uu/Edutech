import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Two drainage systems",
      points: [
        "Himalayan rivers: perennial (snow + rain), deep gorges, meanders, big floods; e.g. Indus, Ganga, Brahmaputra.",
        "Peninsular rivers: mostly rain-fed and seasonal, older, shallower valleys; e.g. Godavari, Krishna, Kaveri, Narmada.",
        "Most peninsular rivers flow east to the Bay of Bengal and form deltas.",
        "Narmada and Tapi flow west through rift valleys into the Arabian Sea and form estuaries, not deltas.",
      ],
    },
    {
      heading: "Indus and Ganga systems",
      points: [
        "Indus (about 2,880 km) rises in Tibet near Mansarovar; tributaries: Jhelum, Chenab, Ravi, Beas, Sutlej.",
        "Jhelum rises at Verinag (Kashmir); Beas rises at Beas Kund near Rohtang and flows wholly in India; Beas meets Sutlej at Harike.",
        "Indus Waters Treaty (1960): India uses the eastern rivers (Ravi, Beas, Sutlej), Pakistan the western (Indus, Jhelum, Chenab).",
        "Ganga: Bhagirathi (from Gangotri glacier) and Alaknanda meet at Devprayag to form the Ganga.",
        "Ganga is the longest river flowing in India; enters Bangladesh as the Padma.",
        "Left-bank tributaries: Ramganga, Gomti, Ghaghara, Gandak, Kosi. Right-bank: Yamuna, Son.",
        "Yamuna rises at Yamunotri and joins the Ganga at Prayagraj; Chambal, Betwa and Ken join the Yamuna.",
        "Kosi = “Sorrow of Bihar” (shifts course, heavy silt); Damodar = “Sorrow of Bengal”.",
      ],
    },
    {
      heading: "Brahmaputra",
      points: [
        "Rises near Mansarovar (Chemayungdung glacier); called Tsangpo in Tibet.",
        "Enters India in Arunachal as the Siang/Dihang; flows through Assam as the Brahmaputra; called Jamuna in Bangladesh.",
        "Majuli in Assam is a large river island. Ganga–Brahmaputra form the Sundarbans delta, the world’s largest.",
      ],
    },
    {
      heading: "Peninsular rivers",
      points: [
        "Godavari: longest peninsular river and longest wholly within India (about 1,465 km); rises at Trimbakeshwar (Nashik); “Dakshin Ganga”.",
        "Krishna rises near Mahabaleshwar; tributaries Tungabhadra and Bhima.",
        "Kaveri rises at Talakaveri (Kodagu, Karnataka); Shivanasamudra falls; mostly perennial due to both monsoons.",
        "Mahanadi rises near Sihawa (Chhattisgarh); Hirakud Dam (Odisha).",
        "Narmada rises at Amarkantak; flows between Vindhya and Satpura; Dhuandhar falls (Jabalpur); Sardar Sarovar Dam.",
        "Tapi rises at Multai (Betul, MP); Ukai Dam (Gujarat). Mahi and Sabarmati also flow west.",
      ],
    },
    {
      heading: "Dams on rivers",
      points: [
        "Tehri – Bhagirathi (near Bhilangana confluence); Bhakra Nangal – Sutlej; Hirakud – Mahanadi.",
        "Sardar Sarovar and Indira Sagar – Narmada; Ukai – Tapi; Gandhi Sagar – Chambal; Nagarjuna Sagar – Krishna.",
        "Mettur – Kaveri; Koyna – Koyna (Maharashtra); Salal – Chenab.",
      ],
    },
  ],
  formulas: [
    "Indus five: Jhelum, Chenab, Ravi, Beas, Sutlej (west → east).",
    "West-flowing: Narmada, Tapi, Mahi, Sabarmati → estuaries. East-flowing: Mahanadi, Godavari, Krishna, Kaveri → deltas.",
    "Brahmaputra names: Tsangpo (Tibet) → Siang/Dihang (Arunachal) → Brahmaputra (Assam) → Jamuna (Bangladesh).",
  ],
  traps: [
    "Longest river in India = Ganga; longest entirely within India = Godavari.",
    "Alaknanda–Bhagirathi meet at Devprayag; Tehri is at Bhagirathi–Bhilangana.",
    "Yamuna and Son are right-bank tributaries; Kosi, Gandak, Ghaghara are left-bank.",
    "Ukai is on the Tapi, not the Mahi; Gandhi Sagar is on the Chambal, not the Betwa.",
    "Narmada and Tapi do not form deltas.",
  ],
  examTips: [
    "SSC and Railways ask origins, nicknames and dam–river pairs.",
    "UPSC and State PSCs ask tributary sides, west-flowing rivers and dam-matching with “NOT correctly matched” options.",
  ],
};

export default notes;

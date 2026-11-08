import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core idea",
      points: [
        "India has a tropical monsoon climate; 'monsoon' comes from the Arabic mausim, meaning season.",
        "Monsoon = seasonal reversal of winds: south-west in summer (sea to land), north-east in winter (land to sea).",
        "SE trades cross the equator and the Coriolis force turns them into the SW monsoon; the Somali (Findlater) jet carries them off East Africa.",
        "Controls: latitude, Himalaya (block cold winds, force rain), distance from sea, relief, pressure and winds.",
      ],
    },
    {
      heading: "Mechanism",
      points: [
        "Summer: intense heating of the north-west creates a low; the ITCZ (monsoon trough) shifts to the Ganga plain, about 20°–25°N, in July.",
        "Subtropical westerly jet moving north of the Himalaya in June triggers the monsoon 'burst'; tropical easterly jet at about 14°N over the peninsula strengthens it.",
        "El Niño (warm eastern Pacific) tends to weaken the monsoon; La Niña tends to strengthen it; SOI = pressure difference Tahiti − Darwin.",
        "Positive IOD (western Indian Ocean warmer than eastern) tends to help the monsoon; MJO pulses cause active and break spells.",
        "Break: monsoon trough shifts north to the Himalayan foothills — heavy rain in the hills, dry plains.",
      ],
    },
    {
      heading: "Seasons (IMD)",
      points: [
        "Winter Dec–Feb (January coldest in north); hot weather Mar–May (May peak in Rajasthan); SW monsoon Jun–Sep; retreating/post-monsoon Oct–Nov.",
        "Onset over Kerala about 1 June (after the Andaman Sea); Mumbai about 11 June; covers all India about 8 July (normals revised 2020).",
        "Withdrawal starts from west Rajasthan in September; complete by about 15 October.",
        "'October heat': hot, humid spell after withdrawal.",
      ],
    },
    {
      heading: "Rainfall distribution",
      points: [
        "Arabian Sea branch: Western Ghats windward (Mumbai, Konkan); rain shadow on Deccan (Bengaluru, Marathwada) and Tamil Nadu.",
        "Bay of Bengal branch: Mawsynram–Cherrapunji (funnel-shaped Khasi hills); deflected by the Himalaya, moves east to west along the Ganga plain; Shillong lies in rain shadow.",
        "Rainfall decreases west along the plains; Jaisalmer lowest; western Rajasthan has the highest variability; Leh is a cold desert in rain shadow.",
        "Tamil Nadu/Coromandel: most rain Oct–Dec from the NE monsoon and retreating-monsoon cyclones; Chennai's wettest month is November.",
        "Thiruvananthapuram has two peaks (June–July and October); lowest annual range of temperature; Thar has the greatest diurnal range.",
        "Isohyet = equal rainfall; isohel = sunshine; isoneph = cloudiness; isobar = pressure.",
      ],
    },
    {
      heading: "Local winds and storms",
      points: [
        "Loo: hot dry afternoon wind of NW plains in May–June.",
        "Kalbaisakhi (Bengal) = Bardoli Chheerha (Assam): evening thunderstorms; mango showers (Kerala, coastal Karnataka); blossom (coffee) showers.",
        "Western disturbances: extratropical lows from the Mediterranean giving winter rain to Punjab–Haryana (good for wheat) and snow to the hills; cold waves follow.",
        "Cyclones: Bay of Bengal (warmer, gets river water, more lows) far exceeds the Arabian Sea; peak Oct–Nov; few in July–August due to vertical wind shear; no cyclones on the equator (no Coriolis).",
        "Storm surges are worst at the funnel-shaped head of the Bay (West Bengal, Bangladesh).",
        "World winds: Chinook (Rockies, warm), Foehn (Alps, warm), Sirocco (Sahara to Italy), Mistral (cold, Rhone).",
      ],
    },
  ],
  formulas: [
    "Normal lapse rate ≈ 6.5 °C per 1,000 m.",
    "Heat wave (plains): only if max temp ≥ 40 °C.",
    "Onset Kerala ~1 June · Mumbai ~11 June · all-India ~8 July · withdrawal complete ~15 October.",
  ],
  traps: [
    "Bengaluru is in the Western Ghats' rain shadow, not on the windward side.",
    "Western disturbances are extratropical, not tropical cyclones.",
    "The Loo is hot and dry, not a humid thunderstorm.",
    "Coldest month in north India is January, not December; Chennai's wettest month is November, not July.",
    "A 'tornado' is not the name for an Indian Ocean cyclone (that is simply 'cyclone'; Pacific = typhoon, Atlantic = hurricane).",
  ],
  examTips: [
    "SSC and railways: onset date, local wind names, wettest/driest places and El Niño basics.",
    "UPSC prelims and state PSCs: jet streams, IOD and ENSO statements, rainfall order sequencing and assertion-reason on rain shadows.",
  ],
};

export default notes;

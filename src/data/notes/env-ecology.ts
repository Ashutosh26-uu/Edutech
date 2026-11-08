import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Ecology basics",
      points: [
        "Endemic: found naturally only in one region. Keystone: effect far larger than its numbers. Ecotone: transition zone between two ecosystems.",
        "Eutrophication: nitrates and phosphates → algal bloom → fall in dissolved oxygen → fish die.",
        "Bioremediation: microbes break down pollutants such as oil spills. Blue carbon: carbon stored by mangroves, seagrass and salt marshes.",
        "Coral bleaching: warm water makes corals expel zooxanthellae algae. Mangroves cut storm-surge damage; Sundarbans largest, Bhitarkanika second.",
      ],
    },
    {
      heading: "Protected areas",
      points: [
        "India's hotspots: Himalaya, Indo-Burma, Western Ghats–Sri Lanka, Sundaland (Nicobar); criteria ≥1,500 endemic vascular plants and ≥70% habitat lost.",
        "First national park: Hailey 1936 = Jim Corbett (Uttarakhand). Kaziranga rhino; Gir Asiatic lion (Gujarat); Dachigam hangul; Keoladeo birds (Bharatpur); Silent Valley (Kerala).",
        "Tiger reserves: Periyar (Kerala), Dudhwa (UP), Valmiki (Bihar), Manas (Assam), Tadoba-Andhari (Maharashtra); MP has Kanha, Bandhavgarh, Pench, Panna, Satpura.",
        "Biosphere reserves from UNESCO MAB: core (no human use), buffer (research, education, limited use), transition (settlements).",
        "Sundarbans is a WHS, Ramsar site, tiger reserve and biosphere reserve. Western Ghats became a WHS in 2012.",
        "Olive Ridley arribada: Gahirmatha and Rushikulya (Odisha). Dugong reserve in Palk Bay (TN) 2022; cheetahs to Kuno (MP) 2022.",
      ],
    },
    {
      heading: "Laws, bodies and projects",
      points: [
        "Wildlife (Protection) Act 1972 → Water Act 1974 → Forest (Conservation) Act 1980 → Air Act 1981 → Environment (Protection) Act 1986 (after Bhopal) → Biological Diversity Act 2002 → Forest Rights Act 2006 → NGT Act 2010.",
        "NTCA 2006 by amendment to the WPA; Wildlife Institute of India is not statutory.",
        "Project Tiger 1973, Project Elephant 1992, Project Snow Leopard 2009; St Petersburg 2010 goal: double wild tigers by 2022.",
        "Movements: Bishnoi at Khejarli 1730 (Amrita Devi), Chipko (Uttarakhand), Appiko (Karnataka), Silent Valley (Kerala).",
      ],
    },
    {
      heading: "Conventions and climate",
      points: [
        "Ramsar 1971 (wetlands), CITES (trade in species), CMS/Bonn (migratory species), Basel (hazardous waste movement), Rotterdam (prior informed consent), Stockholm (POPs), Minamata (mercury).",
        "CBD's Nagoya Protocol: access and benefit sharing; Cartagena: biosafety (GMOs). UNCCD COP-14 hosted by India 2019.",
        "Stockholm 1972 (UNEP) → Montreal 1987 (ozone) → Rio 1992 (UNFCCC, CBD) → Kyoto 1997 → Paris 2015 (COP-21, well below 2 °C, aim 1.5 °C, NDCs) → Kigali 2016 (phase down HFCs).",
        "Ozone layer is in the stratosphere; hole largest over Antarctica in spring (polar stratospheric clouds); ODP measured against CFC-11.",
        "India's NAPCC (2008) has eight missions (solar, energy efficiency, habitat, water, Himalaya, Green India, agriculture, strategic knowledge).",
      ],
    },
    {
      heading: "Pollution and IUCN",
      points: [
        "Acid rain: SO₂ and NOₓ. Black carbon: soot from incomplete burning. Bhopal 1984: methyl isocyanate. CO₂ contributes most to warming; methane from paddy and cattle.",
        "Diseases: Minamata (mercury), itai-itai (cadmium), blue baby (nitrate), blackfoot (arsenic), fluorosis (fluoride).",
        "IUCN (Red Data Book) risk order: Least Concern < Near Threatened < Vulnerable < Endangered < Critically Endangered < Extinct in the Wild < Extinct.",
        "Great Indian Bustard: Critically Endangered.",
      ],
    },
  ],
  formulas: [
    "GWP (100-yr) order: CO₂ (1) < CH₄ < N₂O < HFCs/SF₆.",
    "1 carbon credit = 1 tonne CO₂ equivalent.",
    "World Environment Day: 5 June.",
  ],
  traps: [
    "Montreal is ozone, Kyoto is greenhouse gases; Kigali amends Montreal, not Kyoto.",
    "Stockholm Convention (POPs) is different from the 1972 Stockholm Conference.",
    "Tadoba-Andhari is in Maharashtra, not MP; Sambhar Lake is Rajasthan, not Odisha.",
    "Buffer zone allows research and limited use; the core zone is strictly protected.",
    "Lion-tailed macaque lives in the Western Ghats, not the Desert National Park.",
  ],
  examTips: [
    "UPSC prelims leans heavily here: convention–subject matching, IUCN status, statements on Ramsar, biosphere reserves and climate pledges.",
    "SSC and state papers ask park–state, park–animal and year-of-project questions.",
  ],
};

export default notes;

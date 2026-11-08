import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Soils of India",
      points: [
        "ICAR/NCERT groups: alluvial, black, red and yellow, laterite, arid, saline, peaty (marshy), forest and mountain.",
        "Alluvial: largest area; northern plains and deltas; khadar (new, fertile) vs bhangar (old, kankar); rich in potash, poor in phosphorus and nitrogen.",
        "Black (regur): from Deccan basalt; Maharashtra, Gujarat, MP; clayey, holds moisture, self-ploughing, deep cracks when dry; good for cotton; poor in phosphorus, nitrogen, humus.",
        "Red: iron oxide gives colour; looks yellow when hydrated; crystalline rocks of the eastern and southern peninsula.",
        "Laterite: high temperature and heavy rain leach silica and bases; acidic, poor; with manure grows cashew, tea, coffee.",
        "Saline/alkaline (reh, kallar, usar): treat with gypsum. Peaty: humid, poorly drained areas (Kerala, Sundarbans). Mountain soils: acidic, low humus.",
      ],
    },
    {
      heading: "Cropping seasons",
      points: [
        "Kharif (sown June–July with monsoon, harvested Sept–Oct): rice, maize, jowar, bajra, ragi, cotton, jute, soybean, groundnut, arhar, moong, urad.",
        "Rabi (sown Oct–Dec, harvested Apr–June): wheat, barley, gram, mustard, linseed, peas; winter rain from western disturbances helps.",
        "Zaid (between rabi and kharif): watermelon, muskmelon, cucumber, fodder.",
        "West Bengal rice: aus (autumn), aman (winter, main), boro (summer).",
        "Millets: jowar, bajra, ragi (barley is not a millet).",
      ],
    },
    {
      heading: "Crop facts and leading states",
      points: [
        "Coffee Karnataka (Baba Budan hills, Chikkamagaluru, Arabica); tea Assam; jute ('golden fibre') West Bengal; rubber Kerala (>200 cm rain); bajra Rajasthan; groundnut Gujarat; mulberry silk Karnataka; saffron Kashmir.",
        "Tea needs well-drained slopes, no standing water; cotton needs about 210 frost-free days; gram is a rabi pulse grown on residual moisture.",
        "Farming types: jhum (NE hills), podu (Andhra–Odisha), plantation (large estates, single crop, hired labour), mixed farming (crops + livestock), multiple cropping.",
        "Dryland farming: areas with under 75 cm rain. Sikkim: first fully organic state 2016. India is second in fruits and vegetables after China.",
      ],
    },
    {
      heading: "Revolutions and policy",
      points: [
        "Green Revolution (mid-1960s): HYV seeds, fertiliser, irrigation; mainly wheat in Punjab, Haryana, western UP; M.S. Swaminathan (Norman Borlaug globally).",
        "White (milk) Operation Flood 1970, NDDB, Verghese Kurien; Yellow (oilseeds), Blue (fish), Golden (horticulture, honey), Silver (eggs, poultry).",
        "MSP announced by the Government on CACP recommendations; CACP is non-statutory; sugarcane gets FRP. Soil Health Card scheme 2015.",
        "Bhoodan movement: Vinoba Bhave at Pochampalli 1951.",
      ],
    },
    {
      heading: "Irrigation",
      points: [
        "Wells and tube-wells: largest share (over 60%) of net irrigated area; tanks dominate on the hard-rock peninsula; perennial canals from barrages.",
        "Indira Gandhi Canal: from Harike barrage (Sutlej–Beas) to NW Rajasthan; waterlogging and salinity in canal areas.",
        "Drip for orchards in arid areas; sprinkler for sandy or uneven land.",
        "Traditional: kuls (Himachal), khadins (Rajasthan), zings (Ladakh), eris (Tamil Nadu tanks).",
      ],
    },
  ],
  formulas: [
    "Kharif = monsoon sowing; Rabi = winter sowing; Zaid = short summer crop.",
    "Black soil: poor in P, N, humus; rich in lime, iron, magnesia, potash.",
    "Cotton: 210 frost-free days · rubber: >200 cm rain · dryland: <75 cm.",
  ],
  traps: [
    "Ragi is kharif, not rabi; mustard is a rabi oilseed, groundnut a kharif one.",
    "Black soil is not a major soil of Assam.",
    "Dooars is a tea area, not coffee.",
    "Mesta is a fibre crop, not a beverage crop.",
    "Alluvial, not black, soil covers the largest area of India.",
  ],
  examTips: [
    "SSC and railways ask soil–crop pairs, kharif/rabi grouping and leading states.",
    "UPSC and state PSCs use statement questions on MSP and soils, revolution–sector matching and chronology of farm schemes.",
  ],
};

export default notes;

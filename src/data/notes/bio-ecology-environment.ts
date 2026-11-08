import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Organisms and populations",
      points: [
        "Responses to stress: regulate (homeostasis), conform, migrate or suspend (spores, hibernation, aestivation, diapause).",
        "Allen's rule: mammals of colder climates have shorter ears and limbs to cut heat loss; kangaroo rat survives on metabolic water.",
        "Population attributes: birth rate, death rate, sex ratio, age pyramid — triangular (expanding), bell (stable), urn (declining).",
        "Density rises with natality and immigration, falls with mortality and emigration.",
        "Exponential growth is J-shaped (unlimited resources); logistic growth is S-shaped (Verhulst–Pearl), levelling at carrying capacity K.",
        "Interactions: mutualism (+,+), competition (−,−), predation and parasitism (+,−), commensalism (+,0), amensalism (−,0).",
        "Examples: lichens, mycorrhiza, fig–wasp (mutualism); orchid on mango, barnacles on whale, cattle egret with cattle (commensalism); cuckoo (brood parasite).",
        "Gause: competitive exclusion; Connell's barnacles (Balanus excludes Chthamalus); MacArthur's warblers coexist by resource partitioning.",
        "Monarch butterfly stores a cardiac glycoside from its host plant; prickly pear in Australia controlled by a moth (biological control).",
      ],
    },
    {
      heading: "Ecosystem",
      points: [
        "GPP − respiration loss = NPP; annual NPP of biosphere about 170 billion tonnes (dry weight), oceans only about 55 billion tonnes.",
        "Plants capture only 2–10% of PAR; about 10% of energy passes to the next trophic level (Lindeman).",
        "Decomposition: fragmentation, leaching, catabolism, humification, mineralisation; fast in warm moist soils, slow for lignin and chitin.",
        "Pyramid of energy is always upright; pyramid of numbers inverted in a tree ecosystem; biomass inverted in the sea.",
        "Succession: pioneers are lichens on bare rock and phytoplankton in water; both hydrarch and xerarch end in mesic climax.",
        "Carbon cycle is gaseous (oceans hold ~71% of carbon as dissolved form); phosphorus cycle is sedimentary with no gaseous phase.",
      ],
    },
    {
      heading: "Biodiversity and conservation",
      points: [
        "India (NCERT): 2.4% of world land, 8.1% of global species diversity; one of 12 mega-diversity countries.",
        "Diversity falls from tropics to poles; Amazon rainforest has the greatest diversity on Earth.",
        "Paul Ehrlich's rivet popper hypothesis; Tilman's plots: more species gave less year-to-year variation in biomass.",
        "Evil Quartet: habitat loss (main cause), over-exploitation, alien invasions (Nile perch, Parthenium, Lantana, Eichhornia, African catfish), co-extinction.",
        "Recent extinctions: dodo (Mauritius), quagga (Africa), thylacine (Australia), Steller's sea cow (Russia), three tiger subspecies (Bali, Javan, Caspian).",
        "In situ: hotspots (NCERT: 34 worldwide; in India Western Ghats–Sri Lanka, Indo-Burma, Himalaya), biosphere reserves, national parks, sanctuaries, sacred groves.",
        "Ex situ: zoos, botanical gardens, seed banks, cryopreservation of gametes.",
        "Earth Summit, Rio de Janeiro 1992 (CBD); World Summit on Sustainable Development, Johannesburg 2002.",
      ],
    },
    {
      heading: "Environmental issues",
      points: [
        "Electrostatic precipitator removes over 99% particulates; scrubber removes SO₂; catalytic converter (Pt, Pd, Rh) needs unleaded petrol.",
        "High BOD = more organic pollution; sewage causes algal bloom; Eichhornia is called the terror of Bengal.",
        "Biomagnification: DDT concentration rises up the food chain and thins bird eggshells.",
        "CFCs release Cl that destroys ozone (measured in Dobson units); Montreal Protocol 1987; UV-B causes snow blindness and skin cancer.",
        "Chipko movement 1974 (Garhwal Himalaya); Amrita Devi Bishnoi sacrifice 1731 (Rajasthan); Joint Forest Management from the 1980s.",
      ],
    },
  ],
  formulas: [
    "Nₜ₊₁ = Nₜ + [(B + I) − (D + E)].",
    "Exponential: dN/dt = rN, Nₜ = N₀eʳᵗ; logistic: dN/dt = rN(K − N)/K.",
    "Species–area: log S = log C + Z log A; Z = 0.1–0.2 for small regions, 0.6–1.2 for whole continents.",
    "Greenhouse share (NCERT): CO₂ 60%, CH₄ 20%, CFCs 14%, N₂O 6%.",
    "Indian Acts: Water 1974, Air 1981 (noise added 1987), Environment Protection 1986.",
  ],
  traps: [
    "Pyramid of energy can never be inverted; numbers and biomass can.",
    "Orchid on a mango branch is commensalism, not parasitism.",
    "Protected-area counts (NCERT: 14 biosphere reserves, 90 national parks, 448 sanctuaries) are dated; current official figures are higher, so answer what the question's source expects.",
    "Phosphorus has no atmospheric phase; do not draw it like the carbon cycle.",
    "NPP, not GPP, is the biomass available to consumers.",
  ],
  examTips: [
    "NEET asks NCERT numbers and named examples in statement-counting format.",
    "Expect growth-equation and population-density calculations.",
    "Match interaction type with example, and pollutant control device with pollutant, are regulars.",
  ],
};

export default notes;

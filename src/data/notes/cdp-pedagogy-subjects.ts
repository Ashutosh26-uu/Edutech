import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Framework documents",
      points: [
        "NCF 2005 guiding principles: link knowledge to life outside school, move away from rote learning, enrich the curriculum beyond textbooks, make exams flexible and part of classroom life, nurture a caring identity within a democratic polity",
        "NEP 2020: 5 + 3 + 3 + 4 structure; mother tongue or home language as medium till at least Grade 5, preferably Grade 8 and beyond",
        "NCF-SE 2023: three languages in Grades 9–10 and two in Grades 11–12; board exams offered at least twice a year",
        "Assessment should be continuous and formative, used to improve learning rather than to label children",
      ],
    },
    {
      heading: "Mathematics pedagogy",
      points: [
        "NCF 2005: the main goal is mathematisation of the child's thinking, not just computation skills",
        "Concrete → pictorial → abstract (Bruner's enactive, iconic, symbolic modes) for place value, fractions, measurement",
        "Introduce fractions through sharing real objects (a roti, paper folding) before symbols",
        "Van Hiele levels of geometric thought: visualisation, analysis, informal deduction, formal deduction, rigour",
        "Counting principles: one-to-one correspondence, stable order, cardinality, abstraction, order irrelevance",
        "Pólya's steps: understand the problem, devise a plan, carry out the plan, look back",
        "Errors are windows into thinking; error analysis guides remedial teaching",
        "Estimation before calculation builds number sense; puzzles and games build reasoning and reduce maths anxiety",
      ],
    },
    {
      heading: "EVS pedagogy",
      points: [
        "Classes I–II: EVS integrated with language and maths; Classes III–V: a separate subject",
        "Six themes (NCERT): Family and Friends, Food, Shelter, Water, Travel, Things We Make and Do",
        "Learn from the child's surroundings: field visits, observation, surveys, interviews, projects",
        "Children's misconceptions (the sun goes round the earth) are corrected through observation and discussion, not by simply telling",
        "Questions on who cooks or fetches water aim at gender and social sensitivity",
        "Textbooks use a narrative, activity-based style; no definitions to memorise at this stage",
      ],
    },
    {
      heading: "Language pedagogy",
      points: [
        "Skills in natural order: Listening, Speaking, Reading, Writing (LSRW)",
        "Chomsky: innate Language Acquisition Device; overgeneralisation ('goed', 'buyed') shows rule learning",
        "Krashen: comprehensible input slightly above the current level (i + 1); acquisition differs from learning",
        "Skimming = reading quickly for the gist; scanning = searching for a specific fact",
        "Phonemic awareness: hearing and manipulating sounds in words (rhyme, blending, splitting)",
        "Whole-language approach stresses meaning and context; phonics stresses sound–letter links",
        "Language across the curriculum: every subject teacher builds language",
        "Multilingualism is a resource; the home language should be used as a bridge",
      ],
    },
  ],
  traps: [
    "Choosing 'drill and practice' or 'memorise definitions' as the best method; NCF favours understanding",
    "Treating a child's error as carelessness to be punished instead of a clue to their thinking",
    "Marking Writing before Reading in the natural LSRW order",
    "Confusing skimming (overall idea) with scanning (one specific detail)",
    "Saying EVS is a separate subject from Class I; it is integrated in Classes I–II",
  ],
  examTips: [
    "CTET Paper I and II and state TETs carry 15 pedagogy questions in each subject section (maths, EVS, language I and II)",
    "Questions are classroom scenarios: pick the child-centred, activity-based, inclusive option",
    "Statement-count and assertion–reason items test NCF 2005, NEP 2020 and NCF-SE 2023 facts",
  ],
};

export default notes;

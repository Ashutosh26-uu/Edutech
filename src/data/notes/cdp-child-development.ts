import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Development principles",
      points: [
        "Development is continuous, sequential, and follows a predictable pattern, but its rate differs between children.",
        "Cephalocaudal: head to toe; proximodistal: centre of body outwards.",
        "Growth is quantitative (height, weight); development is qualitative and lifelong.",
        "Heredity and environment both shape development; they interact rather than compete.",
      ],
    },
    {
      heading: "Piaget: cognitive development",
      points: [
        "Sensorimotor (0–2): object permanence develops.",
        "Pre-operational (2–7): symbolic play, egocentrism, animism, no conservation.",
        "Concrete operational (7–11): conservation, reversibility, logic on concrete things.",
        "Formal operational (11+): abstract and hypothetical thinking.",
        "Key terms: schema, assimilation, accommodation, equilibration. Child is an active constructor of knowledge.",
      ],
    },
    {
      heading: "Vygotsky, Kohlberg, Erikson",
      points: [
        "Vygotsky: learning is social; ZPD = gap between what a child does alone and with help; scaffolding = temporary support.",
        "Vygotsky: private speech guides thinking; language drives cognitive growth.",
        "Kohlberg: 3 levels, 6 stages – pre-conventional, conventional, post-conventional.",
        "Kohlberg’s “good boy–good girl” orientation is stage 3, in the conventional level.",
        "Erikson: 8 psychosocial stages; Industry vs Inferiority covers roughly 6–12 years.",
      ],
    },
    {
      heading: "Learning theories",
      points: [
        "Pavlov: classical conditioning (dog, bell, salivation).",
        "Thorndike: trial and error; laws of readiness, exercise and effect.",
        "Skinner: operant conditioning, reinforcement (positive and negative).",
        "Kohler: insight learning (Gestalt, chimpanzee Sultan). Bandura: observational/social learning (Bobo doll).",
        "Chomsky: innate Language Acquisition Device (LAD).",
      ],
    },
    {
      heading: "Intelligence and inclusion",
      points: [
        "Binet–Simon: first intelligence test. IQ = (mental age ÷ chronological age) × 100.",
        "Spearman: two-factor theory (g and s). Gardner: multiple intelligences. Sternberg: triarchic theory.",
        "Gifted: IQ roughly above 130; giftedness also includes creativity and commitment.",
        "Dyslexia: reading; dysgraphia: writing; dyscalculia: maths; dyspraxia: motor coordination.",
        "Inclusive education: all children, including those with disabilities, learn together in regular classrooms.",
      ],
    },
    {
      heading: "Assessment and RTE",
      points: [
        "Formative assessment: during teaching, to improve learning (quizzes, observation, feedback).",
        "Summative assessment: at the end of a unit or term, to grade.",
        "RTE Act 2009 came into force on 1 April 2010; free and compulsory education for ages 6–14.",
        "Section 12(1)(c): 25% seats at entry level in private unaided schools for disadvantaged children.",
        "NCF 2005 stresses learning without burden and linking knowledge to life outside school.",
      ],
    },
  ],
  formulas: [
    "Piaget: 0–2 sensorimotor, 2–7 pre-operational, 7–11 concrete, 11+ formal",
    "IQ = (MA ÷ CA) × 100",
    "Kohlberg: 3 levels × 2 stages = 6 stages",
    "RTE: ages 6–14, in force 1 April 2010, 25% seats under 12(1)(c)",
  ],
  traps: [
    "Giving ZPD to Piaget; it is Vygotsky’s idea.",
    "Mixing Thorndike (law of effect) with Skinner (operant conditioning).",
    "Treating formative assessment as end-of-term testing.",
    "Placing conservation in the pre-operational stage; it arrives in concrete operational.",
    "Calling RTE an amendment year; Article 21A came via the 86th Amendment (2002), the Act itself is 2009.",
  ],
  examTips: [
    "CTET Paper I and II each carry a 30-mark CDP section; scenario-based pedagogy questions dominate.",
    "Match-the-pair (thinker and theory) and statement-count items are common.",
    "In classroom scenarios, choose the child-centred, inclusive, non-punitive option.",
  ],
};

export default notes;

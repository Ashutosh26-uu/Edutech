import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Management functions and classical thinkers",
      points: [
        "Functions: planning, organising, staffing, directing (leading), controlling; Fayol's original five were planning, organising, commanding, coordinating, controlling",
        "Fayol's 14 principles include division of work, authority and responsibility, discipline, unity of command (one boss), unity of direction (one plan per objective), scalar chain, gang plank, equity, stability of tenure, initiative and esprit de corps",
        "Taylor's scientific management: time and motion study, standardisation, scientific selection, differential piece-rate, functional foremanship (eight foremen)",
        "Weber's bureaucracy: rules, hierarchy, specialisation, impersonality, merit-based careers, written records",
        "Katz's skills: technical skills matter most at the bottom, conceptual skills at the top, human skills at every level; Mintzberg's roles are interpersonal, informational and decisional",
      ],
    },
    {
      heading: "Planning, structure and decisions",
      points: [
        "MBO: superior and subordinate jointly set specific objectives, review progress periodically and appraise against them",
        "SMART goals: specific, measurable, achievable, relevant, time-bound",
        "Structures: functional (efficiency, silos), divisional (by product/region/customer, duplication), matrix (two bosses, violates unity of command), network and team-based",
        "Wide span of control = flat structure, more delegation; narrow span = tall structure, closer supervision; span widens with routine work, skilled staff and good systems",
        "Centralisation keeps decisions at the top; decentralisation pushes them down; delegation transfers authority but never ultimate accountability",
        "Decision making: rational model vs bounded rationality and satisficing (Simon); groupthink is countered by devil's advocate, Delphi and nominal group technique",
      ],
    },
    {
      heading: "Leadership",
      points: [
        "Trait theory looks for inborn qualities; behavioural studies (Ohio State: initiating structure and consideration; Michigan: job-centred vs employee-centred)",
        "Blake–Mouton grid: 1,1 impoverished, 9,1 authority-compliance, 1,9 country club, 5,5 middle of the road, 9,9 team management",
        "Hersey–Blanchard: R1 unable and unwilling → telling (S1); R2 unable but willing → selling (S2); R3 able but unwilling/insecure → participating (S3); R4 able and willing → delegating (S4)",
        "Fiedler: least preferred co-worker (LPC) score; task-oriented leaders do best in very favourable or very unfavourable situations",
        "Transformational = idealised influence, inspirational motivation, intellectual stimulation, individualised consideration; transactional = contingent reward and management by exception",
      ],
    },
    {
      heading: "Motivation",
      points: [
        "Maslow: physiological → safety → social → esteem → self-actualisation; Alderfer's ERG allows frustration–regression",
        "Herzberg: hygiene factors (pay, policy, supervision, conditions) prevent dissatisfaction; motivators (achievement, recognition, the work itself, responsibility, growth) create satisfaction",
        "McClelland: need for achievement (moderate-risk goals, feedback), affiliation, power (institutional power suits managers)",
        "Vroom: M = expectancy (effort → performance) × instrumentality (performance → reward) × valence (value of reward)",
        "Adams' equity: compare own outcome/input ratio with a referent; under-reward leads to less effort, demands or leaving",
        "Locke's goal setting: specific, difficult but accepted goals with feedback raise performance; McGregor's Theory X vs Theory Y",
      ],
    },
    {
      heading: "Individual and group behaviour",
      points: [
        "Kelley's attribution: high distinctiveness, high consensus, low consistency → external; low distinctiveness, low consensus, high consistency → internal",
        "Fundamental attribution error: blaming others' behaviour on personality; self-serving bias: credit for success, blame situations for failure",
        "Perception errors: halo, horns, stereotyping, projection, contrast, selective perception",
        "Big Five (OCEAN): openness, conscientiousness, extraversion, agreeableness, neuroticism; conscientiousness predicts job performance best across jobs",
        "Tuckman: forming, storming, norming, performing, adjourning; social loafing rises when individual effort cannot be identified",
        "Thomas–Kilmann: competing (assertive, uncooperative), accommodating (cooperative, unassertive), avoiding (neither), collaborating (both), compromising (middle)",
      ],
    },
    {
      heading: "Culture and change",
      points: [
        "Schein's levels of culture: artefacts, espoused values, basic underlying assumptions",
        "Lewin's three steps: unfreeze, change (move), refreeze; force-field analysis weighs driving against restraining forces",
        "Kotter's eight steps: urgency, guiding coalition, vision and strategy, communicate the vision, empower action, short-term wins, consolidate gains, anchor in culture",
        "Resistance is reduced by education and communication, participation, facilitation, negotiation; manipulation and coercion are last resorts",
      ],
    },
    {
      heading: "HRM and HR metrics",
      points: [
        "Job analysis produces a job description (tasks, duties) and a job specification (qualifications, skills of the person)",
        "Selection validity: does the test predict job performance; reliability: does it give consistent scores; structured interviews and work samples are more valid than unstructured interviews",
        "Kirkpatrick levels: reaction, learning, behaviour, results; Phillips adds ROI = (benefits − costs) ÷ costs",
        "Appraisal methods: graphic rating, BARS, MBO, forced distribution, 360-degree, critical incidents; errors: halo, leniency, central tendency, recency, contrast, similar-to-me",
        "Attrition rate = separations ÷ average headcount × 100; cost-per-hire = total recruiting cost ÷ hires; absenteeism = person-days lost ÷ (average headcount × working days) × 100",
        "India's four labour codes consolidate earlier laws: Code on Wages, Industrial Relations Code, Code on Social Security, and Occupational Safety, Health and Working Conditions Code",
      ],
    },
  ],
  formulas: [
    "Motivational force (Vroom) = E × I × V",
    "Attrition % = separations in period ÷ average headcount × 100",
    "Average headcount = (opening + closing) ÷ 2",
    "Training ROI % = (monetary benefits − programme cost) ÷ programme cost × 100",
    "Compa-ratio = actual pay ÷ midpoint of the pay range",
  ],
  traps: [
    "Matrix structures break unity of command, not unity of direction",
    "Pay is a hygiene factor for Herzberg: raising it removes dissatisfaction but does not by itself motivate",
    "In Hersey–Blanchard, an able but unwilling or insecure follower needs participating, not delegating",
    "Delegation passes authority, not ultimate responsibility",
  ],
};

export default notes;

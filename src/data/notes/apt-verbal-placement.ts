import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Subject–verb agreement",
      points: [
        "'Each of', 'every one of', 'either of', 'neither of' take a singular verb: Each of the files is ready",
        "'The number of' is singular, 'a number of' is plural",
        "'As well as', 'along with', 'together with', 'in addition to' do not change the subject's number",
        "'Neither … nor', 'either … or', 'not only … but also': the verb agrees with the nearer subject",
        "Collective nouns take singular verbs when acting as one unit; 'data' is often plural in formal writing",
        "Uncountable nouns (information, advice, equipment, furniture) never take 's' or 'an'",
      ],
    },
    {
      heading: "Tenses, conditionals and the subjunctive",
      points: [
        "If + past simple → would + verb (unreal present): If I were the manager, I would approve it",
        "Had + past participle → would have + past participle (unreal past): Had they tested it, the outage would have been avoided",
        "Subjunctive after insist, demand, suggest, recommend: that it be submitted / that he submit",
        "'It is high time' + past tense: It is high time we left",
        "'Lest' takes 'should' + base verb or the base verb alone, never 'not': lest you make an error",
        "No future tense after time words: When he arrives (not 'will arrive'), we will start",
      ],
    },
    {
      heading: "Fixed pairs and prepositions",
      points: [
        "Hardly/scarcely … when; no sooner … than; not only … but also; both … and",
        "Superior, inferior, senior, junior, prior, prefer – all take 'to', not 'than'",
        "Comply with, consist of, abide by, insist on, angry with a person, angry at/about a thing",
        "Inverted order after negative openers: Seldom have I seen…, No sooner had she left than…",
      ],
    },
    {
      heading: "Vocabulary, idioms and voice",
      points: [
        "Read the whole sentence: the right synonym fits the context, not just the dictionary meaning (ADDRESS = deal with)",
        "Eliminate by tone: positive word, negative word or neutral word",
        "Common placement words: meticulous (very careful), ostensibly (apparently), mitigate (reduce), impasse (deadlock), candid (frank)",
        "Learn idioms by meaning: learn the ropes, cut corners, back to the drawing board, in the loop",
        "Passive: object becomes subject, verb becomes be + past participle in the same tense; modal → modal + be + past participle",
      ],
    },
    {
      heading: "Para jumbles and reading",
      points: [
        "Opener: a sentence that introduces the topic and needs no earlier reference",
        "Link pairs using pronouns (this, these, it, they), connectors (however, therefore, also) and time order",
        "Concluding sentences often start with 'thus', 'hence' or sum up the idea",
        "Reading: answer from the passage only, not from your own knowledge",
        "Reject extreme options (all, never, entirely, always) unless the passage says so",
        "Inference = must follow from the text; strengthen/weaken = attack or support the assumption linking evidence to conclusion",
      ],
    },
    {
      heading: "Business English",
      points: [
        "Formal email: no contractions, slang, ASAP or FYI; polite request forms (Could you please…)",
        "Cut padding: 'due to the fact that' → because; 'at this point in time' → now; 'in order to' → to",
        "Keep every fact when shortening; remove only repetition",
      ],
    },
  ],
  formulas: [
    "Each / every / either / neither / the number of → singular verb",
    "Neither A nor B + verb agreeing with B",
    "Hardly … when | No sooner … than | Superior to | Prefer A to B",
    "If + were … would | Had + V3 … would have + V3",
  ],
  traps: [
    "Letting a plural noun inside 'of the …' phrase decide the verb (one of the reports is…)",
    "Writing 'no sooner … then' or 'hardly … than'",
    "Using 'than' after senior, junior, superior or prefer",
    "Choosing the dictionary meaning of a word instead of its meaning in that sentence",
    "Picking a reading option that is true in real life but not stated in the passage",
  ],
  examTips: [
    "TCS NQT, Infosys, Accenture, Capgemini and AMCAT verbal sections mix error spotting, fill in the blanks, para jumbles and short passages",
    "Error-spotting answers are usually agreement, tense sequence, preposition or fixed-pair errors – check these four first",
    "Do reading passages last if time is short, but never skip vocabulary-in-context questions – they are quick marks",
  ],
};

export default notes;

import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Subject–verb agreement",
      points: [
        "Singular subject takes a singular verb; plural takes plural.",
        "Each, every, either, neither, one of + plural noun ⇒ singular verb (“Each of the students was given…”).",
        "Either…or / neither…nor: verb agrees with the nearer subject (“Either the students or the teacher is…”).",
        "Collective nouns (committee, jury) take a singular verb as one unit, plural when members act separately.",
        "“The number of” takes singular; “a number of” takes plural.",
        "Words joined by “as well as, along with, together with” do not change the verb; follow the first subject.",
      ],
    },
    {
      heading: "Tenses",
      points: [
        "Since + point of time (since 2015); for + period (for ten years), both with perfect tenses.",
        "“I have known him for ten years”, not “I know him since…”.",
        "Unless/if clauses for future take simple present: “Unless you work hard, you will not pass.”",
        "Unreal condition: “If I were a bird, I would fly” (were for all persons).",
        "Past perfect for the earlier of two past actions: “The train had left before we reached.”",
      ],
    },
    {
      heading: "Prepositions and verb patterns",
      points: [
        "Order a thing, not “order for”; discuss a topic, not “discuss about”.",
        "Insist on doing (not “insist to do”); prevent from doing; prefer A to B.",
        "Comprise does not take “of”: “The team comprises five players.”",
        "Married to, accused of, senior to, superior to, different from.",
        "On for days and dates, in for months and years, at for clock times.",
      ],
    },
    {
      heading: "Adjectives, articles and pronouns",
      points: [
        "Absolute adjectives (unique, perfect, ideal) take no “more/most”.",
        "Comparative with “than”, superlative with “the”: “better than”, “the best”.",
        "A before consonant sounds, an before vowel sounds: an hour, a university, an MBA.",
        "Pronoun after a preposition takes object form: “between you and me”.",
        "Each/every + singular noun takes a singular verb and pronoun: “Every boy has done his work.”",
      ],
    },
    {
      heading: "Error-spotting method",
      points: [
        "Find the subject and main verb first; check agreement.",
        "Then check tense consistency, prepositions, articles and pronoun case.",
        "Look for redundancy: “return back”, “repeat again”, “cousin brother”.",
        "Choose “No error” only after checking every part.",
      ],
    },
  ],
  formulas: [
    "One of + plural noun + singular verb",
    "Neither of / Either of / Each of + plural noun + singular verb",
    "Neither…nor / Either…or ⇒ verb agrees with the nearer subject",
    "Since = point of time; For = period of time",
    "If I were…, I would… (unreal present)",
  ],
  traps: [
    "Matching the verb to the plural noun inside “one of the boys”; the subject is “one”.",
    "Using will in an if/unless clause about the future.",
    "Writing “most unique”, “more superior” or “superior than”.",
    "Adding unnecessary prepositions: “order for”, “discuss about”, “comprise of”.",
    "Using “a” before words starting with a silent h (an honest man).",
  ],
  examTips: [
    "SSC, bank and railway papers test this through error spotting, fill in the blanks and sentence improvement.",
    "Subject–verb agreement and prepositions are the most repeated error types.",
    "Read the whole sentence aloud in your head; the odd-sounding part is usually the error.",
  ],
};

export default notes;

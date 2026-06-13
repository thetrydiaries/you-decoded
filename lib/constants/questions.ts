/**
 * The You, Decoded quiz — 24 questions.
 *
 * Design principles:
 *   · Questions feel like reflection, not a checkbox survey.
 *   · Each question feeds at least two modalities.
 *   · Options are concrete and recognisable — no jargon.
 *   · Together they form a coherent arc: energy → mind → heart → body → soul.
 *
 * Scoring dimensions (used server-side in /lib/engine/):
 *   MBTI:        ei, ns, tf, jp  (-2 strong one side, +2 strong other)
 *   Big Five:    O, C, E, A, N   (0–4 per question, aggregated to percentile)
 *   Enneagram:   e1–e9           (weights per type)
 *   Attachment:  secure, anxious, avoidant, disorganized
 *   Love Langs:  words, acts, time, touch, gifts
 *   Dosha:       vata, pitta, kapha
 *   Jungian:     sage, caregiver, creator, explorer, ruler, hero,
 *                innocent, magician, outlaw, lover, jester, everyman
 */

export type ScoreMap = Record<string, number>;

export interface QuizOption {
  id: string;
  label: string;
  /** Brief elaboration shown on hover / mobile tap */
  sublabel?: string;
  scores: ScoreMap;
}

export interface QuizQuestion {
  id: string;
  /** Ambient one-liner shown above the question — sets the tone */
  context?: string;
  question: string;
  /** "choice" = pick one; "scale" = 1–5 slider (not used yet but reserved) */
  type: "choice";
  options: QuizOption[];
}

export const QUESTIONS: QuizQuestion[] = [
  // ── Arc 1: Energy ────────────────────────────────────────────────────────
  {
    id: "q01_energy",
    context: "There's no right answer. Only the honest one.",
    question: "After a long, full week — what actually restores you?",
    type: "choice",
    options: [
      {
        id: "a",
        label: "Alone time. Quiet, low-stimulation, just me.",
        sublabel: "The best version of rest is solitude",
        scores: { ei: -2, E: -2, vata: 1 },
      },
      {
        id: "b",
        label: "One or two people I trust deeply.",
        sublabel: "Small, unhurried, real",
        scores: { ei: -1, E: -1, A: 1, secure: 1 },
      },
      {
        id: "c",
        label: "Being around people. Energy feeds energy.",
        sublabel: "A dinner, a gathering, something alive",
        scores: { ei: 2, E: 2 },
      },
      {
        id: "d",
        label: "It genuinely depends on the week.",
        sublabel: "Both drain me in excess",
        scores: { ei: 0, E: 0, vata: 1 },
      },
    ],
  },

  {
    id: "q02_information",
    context: "Think about how your mind moves when it encounters something new.",
    question: "You come across an interesting new idea. Your first instinct is to:",
    type: "choice",
    options: [
      {
        id: "a",
        label: "Ground it. What does this mean concretely? What are the examples?",
        sublabel: "Details first, patterns second",
        scores: { ns: -2, O: -1, pitta: 1 },
      },
      {
        id: "b",
        label: "Expand it. Where does this lead? What does it connect to?",
        sublabel: "The implications matter more than the facts",
        scores: { ns: 2, O: 3, sage: 1, creator: 1 },
      },
      {
        id: "c",
        label: "Interrogate it. Is this actually true? What's the evidence?",
        sublabel: "Scepticism is a form of respect",
        scores: { tf: 2, O: 1, pitta: 1, sage: 1 },
      },
      {
        id: "d",
        label: "Feel it. Does this resonate? Does it match something I know?",
        sublabel: "Intuition is also data",
        scores: { tf: -2, ns: 1, O: 1, N: 1 },
      },
    ],
  },

  // ── Arc 2: Mind ───────────────────────────────────────────────────────────
  {
    id: "q03_decisions",
    context: "Not how you think you should respond — how you actually do.",
    question: "A friend shares a real problem. Your most natural response is:",
    type: "choice",
    options: [
      {
        id: "a",
        label: "Listen and validate — they need to feel heard before anything else.",
        sublabel: "The feeling is the thing",
        scores: { tf: -2, A: 2, caregiver: 2, lover: 1, anxious: 1 },
      },
      {
        id: "b",
        label: "Offer a clear framework or solution — that's what actually helps.",
        sublabel: "Love looks like clarity",
        scores: { tf: 2, A: -1, pitta: 1, ruler: 1 },
      },
      {
        id: "c",
        label: "Ask questions — I want to understand the full picture first.",
        sublabel: "Curiosity before advice",
        scores: { tf: 1, O: 1, sage: 1, ns: 1 },
      },
      {
        id: "d",
        label: "Share something parallel from my own life — not prescriptive, just present.",
        sublabel: "Company is the point",
        scores: { tf: -1, A: 1, everyman: 1, secure: 1 },
      },
    ],
  },

  {
    id: "q04_structure",
    context: "How you organise (or don't) your life says something true.",
    question: "Which of these feels most like you?",
    type: "choice",
    options: [
      {
        id: "a",
        label: "I function best with a clear plan. Uncertainty costs me energy.",
        sublabel: "Structure is how I protect my focus",
        scores: { jp: 2, C: 3, e1: 1, pitta: 1, ruler: 1 },
      },
      {
        id: "b",
        label: "I make plans but hold them loosely. The map isn't the territory.",
        sublabel: "Intentional but adaptable",
        scores: { jp: 1, C: 1, secure: 1 },
      },
      {
        id: "c",
        label: "I adapt as I go. The plan usually can't survive contact with reality.",
        sublabel: "Flexibility over prediction",
        scores: { jp: -1, C: -1, vata: 1, explorer: 1 },
      },
      {
        id: "d",
        label: "Plans feel like cages. I do my best work in open space.",
        sublabel: "Obligation kills my energy",
        scores: { jp: -2, C: -2, O: 2, outlaw: 1, vata: 2 },
      },
    ],
  },

  {
    id: "q05_novelty",
    context: "There's no moral value to either. Just what's true.",
    question: "Your relationship with novelty and change — honestly:",
    type: "choice",
    options: [
      {
        id: "a",
        label: "I seek it actively. Routine numbs me.",
        sublabel: "Boredom is worse than risk",
        scores: { O: 3, explorer: 2, vata: 1, jp: -1, e7: 1 },
      },
      {
        id: "b",
        label: "I appreciate it in doses — innovation inside a stable foundation.",
        sublabel: "Change on my terms",
        scores: { O: 1, C: 1, secure: 1 },
      },
      {
        id: "c",
        label: "I prefer the familiar. Reliability over novelty, most of the time.",
        sublabel: "Depth over breadth",
        scores: { O: -1, C: 1, kapha: 1, e6: 1 },
      },
      {
        id: "d",
        label: "It depends entirely on the domain — open in some areas, rooted in others.",
        sublabel: "Context determines everything",
        scores: { O: 1 },
      },
    ],
  },

  {
    id: "q06_discipline",
    context: "Think about how you actually operate, not the version you aspire to.",
    question: "Your relationship with deadlines, systems, and follow-through:",
    type: "choice",
    options: [
      {
        id: "a",
        label: "I create systems before they're needed. Preparation is how I stay sane.",
        sublabel: "Organisation as self-care",
        scores: { C: 3, jp: 2, e1: 1, pitta: 1, ruler: 1 },
      },
      {
        id: "b",
        label: "I meet commitments reliably, but I resist rigid structure.",
        sublabel: "Responsible, not controlled",
        scores: { C: 1, jp: 1, A: 1 },
      },
      {
        id: "c",
        label: "I work better under pressure than ahead of it.",
        sublabel: "Deadlines are the actual engine",
        scores: { C: -1, jp: -1, vata: 1 },
      },
      {
        id: "d",
        label: "Systems feel like cages. My best work is free-form.",
        sublabel: "Flow states over schedules",
        scores: { C: -2, jp: -2, O: 1, creator: 1, vata: 2 },
      },
    ],
  },

  {
    id: "q07_groups",
    context: "Pay attention to what you actually do, not what you wish you'd do.",
    question: "In a group making a decision, you typically:",
    type: "choice",
    options: [
      {
        id: "a",
        label: "Push for what I believe is right, even if it causes friction.",
        sublabel: "Conviction over comfort",
        scores: { A: -1, tf: 2, e8: 1, pitta: 1, hero: 1, outlaw: 1 },
      },
      {
        id: "b",
        label: "Listen carefully, then share my view with care and precision.",
        sublabel: "Considered, not compliant",
        scores: { A: 1, tf: 1, sage: 1, e5: 1 },
      },
      {
        id: "c",
        label: "Find the synthesis — the path that brings the most people with us.",
        sublabel: "Coalition is a superpower",
        scores: { A: 2, e9: 2, kapha: 1, everyman: 1, e2: 1 },
      },
      {
        id: "d",
        label: "Defer if it doesn't matter much — I save my energy for the important battles.",
        sublabel: "Strategic, not passive",
        scores: { A: 1, e9: 1, avoidant: 1 },
      },
    ],
  },

  {
    id: "q08_rumination",
    context: "This one often reveals something surprising.",
    question: "How often do you replay past conversations or worry about future ones?",
    type: "choice",
    options: [
      {
        id: "a",
        label: "Rarely. I process and move on fairly quickly.",
        sublabel: "What's done is done",
        scores: { N: -2, secure: 2, kapha: 1 },
      },
      {
        id: "b",
        label: "Sometimes — usually only for things that genuinely mattered.",
        sublabel: "Selective, not constant",
        scores: { N: 0, secure: 1 },
      },
      {
        id: "c",
        label: "Often. My mind circles back to what I said, or might say.",
        sublabel: "The loop runs in the background",
        scores: { N: 2, anxious: 1, e6: 1, vata: 1 },
      },
      {
        id: "d",
        label: "Almost constantly. It's a significant drain on my energy.",
        sublabel: "The inner critic never really clocks off",
        scores: { N: 3, anxious: 2, e1: 1, e4: 1 },
      },
    ],
  },

  // ── Arc 3: Heart ──────────────────────────────────────────────────────────
  {
    id: "q09_motivation",
    context: "Beneath the daily goals — the actual engine.",
    question: "What drives you most deeply, underneath the surface?",
    type: "choice",
    options: [
      {
        id: "a",
        label: "Being good. Ethical, improving, correcting what's wrong.",
        sublabel: "The world should be better — and so should I",
        scores: { e1: 3, O: 1, pitta: 1, hero: 1 },
      },
      {
        id: "b",
        label: "Being needed. Making a real difference to specific people.",
        sublabel: "Love is the point",
        scores: { e2: 3, A: 2, caregiver: 2, anxious: 1 },
      },
      {
        id: "c",
        label: "Being seen as capable and successful. Making my mark.",
        sublabel: "Achievement is how I feel real",
        scores: { e3: 3, C: 1, pitta: 1, hero: 1, ruler: 1 },
      },
      {
        id: "d",
        label: "Being authentic. Unique, self-expressed, truly known.",
        sublabel: "Depth and originality above all",
        scores: { e4: 3, O: 2, creator: 2, N: 1 },
      },
      {
        id: "e",
        label: "Understanding. Knowledge as protection from being overwhelmed.",
        sublabel: "Mastery gives me ground to stand on",
        scores: { e5: 3, O: 2, sage: 2, avoidant: 1 },
      },
      {
        id: "f",
        label: "Security. Certainty in an uncertain world.",
        sublabel: "Preparation is how I cope with the unknown",
        scores: { e6: 3, C: 1, vata: 1 },
      },
      {
        id: "g",
        label: "Freedom. Experience, possibility, and keeping doors open.",
        sublabel: "Limitation is the real enemy",
        scores: { e7: 3, O: 2, explorer: 2, jp: -1 },
      },
      {
        id: "h",
        label: "Strength. Protecting what matters and never being controlled.",
        sublabel: "Power used with integrity",
        scores: { e8: 3, A: -1, pitta: 1, hero: 1, outlaw: 1 },
      },
      {
        id: "i",
        label: "Peace. Harmony, stillness, belonging to something whole.",
        sublabel: "Presence over performance",
        scores: { e9: 3, A: 2, kapha: 2, everyman: 1 },
      },
    ],
  },

  {
    id: "q10_fear",
    context: "Fears are just loves wearing a mask.",
    question: "Underneath your goals — what are you actually afraid of?",
    type: "choice",
    options: [
      {
        id: "a",
        label: "Being fundamentally bad or corrupt.",
        sublabel: "The inner critic's worst verdict",
        scores: { e1: 2, N: 1 },
      },
      {
        id: "b",
        label: "Being unloved or unwanted.",
        sublabel: "Not needed, not missed",
        scores: { e2: 2, anxious: 2, N: 1 },
      },
      {
        id: "c",
        label: "Being a failure or considered worthless.",
        sublabel: "Without achievement, who am I?",
        scores: { e3: 2, N: 1, C: 1 },
      },
      {
        id: "d",
        label: "Having no identity — being ordinary, invisible.",
        sublabel: "Disappearing into the beige middle",
        scores: { e4: 2, N: 1, O: 1 },
      },
      {
        id: "e",
        label: "Being overwhelmed, incompetent, or running dry.",
        sublabel: "The resources won't be enough",
        scores: { e5: 2, avoidant: 1, N: 1 },
      },
      {
        id: "f",
        label: "Being abandoned or without support when it matters.",
        sublabel: "The floor disappearing underfoot",
        scores: { e6: 2, anxious: 2, disorganized: 1 },
      },
      {
        id: "g",
        label: "Being trapped or deprived of what makes life worth living.",
        sublabel: "The cage closing",
        scores: { e7: 2, O: 1, vata: 1 },
      },
      {
        id: "h",
        label: "Being controlled, betrayed, or violated.",
        sublabel: "Vulnerability weaponised against me",
        scores: { e8: 2, avoidant: 1, disorganized: 1 },
      },
      {
        id: "i",
        label: "Conflict, disconnection, or the loss of inner peace.",
        sublabel: "The fragmentation",
        scores: { e9: 2, A: 1, kapha: 1 },
      },
    ],
  },

  {
    id: "q11_closeness",
    context: "Think about the people you're closest to.",
    question: "In a close relationship, you feel most at ease when:",
    type: "choice",
    options: [
      {
        id: "a",
        label: "There's consistent contact. I know where I stand.",
        sublabel: "Reliability is the love language I don't talk about",
        scores: { anxious: 1, e2: 1, kapha: 1 },
      },
      {
        id: "b",
        label: "We're deeply close and fully ourselves — no performance required.",
        sublabel: "Intimacy without merger",
        scores: { secure: 2, e4: 1 },
      },
      {
        id: "c",
        label: "I have enough space to breathe and be independent within the bond.",
        sublabel: "Connection without suffocation",
        scores: { avoidant: 1, secure: 1, e5: 1 },
      },
      {
        id: "d",
        label: "I'm honestly not sure — closeness is both magnetic and frightening.",
        sublabel: "Pull and push, simultaneously",
        scores: { disorganized: 2, e4: 1, N: 1 },
      },
    ],
  },

  {
    id: "q12_distance",
    context: "What you do when it's hard reveals more than what you do when it's easy.",
    question: "When someone close to you suddenly becomes distant, your instinct is:",
    type: "choice",
    options: [
      {
        id: "a",
        label: "Reach out. The distance makes me anxious and I need to close it.",
        sublabel: "I can't just wait it out",
        scores: { anxious: 2, e2: 1, e6: 1 },
      },
      {
        id: "b",
        label: "Give them space. They'll come back when they're ready.",
        sublabel: "Trust over control",
        scores: { secure: 1, avoidant: 1 },
      },
      {
        id: "c",
        label: "Withdraw too — if they need distance, I can match it.",
        sublabel: "Mirroring as protection",
        scores: { avoidant: 2, e5: 1 },
      },
      {
        id: "d",
        label: "Assume something's wrong and start preparing for the worst.",
        sublabel: "The mind goes straight to catastrophe",
        scores: { anxious: 1, disorganized: 1, e6: 1, N: 1 },
      },
    ],
  },

  // ── Arc 4: Love ───────────────────────────────────────────────────────────
  {
    id: "q13_receiving_love",
    context: "Which one actually lands, even if you don't lead with it.",
    question: "What makes you feel most genuinely loved?",
    type: "choice",
    options: [
      {
        id: "a",
        label: "When someone says it — specific words that really see me.",
        sublabel: "Not generic praise. The real thing.",
        scores: { words: 3, e4: 1 },
      },
      {
        id: "b",
        label: "When someone shows up — acts that required thought and effort.",
        sublabel: "Love as action",
        scores: { acts: 3, e2: 1, C: 1 },
      },
      {
        id: "c",
        label: "When someone gives me their full, unhurried presence.",
        sublabel: "No phone, no distraction, just here",
        scores: { time: 3, secure: 1 },
      },
      {
        id: "d",
        label: "Warmth through touch — a hand on the shoulder, a real hug.",
        sublabel: "The body knows before the mind does",
        scores: { touch: 3, kapha: 1 },
      },
      {
        id: "e",
        label: "When someone brings me something — small, considered, personal.",
        sublabel: "They were thinking of me when I wasn't there",
        scores: { gifts: 3, e2: 1 },
      },
    ],
  },

  {
    id: "q14_giving_love",
    context: "Not how you try to love — how you do it naturally.",
    question: "How do you most instinctively show someone you care?",
    type: "choice",
    options: [
      {
        id: "a",
        label: "I tell them — compliments, specific observations, saying what I see.",
        sublabel: "Articulating the thing most people leave unsaid",
        scores: { words: 3, e4: 1, tf: -1 },
      },
      {
        id: "b",
        label: "I do things — practical help, anticipating what they need.",
        sublabel: "Actions are more honest than words",
        scores: { acts: 3, e2: 1, caregiver: 2 },
      },
      {
        id: "c",
        label: "I give time — fully present, not half-checking my phone.",
        sublabel: "Attention is the most valuable thing I have",
        scores: { time: 3, secure: 1, A: 1 },
      },
      {
        id: "d",
        label: "I reach for them — touch is natural, warm, just how I am.",
        sublabel: "Physical warmth without thinking about it",
        scores: { touch: 3, kapha: 1, E: 1 },
      },
      {
        id: "e",
        label: "I find things — objects that say 'I was thinking of you'.",
        sublabel: "The thought behind the thing",
        scores: { gifts: 3, creator: 1 },
      },
    ],
  },

  // ── Arc 5: Body ───────────────────────────────────────────────────────────
  {
    id: "q15_energy_rhythm",
    context: "Not the ideal — the reality.",
    question: "Your natural energy through the day is best described as:",
    type: "choice",
    options: [
      {
        id: "a",
        label: "Variable. Bursts of intensity, then I need to fully rest.",
        sublabel: "Inconsistent but vivid",
        scores: { vata: 2, creator: 1, ns: 1 },
      },
      {
        id: "b",
        label: "Consistent and high. I run hot and get a lot done.",
        sublabel: "Sustained drive with a short fuse when depleted",
        scores: { pitta: 2, e3: 1, C: 1 },
      },
      {
        id: "c",
        label: "Slow to warm up, long to sustain. I outlast most people.",
        sublabel: "The tortoise wins",
        scores: { kapha: 2, e9: 1 },
      },
    ],
  },

  {
    id: "q16_stress",
    context: "Stress is honest. It shows you who you default to.",
    question: "When you're under real pressure, you most often:",
    type: "choice",
    options: [
      {
        id: "a",
        label: "Scatter — too many thoughts, sleep fragments, can't land on anything.",
        sublabel: "The mind starts spinning",
        scores: { vata: 2, N: 1, e7: 1, anxious: 1 },
      },
      {
        id: "b",
        label: "Intensify — become sharper, harder, shorter with people.",
        sublabel: "The pressure becomes pressure outward",
        scores: { pitta: 2, e8: 1, e1: 1, A: -1 },
      },
      {
        id: "c",
        label: "Withdraw — go quiet, get heavy, lose motivation entirely.",
        sublabel: "Everything becomes an effort",
        scores: { kapha: 2, e9: 1, avoidant: 1, N: 1 },
      },
      {
        id: "d",
        label: "A mix — it depends on the type of pressure.",
        sublabel: "Context shapes the response",
        scores: { vata: 1, pitta: 1, kapha: 1 },
      },
    ],
  },

  {
    id: "q17_constitution",
    context: "Think of your baseline, not your best or worst.",
    question: "Your body and mind at rest — which rings true?",
    type: "choice",
    options: [
      {
        id: "a",
        label: "Light, quick, irregular. Vivid imagination, variable appetite and sleep.",
        sublabel: "Moved by everything, settled by little",
        scores: { vata: 3 },
      },
      {
        id: "b",
        label: "Sharp, warm, decisive. Strong digestion, medium build, determined.",
        sublabel: "The body reflects the mind: focused, purposeful",
        scores: { pitta: 3 },
      },
      {
        id: "c",
        label: "Solid, calm, enduring. Prone to heaviness, but extraordinarily steady.",
        sublabel: "The ground beneath other people",
        scores: { kapha: 3 },
      },
    ],
  },

  // ── Arc 6: Soul ───────────────────────────────────────────────────────────
  {
    id: "q18_role",
    context: "Not the job title. The role you find yourself in, over and over.",
    question: "Which character do you keep being cast as in your own life?",
    type: "choice",
    options: [
      {
        id: "a",
        label: "The one who makes sense of things — teacher, analyst, meaning-maker.",
        sublabel: "Understanding as a gift to others",
        scores: { sage: 3, e5: 1, O: 1 },
      },
      {
        id: "b",
        label: "The one who protects and provides — people feel safe around me.",
        sublabel: "A steady presence, a soft landing",
        scores: { caregiver: 3, e2: 1, hero: 1 },
      },
      {
        id: "c",
        label: "The one who makes things — I turn ideas into something real.",
        sublabel: "Creation as compulsion",
        scores: { creator: 3, O: 2, e3: 1, e4: 1 },
      },
      {
        id: "d",
        label: "The one who explores — always drawn to what's over the horizon.",
        sublabel: "The frontier as home",
        scores: { explorer: 3, O: 2, e7: 1 },
      },
    ],
  },

  {
    id: "q19_truth",
    context: "The one that costs you something to admit.",
    question: "Which of these feels like your deepest truth?",
    type: "choice",
    options: [
      {
        id: "a",
        label: "Life is a journey of transformation — struggle is the point, not the problem.",
        sublabel: "The wound becomes the gift",
        scores: { hero: 3, magician: 1, e4: 1, e8: 1 },
      },
      {
        id: "b",
        label: "Love and devotion are the highest things — connection is what I'm here for.",
        sublabel: "We are each other's purpose",
        scores: { lover: 3, caregiver: 1, e2: 1, e9: 1 },
      },
      {
        id: "c",
        label: "Power should be earned and used with integrity. I want to lead well.",
        sublabel: "Leadership as responsibility, not reward",
        scores: { ruler: 3, e1: 1, e3: 1, e8: 1 },
      },
      {
        id: "d",
        label: "The default is wrong and I'm going to prove it — I question everything.",
        sublabel: "Rebellion in service of something better",
        scores: { outlaw: 3, magician: 1, e7: 1, e8: 1 },
      },
    ],
  },

  {
    id: "q20_shadow",
    context: "The things we get criticised for are often our strengths, unfiltered.",
    question: "What are people most likely to push back on in you?",
    type: "choice",
    options: [
      {
        id: "a",
        label: "Too much — too intense, too emotional, too demanding.",
        sublabel: "The signal is real; the volume is the problem",
        scores: { e4: 1, N: 1, anxious: 1, lover: 1 },
      },
      {
        id: "b",
        label: "Too little — too cold, too distant, too unavailable.",
        sublabel: "Self-protection that reads as indifference",
        scores: { e5: 1, avoidant: 1, A: -1 },
      },
      {
        id: "c",
        label: "Too rigid — too critical, too controlled, too much my way.",
        sublabel: "Conviction without flexibility",
        scores: { e1: 1, e8: 1, C: 1, jp: 2, pitta: 1 },
      },
      {
        id: "d",
        label: "Too scattered — unreliable, impulsive, too many things at once.",
        sublabel: "Vision without follow-through",
        scores: { e7: 1, vata: 1, C: -1, jp: -1 },
      },
    ],
  },

  {
    id: "q21_gift",
    context: "People vote with their needs.",
    question: "What do people most often come to you for?",
    type: "choice",
    options: [
      {
        id: "a",
        label: "To make sense of something — I help people think clearly.",
        sublabel: "Clarity is the gift",
        scores: { sage: 2, tf: 2, O: 1, e5: 1 },
      },
      {
        id: "b",
        label: "To feel seen — I have a rare capacity for genuine witness.",
        sublabel: "Presence as a skill",
        scores: { caregiver: 1, lover: 1, A: 2, e2: 1 },
      },
      {
        id: "c",
        label: "To get something done — I'm the one who makes it happen.",
        sublabel: "Execution as love language",
        scores: { hero: 1, ruler: 1, C: 2, e3: 1 },
      },
      {
        id: "d",
        label: "To imagine something new — I expand what people think is possible.",
        sublabel: "Vision as a gift to the room",
        scores: { creator: 1, magician: 2, O: 2, e7: 1 },
      },
    ],
  },

  {
    id: "q22_values",
    context: "If you had to keep only one, which would it be?",
    question: "What matters most to you in how you live?",
    type: "choice",
    options: [
      {
        id: "a",
        label: "Growth — always becoming, never static.",
        sublabel: "The journey over the destination",
        scores: { O: 2, hero: 1, magician: 1, e4: 1 },
      },
      {
        id: "b",
        label: "Connection — people, depth, belonging.",
        sublabel: "Nothing means much without someone to share it with",
        scores: { A: 2, E: 1, e2: 1, e9: 1, lover: 1 },
      },
      {
        id: "c",
        label: "Integrity — walking my talk, no gap between values and actions.",
        sublabel: "Alignment is the only real success",
        scores: { e1: 1, C: 1, hero: 1, ruler: 1 },
      },
      {
        id: "d",
        label: "Freedom — space, choice, self-determination.",
        sublabel: "Nothing is worth the cage",
        scores: { O: 1, e7: 1, e8: 1, explorer: 1, outlaw: 1 },
      },
    ],
  },

  {
    id: "q23_inner_world",
    context: "The private space no one else fully sees.",
    question: "When you're alone with your thoughts, what are you most likely doing?",
    type: "choice",
    options: [
      {
        id: "a",
        label: "Planning or replaying — mentally mapping what happened or what's coming.",
        sublabel: "The mind as a strategic tool",
        scores: { jp: 1, C: 1, tf: 1, e6: 1 },
      },
      {
        id: "b",
        label: "Imagining or creating — building something real in inner space first.",
        sublabel: "Everything starts as a vision",
        scores: { ns: 2, O: 2, creator: 1, e4: 1, e7: 1 },
      },
      {
        id: "c",
        label: "Processing emotions — untangling what I feel and why.",
        sublabel: "Feelings as information, not noise",
        scores: { tf: -2, N: 1, e4: 1, e2: 1 },
      },
      {
        id: "d",
        label: "Observing — quietly noticing people, patterns, everything.",
        sublabel: "The inner life as an intelligence",
        scores: { ei: -1, ns: 1, O: 1, e5: 1, sage: 1 },
      },
    ],
  },

  {
    id: "q24_throughline",
    context: "The last question. Let it land.",
    question: "If your life had a secret throughline — something only you can fully see — it would be:",
    type: "choice",
    options: [
      {
        id: "a",
        label: "A search for meaning. What is all this actually for?",
        sublabel: "The question underneath every other question",
        scores: { e4: 1, e5: 1, sage: 1, O: 2, ns: 1 },
      },
      {
        id: "b",
        label: "A longing for belonging. To be fully known and still fully loved.",
        sublabel: "Intimacy as the real destination",
        scores: { e2: 1, e4: 1, lover: 1, anxious: 1, A: 1 },
      },
      {
        id: "c",
        label: "A drive to prove yourself. To make something, leave something, matter.",
        sublabel: "Legacy as love",
        scores: { e3: 1, e8: 1, hero: 1, ruler: 1, C: 1 },
      },
      {
        id: "d",
        label: "A quiet rebellion. Always slightly outside, always independent.",
        sublabel: "Never quite fitting, never wanting to",
        scores: { e4: 1, e7: 1, outlaw: 1, explorer: 1, O: 1 },
      },
      {
        id: "e",
        label: "A desire to hold things together. For others, for peace, for stability.",
        sublabel: "The invisible structure everyone else leans on",
        scores: { e9: 2, e2: 1, caregiver: 1, kapha: 1, A: 1 },
      },
    ],
  },
];

export const QUESTION_COUNT = QUESTIONS.length;

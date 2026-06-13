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
        scores: { ei: -2, E: -2, vata: 1 },
      },
      {
        id: "b",
        label: "One or two people I actually trust.",
        scores: { ei: -1, E: -1, A: 1, secure: 1 },
      },
      {
        id: "c",
        label: "Being around people — energy feeds energy.",
        scores: { ei: 2, E: 2 },
      },
      {
        id: "d",
        label: "Honestly, it depends on the week.",
        scores: { ei: 0, E: 0, vata: 1 },
      },
    ],
  },

  {
    id: "q02_information",
    context: "Think about how your mind moves when it encounters something new.",
    question: "You come across an interesting idea. What's your first move?",
    type: "choice",
    options: [
      {
        id: "a",
        label: "Ground it — what does this actually mean? Give me examples.",
        scores: { ns: -2, O: -1, pitta: 1 },
      },
      {
        id: "b",
        label: "Expand it — where does this lead? What does it connect to?",
        scores: { ns: 2, O: 3, sage: 1, creator: 1 },
      },
      {
        id: "c",
        label: "Question it — is this actually true? What's the evidence?",
        scores: { tf: 2, O: 1, pitta: 1, sage: 1 },
      },
      {
        id: "d",
        label: "Feel it — does this resonate? Does it match something I know?",
        scores: { tf: -2, ns: 1, O: 1, N: 1 },
      },
    ],
  },

  // ── Arc 2: Mind ───────────────────────────────────────────────────────────
  {
    id: "q03_decisions",
    context: "Not how you think you should respond — how you actually do.",
    question: "A friend comes to you with a real problem. What do you do?",
    type: "choice",
    options: [
      {
        id: "a",
        label: "Listen. Let them get it all out before anything else.",
        scores: { tf: -2, A: 2, caregiver: 2, lover: 1, anxious: 1 },
      },
      {
        id: "b",
        label: "Get to the point — here's what I'd do, here's why.",
        scores: { tf: 2, A: -1, pitta: 1, ruler: 1 },
      },
      {
        id: "c",
        label: "Ask questions until I understand the full picture.",
        scores: { tf: 1, O: 1, sage: 1, ns: 1 },
      },
      {
        id: "d",
        label: "Share something similar I've been through — just to be there.",
        scores: { tf: -1, A: 1, everyman: 1, secure: 1 },
      },
    ],
  },

  {
    id: "q04_structure",
    context: "How you organise (or don't) your life says something true.",
    question: "Which one actually sounds like you?",
    type: "choice",
    options: [
      {
        id: "a",
        label: "I need a clear plan. Uncertainty costs me energy.",
        scores: { jp: 2, C: 3, e1: 1, pitta: 1, ruler: 1 },
      },
      {
        id: "b",
        label: "I make plans, but I hold them loosely.",
        scores: { jp: 1, C: 1, secure: 1 },
      },
      {
        id: "c",
        label: "I adapt as I go — plans rarely survive reality anyway.",
        scores: { jp: -1, C: -1, vata: 1, explorer: 1 },
      },
      {
        id: "d",
        label: "Plans feel like a cage. I do better in open space.",
        scores: { jp: -2, C: -2, O: 2, outlaw: 1, vata: 2 },
      },
    ],
  },

  {
    id: "q05_novelty",
    context: "There's no moral value to either. Just what's true.",
    question: "How do you feel about change and new experiences?",
    type: "choice",
    options: [
      {
        id: "a",
        label: "I chase them. Routine makes me restless.",
        scores: { O: 3, explorer: 2, vata: 1, jp: -1, e7: 1 },
      },
      {
        id: "b",
        label: "I like them in doses — new things inside a stable base.",
        scores: { O: 1, C: 1, secure: 1 },
      },
      {
        id: "c",
        label: "I lean toward the familiar. Depth over novelty, mostly.",
        scores: { O: -1, C: 1, kapha: 1, e6: 1 },
      },
      {
        id: "d",
        label: "Depends on the area — open in some things, rooted in others.",
        scores: { O: 1 },
      },
    ],
  },

  {
    id: "q06_discipline",
    context: "Think about how you actually operate, not the version you aspire to.",
    question: "Deadlines, systems, follow-through — what's real for you?",
    type: "choice",
    options: [
      {
        id: "a",
        label: "I build systems before I need them. Preparation is how I stay sane.",
        scores: { C: 3, jp: 2, e1: 1, pitta: 1, ruler: 1 },
      },
      {
        id: "b",
        label: "I meet my commitments — I just resist rigid structure.",
        scores: { C: 1, jp: 1, A: 1 },
      },
      {
        id: "c",
        label: "I work better under pressure than ahead of it.",
        scores: { C: -1, jp: -1, vata: 1 },
      },
      {
        id: "d",
        label: "Systems kill my flow. I do my best work free-form.",
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
        label: "Push for what I believe is right, even if it creates friction.",
        scores: { A: -1, tf: 2, e8: 1, pitta: 1, hero: 1, outlaw: 1 },
      },
      {
        id: "b",
        label: "Listen carefully, then share my view when I'm ready.",
        scores: { A: 1, tf: 1, sage: 1, e5: 1 },
      },
      {
        id: "c",
        label: "Try to find the path that brings the most people along.",
        scores: { A: 2, e9: 2, kapha: 1, everyman: 1, e2: 1 },
      },
      {
        id: "d",
        label: "Defer if it doesn't matter much — I save my energy for what does.",
        scores: { A: 1, e9: 1, avoidant: 1 },
      },
    ],
  },

  {
    id: "q08_rumination",
    context: "This one often reveals something surprising.",
    question: "How often do you replay conversations — or worry about ones that haven't happened yet?",
    type: "choice",
    options: [
      {
        id: "a",
        label: "Rarely. I process and move on pretty quickly.",
        scores: { N: -2, secure: 2, kapha: 1 },
      },
      {
        id: "b",
        label: "Sometimes — only when something genuinely mattered.",
        scores: { N: 0, secure: 1 },
      },
      {
        id: "c",
        label: "Often. My mind circles back without me choosing it.",
        scores: { N: 2, anxious: 1, e6: 1, vata: 1 },
      },
      {
        id: "d",
        label: "Almost constantly — it's a real drain.",
        scores: { N: 3, anxious: 2, e1: 1, e4: 1 },
      },
    ],
  },

  // ── Arc 3: Heart ──────────────────────────────────────────────────────────
  {
    id: "q09_motivation",
    context: "Beneath the daily goals — the actual engine.",
    question: "What drives you most, underneath everything else?",
    type: "choice",
    options: [
      {
        id: "a",
        label: "Being good. Ethical, improving, making things right.",
        scores: { e1: 3, O: 1, pitta: 1, hero: 1 },
      },
      {
        id: "b",
        label: "Being needed. Making a real difference to specific people.",
        scores: { e2: 3, A: 2, caregiver: 2, anxious: 1 },
      },
      {
        id: "c",
        label: "Being seen as capable and successful. Making my mark.",
        scores: { e3: 3, C: 1, pitta: 1, hero: 1, ruler: 1 },
      },
      {
        id: "d",
        label: "Being authentic. Unique, self-expressed, truly known.",
        scores: { e4: 3, O: 2, creator: 2, N: 1 },
      },
      {
        id: "e",
        label: "Understanding. Knowledge as a way to stay grounded.",
        scores: { e5: 3, O: 2, sage: 2, avoidant: 1 },
      },
      {
        id: "f",
        label: "Security. Certainty in an uncertain world.",
        scores: { e6: 3, C: 1, vata: 1 },
      },
      {
        id: "g",
        label: "Freedom. Experience, possibility, keeping options open.",
        scores: { e7: 3, O: 2, explorer: 2, jp: -1 },
      },
      {
        id: "h",
        label: "Strength. Protecting what matters and never being controlled.",
        scores: { e8: 3, A: -1, pitta: 1, hero: 1, outlaw: 1 },
      },
      {
        id: "i",
        label: "Peace. Harmony, stillness, belonging to something bigger.",
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
        scores: { e1: 2, N: 1 },
      },
      {
        id: "b",
        label: "Being unloved or unwanted.",
        scores: { e2: 2, anxious: 2, N: 1 },
      },
      {
        id: "c",
        label: "Failing. Being seen as worthless.",
        scores: { e3: 2, N: 1, C: 1 },
      },
      {
        id: "d",
        label: "Having no identity — being ordinary, invisible.",
        scores: { e4: 2, N: 1, O: 1 },
      },
      {
        id: "e",
        label: "Being overwhelmed or running out of resources.",
        scores: { e5: 2, avoidant: 1, N: 1 },
      },
      {
        id: "f",
        label: "Being abandoned when it actually counts.",
        scores: { e6: 2, anxious: 2, disorganized: 1 },
      },
      {
        id: "g",
        label: "Being trapped — losing what makes life feel alive.",
        scores: { e7: 2, O: 1, vata: 1 },
      },
      {
        id: "h",
        label: "Being controlled, betrayed, or taken advantage of.",
        scores: { e8: 2, avoidant: 1, disorganized: 1 },
      },
      {
        id: "i",
        label: "Conflict, disconnection, losing my sense of peace.",
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
        scores: { anxious: 1, e2: 1, kapha: 1 },
      },
      {
        id: "b",
        label: "We're genuinely close and fully ourselves — no performance needed.",
        scores: { secure: 2, e4: 1 },
      },
      {
        id: "c",
        label: "I have enough space to breathe within the bond.",
        scores: { avoidant: 1, secure: 1, e5: 1 },
      },
      {
        id: "d",
        label: "Honestly, I'm not sure — closeness is both magnetic and scary.",
        scores: { disorganized: 2, e4: 1, N: 1 },
      },
    ],
  },

  {
    id: "q12_distance",
    context: "What you do when it's hard reveals more than what you do when it's easy.",
    question: "Someone close to you suddenly goes quiet. What do you do?",
    type: "choice",
    options: [
      {
        id: "a",
        label: "Reach out. The distance makes me anxious — I need to close it.",
        scores: { anxious: 2, e2: 1, e6: 1 },
      },
      {
        id: "b",
        label: "Give them space. They'll come back when they're ready.",
        scores: { secure: 1, avoidant: 1 },
      },
      {
        id: "c",
        label: "Pull back too — if they want distance, I can match it.",
        scores: { avoidant: 2, e5: 1 },
      },
      {
        id: "d",
        label: "Start preparing for the worst in my head.",
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
        label: "When someone says something specific that really sees me.",
        scores: { words: 3, e4: 1 },
      },
      {
        id: "b",
        label: "When someone shows up — acts that took real thought and effort.",
        scores: { acts: 3, e2: 1, C: 1 },
      },
      {
        id: "c",
        label: "When someone gives me their full, undivided presence.",
        scores: { time: 3, secure: 1 },
      },
      {
        id: "d",
        label: "Warmth through touch — a hand on the shoulder, a real hug.",
        scores: { touch: 3, kapha: 1 },
      },
      {
        id: "e",
        label: "When someone brings me something small and personal — they were thinking of me.",
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
        label: "I tell them — specific, real observations. I say the thing out loud.",
        scores: { words: 3, e4: 1, tf: -1 },
      },
      {
        id: "b",
        label: "I do things — anticipate what they need before they ask.",
        scores: { acts: 3, e2: 1, caregiver: 2 },
      },
      {
        id: "c",
        label: "I give time — fully present, phone face-down.",
        scores: { time: 3, secure: 1, A: 1 },
      },
      {
        id: "d",
        label: "I reach for them — touch is just how I show up.",
        scores: { touch: 3, kapha: 1, E: 1 },
      },
      {
        id: "e",
        label: "I find things — objects that say 'I was thinking of you'.",
        scores: { gifts: 3, creator: 1 },
      },
    ],
  },

  // ── Arc 5: Body ───────────────────────────────────────────────────────────
  {
    id: "q15_energy_rhythm",
    context: "Not the ideal — the reality.",
    question: "How does your energy actually move through the day?",
    type: "choice",
    options: [
      {
        id: "a",
        label: "In bursts — intense focus, then I need to fully crash.",
        scores: { vata: 2, creator: 1, ns: 1 },
      },
      {
        id: "b",
        label: "Consistent and high — I run hot and get a lot done.",
        scores: { pitta: 2, e3: 1, C: 1 },
      },
      {
        id: "c",
        label: "Slow to start, but I outlast most people.",
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
        label: "Scatter — too many thoughts, can't land on any of them.",
        scores: { vata: 2, N: 1, e7: 1, anxious: 1 },
      },
      {
        id: "b",
        label: "Intensify — sharper, harder, shorter with people.",
        scores: { pitta: 2, e8: 1, e1: 1, A: -1 },
      },
      {
        id: "c",
        label: "Go quiet — withdraw, get heavy, lose motivation.",
        scores: { kapha: 2, e9: 1, avoidant: 1, N: 1 },
      },
      {
        id: "d",
        label: "A mix — depends on the type of pressure.",
        scores: { vata: 1, pitta: 1, kapha: 1 },
      },
    ],
  },

  {
    id: "q17_constitution",
    context: "Think of your baseline, not your best or worst.",
    question: "Your body and mind at rest — which one rings true?",
    type: "choice",
    options: [
      {
        id: "a",
        label: "Light, quick, irregular. Vivid imagination, variable sleep and appetite.",
        scores: { vata: 3 },
      },
      {
        id: "b",
        label: "Sharp, warm, decisive. Strong drive, medium build, determined.",
        scores: { pitta: 3 },
      },
      {
        id: "c",
        label: "Solid, calm, steady. Prone to heaviness, but I outlast everyone.",
        scores: { kapha: 3 },
      },
    ],
  },

  // ── Arc 6: Soul ───────────────────────────────────────────────────────────
  {
    id: "q18_role",
    context: "Not the job title. The role you find yourself in, over and over.",
    question: "Which character do you keep becoming in your own life?",
    type: "choice",
    options: [
      {
        id: "a",
        label: "The one who makes sense of things — the one people come to for clarity.",
        scores: { sage: 3, e5: 1, O: 1 },
      },
      {
        id: "b",
        label: "The one who holds it together — people feel safe around me.",
        scores: { caregiver: 3, e2: 1, hero: 1 },
      },
      {
        id: "c",
        label: "The one who makes things — ideas become real through me.",
        scores: { creator: 3, O: 2, e3: 1, e4: 1 },
      },
      {
        id: "d",
        label: "The one who explores — always drawn to what's over the next horizon.",
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
        label: "Life is transformation — the hard stuff is the point, not the problem.",
        scores: { hero: 3, magician: 1, e4: 1, e8: 1 },
      },
      {
        id: "b",
        label: "Love and connection are why we're here. Everything else is secondary.",
        scores: { lover: 3, caregiver: 1, e2: 1, e9: 1 },
      },
      {
        id: "c",
        label: "Power should be earned and used with real integrity.",
        scores: { ruler: 3, e1: 1, e3: 1, e8: 1 },
      },
      {
        id: "d",
        label: "The default is wrong — I question things most people just accept.",
        scores: { outlaw: 3, magician: 1, e7: 1, e8: 1 },
      },
    ],
  },

  {
    id: "q20_shadow",
    context: "The things we get criticised for are often our strengths, unfiltered.",
    question: "What do people most often push back on in you?",
    type: "choice",
    options: [
      {
        id: "a",
        label: "Too much — too intense, too emotional, too demanding.",
        scores: { e4: 1, N: 1, anxious: 1, lover: 1 },
      },
      {
        id: "b",
        label: "Too little — too cold, too distant, too hard to reach.",
        scores: { e5: 1, avoidant: 1, A: -1 },
      },
      {
        id: "c",
        label: "Too rigid — too critical, too controlling, too much my way.",
        scores: { e1: 1, e8: 1, C: 1, jp: 2, pitta: 1 },
      },
      {
        id: "d",
        label: "Too scattered — impulsive, all over the place, hard to pin down.",
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
        label: "To think through something — I help people get clarity.",
        scores: { sage: 2, tf: 2, O: 1, e5: 1 },
      },
      {
        id: "b",
        label: "To feel heard — I actually listen in a way most people don't.",
        scores: { caregiver: 1, lover: 1, A: 2, e2: 1 },
      },
      {
        id: "c",
        label: "To get something done — I'm the one who makes it happen.",
        scores: { hero: 1, ruler: 1, C: 2, e3: 1 },
      },
      {
        id: "d",
        label: "To see new possibilities — I expand what people think is doable.",
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
        scores: { O: 2, hero: 1, magician: 1, e4: 1 },
      },
      {
        id: "b",
        label: "Connection — people, depth, belonging.",
        scores: { A: 2, E: 1, e2: 1, e9: 1, lover: 1 },
      },
      {
        id: "c",
        label: "Integrity — no gap between what I believe and how I live.",
        scores: { e1: 1, C: 1, hero: 1, ruler: 1 },
      },
      {
        id: "d",
        label: "Freedom — space, choice, no one else's script.",
        scores: { O: 1, e7: 1, e8: 1, explorer: 1, outlaw: 1 },
      },
    ],
  },

  {
    id: "q23_inner_world",
    context: "The private space no one else fully sees.",
    question: "When you're alone with your thoughts, what are you usually doing in there?",
    type: "choice",
    options: [
      {
        id: "a",
        label: "Planning or replaying — mapping what happened or what's coming.",
        scores: { jp: 1, C: 1, tf: 1, e6: 1 },
      },
      {
        id: "b",
        label: "Imagining or creating — building things in my head first.",
        scores: { ns: 2, O: 2, creator: 1, e4: 1, e7: 1 },
      },
      {
        id: "c",
        label: "Processing feelings — untangling what I feel and why.",
        scores: { tf: -2, N: 1, e4: 1, e2: 1 },
      },
      {
        id: "d",
        label: "Observing — quietly noticing people, patterns, everything.",
        scores: { ei: -1, ns: 1, O: 1, e5: 1, sage: 1 },
      },
    ],
  },

  {
    id: "q24_throughline",
    context: "The last question. Let it land.",
    question: "If your life had a secret throughline — something only you can see — it would be:",
    type: "choice",
    options: [
      {
        id: "a",
        label: "A search for meaning. What is all this actually for?",
        scores: { e4: 1, e5: 1, sage: 1, O: 2, ns: 1 },
      },
      {
        id: "b",
        label: "A longing to be fully known and still fully loved.",
        scores: { e2: 1, e4: 1, lover: 1, anxious: 1, A: 1 },
      },
      {
        id: "c",
        label: "A need to prove yourself — to make something, leave something, matter.",
        scores: { e3: 1, e8: 1, hero: 1, ruler: 1, C: 1 },
      },
      {
        id: "d",
        label: "A quiet rebellion. Always slightly outside, always independent.",
        scores: { e4: 1, e7: 1, outlaw: 1, explorer: 1, O: 1 },
      },
      {
        id: "e",
        label: "A need to hold things together — for others, for peace, for stability.",
        scores: { e9: 2, e2: 1, caregiver: 1, kapha: 1, A: 1 },
      },
    ],
  },
];

export const QUESTION_COUNT = QUESTIONS.length;

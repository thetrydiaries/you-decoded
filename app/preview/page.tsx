// PREVIEW ONLY — delete this file when done reviewing the design
import { PassportView } from "@/app/p/[slug]/PassportView";

const MOCK_PASSPORT = {
  share_slug: "preview",
  first_name: "Shirley",
  birth_date: "1993-06-14",
  birth_place: "Melbourne, Australia",
  overall_summary:
    "Across every system, one pattern surfaces: you move between depth and motion, between the need to understand everything and the need to feel it. You are not one thing. You are the relationship between things — and that's where your rarest thinking happens.",
  computed_results: {
    western_astrology: {
      headline: "Gemini Sun, Scorpio Rising",
      subline: "Mercury-ruled · Fixed water",
      summary:
        "Your mind moves like quicksilver but your soul digs in like roots. You speak in bridges, always translating between worlds others can't reach simultaneously.",
      details: { sun: "Gemini", rising: "Scorpio", moon: "Pisces", mercury: "Gemini" },
    },
    numerology: {
      headline: "Life Path 7",
      subline: "The Seeker · Inner knowing",
      summary:
        "You were born to question. Not from doubt, but from an almost cellular need to understand what lies beneath the surface — people, systems, patterns, and the invisible forces that connect them.",
      details: { lifePath: "7", expression: "11", soulUrge: "2" },
    },
    human_design: {
      headline: "Projector, 3/5",
      subline: "Heretic · Heroine · Sacral undefined",
      summary:
        "You are not designed to initiate. You are designed to be recognised, invited, and then to see further than anyone in the room. Waiting is not weakness — it's strategy.",
      details: { type: "Projector", profile: "3/5", authority: "Splenic", strategy: "Wait for invitation" },
    },
    chinese_zodiac: {
      headline: "Year of the Rooster",
      subline: "Metal element · Yin polarity",
      summary:
        "Exacting and visionary. You hold an internal standard of excellence that few around you can see, which makes your precision look like perfectionism to people who don't know you well.",
      details: { sign: "Rooster", element: "Metal", polarity: "Yin" },
    },
    bazi: {
      headline: "Wood Day Master",
      subline: "Resourceful · Growth-oriented",
      summary:
        "Adaptable and growth-seeking by nature. You need space to expand — environments that constrain you physically or intellectually quietly drain you, often without you noticing until you're already depleted.",
      details: { dayMaster: "Wood", season: "Summer", strength: "Moderate" },
    },
    celtic_zodiac: {
      headline: "Oak",
      subline: "The Stabiliser · June 10–July 7",
      summary:
        "Natural strength with hidden depth. You provide grounding for others while privately carrying a vast interior world most people only glimpse in fragments.",
    },
    vedic_astrology: {
      headline: "Mithuna Lagna",
      subline: "Gemini ascendant · Mercury lord",
      summary:
        "Communication as your primary instrument of being. You don't just express yourself — you think in language, and your words have a precision that arrives before you consciously plan them.",
    },
    mayan_sign: {
      headline: "Kin 113 · Red Solar Skywalker",
      subline: "Tone 9 · Solar · Ben",
      summary:
        "Explorer of consciousness and connector of worlds. You carry a vision of what's possible that pulls you forward before you've figured out the path — and somehow, the path appears anyway.",
    },
  },
  quiz_results: {
    mbti: {
      headline: "INFJ",
      subline: "The Advocate · Introverted intuition",
      summary:
        "You carry a map of the future that no one else can read. It's not prediction — it's pattern recognition so deep it bypasses language and arrives as certainty.",
      details: { type: "INFJ", cognitive: "Ni-Fe-Ti-Se", rarity: "1–3% of population" },
    },
    enneagram: {
      headline: "Type 4w5",
      subline: "The Bohemian · Identity through depth",
      summary:
        "You are moved by beauty in places others don't think to look — the bittersweet note at the end of a perfect thing, the specific texture of a specific kind of longing.",
      details: { type: "4", wing: "5", instinct: "Sexual/Social", integration: "→ Type 1" },
    },
    big_five: {
      headline: "High Openness, High Conscientiousness",
      subline: "Creative structure · Principled imagination",
      summary:
        "You live in the tension between innovation and order. You want to do things in a new way and in the right way simultaneously — and somehow, that tension produces your best work.",
      details: { openness: "92nd", conscientiousness: "78th", extraversion: "31st", agreeableness: "65th", neuroticism: "58th" },
    },
    attachment: {
      headline: "Secure with Anxious Edges",
      subline: "Earned security · Depth-seeking",
      summary:
        "You've built genuine security through experience and reflection, not circumstance. But intimacy still activates a quiet monitoring — checking whether you're too much, or not enough.",
    },
    love_languages: {
      headline: "Words of Affirmation + Quality Time",
      subline: "Language of meaning · Full presence",
      summary:
        "You give and need language that names things precisely. Presence without words feels empty; words without presence feel hollow. You need both, simultaneously.",
    },
    dosha: {
      headline: "Vata-Pitta",
      subline: "Air meets fire · Movement and drive",
      summary:
        "Creative momentum with a relentless inner engine. You generate ideas faster than most people can receive them, which sometimes leaves you feeling further ahead than you'd like to be.",
      details: { primary: "Vata", secondary: "Pitta", balance: "Movement + transformation" },
    },
    archetype: {
      headline: "The Creator × The Sage",
      subline: "Making meaning through making things",
      summary:
        "You don't just want to understand the world — you want to build something in response to what you understand. Your work is always a kind of translation: inner knowing into outer form.",
    },
  },
  ai_results: {
    shadow_profile: {
      headline: "The Perfectionist in Hiding",
      subline: "What you protect against",
      summary:
        "Your shadow moves through you as a terror of being seen as ordinary. You would rather disappear than be misunderstood — so sometimes you disappear first, before anyone gets the chance. The work is letting yourself be seen in the in-between, before you've perfected it.",
    },
    core_gift: {
      headline: "Bridging the Unseen",
      subline: "What you're here to do",
      summary:
        "You translate. Between depth and surface, between the intuitive and the articulate, between what people feel and can't say. This is your rarest gift — and the one most easily mistaken for something more ordinary, by everyone including you.",
    },
    cosmic_headline: {
      headline: "The Architect Who Feels Everything",
      subline: "Your signature paradox",
      summary:
        "You build worlds with rigorous precision, then inhabit them with your whole nervous system. The tension between your vision and your sensitivity isn't a contradiction — it's your signature. The ones who understand both sides of you are the ones worth keeping.",
    },
  },
};

export default function PreviewPage() {
  return <PassportView passport={MOCK_PASSPORT as any} />;
}

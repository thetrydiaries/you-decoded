import type { QuizAnswers, ModalityResult } from "@/lib/types";
import { aggregateScores, topKey, topN } from "./score-helpers";

const ARCHETYPES: Record<string, { name: string; essence: string; gift: string; shadow: string; examples: string }> = {
  sage: {
    name: "The Sage",
    essence: "The seeker of truth — wisdom through understanding",
    gift: "Clarity, perspective, the ability to see past the obvious",
    shadow: "Arrogance, detachment, withholding wisdom as power",
    examples: "Gandalf, Athena, Carl Jung, Yoda",
  },
  caregiver: {
    name: "The Caregiver",
    essence: "The one who tends — love as a verb",
    gift: "Empathy, presence, the ability to hold others in difficulty",
    shadow: "Martyrdom, enabling, forgetting the self entirely",
    examples: "Mother Teresa, Atticus Finch, Florence Nightingale",
  },
  creator: {
    name: "The Creator",
    essence: "The maker — turning vision into form",
    gift: "Originality, craft, the ability to manifest the unseen",
    shadow: "Perfectionism, possessiveness, narcissism about the work",
    examples: "Frida Kahlo, Leonardo da Vinci, Mozart",
  },
  explorer: {
    name: "The Explorer",
    essence: "The seeker — freedom through movement and discovery",
    gift: "Authenticity, independence, courage toward the unknown",
    shadow: "Restlessness, commitment-phobia, aimlessness",
    examples: "Indiana Jones, Amelia Earhart, Jack Kerouac",
  },
  ruler: {
    name: "The Ruler",
    essence: "The sovereign — power in service of order",
    gift: "Leadership, responsibility, building what lasts",
    shadow: "Tyranny, rigidity, fear of losing control",
    examples: "Elizabeth I, Marcus Aurelius, Tony Stark",
  },
  hero: {
    name: "The Hero",
    essence: "The champion — courage in the face of difficulty",
    gift: "Transformation through struggle, inspiring others by example",
    shadow: "Arrogance, need to prove worth, difficulty with vulnerability",
    examples: "Odysseus, Wonder Woman, Malala Yousafzai",
  },
  innocent: {
    name: "The Innocent",
    essence: "The optimist — faith in goodness",
    gift: "Joy, hope, the ability to see possibility where others see barriers",
    shadow: "Naivety, denial, bypassing difficulty for comfort",
    examples: "Forrest Gump, Anne of Green Gables, Mr. Rogers",
  },
  magician: {
    name: "The Magician",
    essence: "The transformer — making the impossible real",
    gift: "Vision, insight, the ability to catalyse change",
    shadow: "Manipulation, grandiosity, disconnection from consequences",
    examples: "Merlin, Steve Jobs, Nikola Tesla",
  },
  outlaw: {
    name: "The Outlaw",
    essence: "The disruptor — revolution in service of truth",
    gift: "Challenging what doesn't work, fearlessness, awakening others",
    shadow: "Destructiveness for its own sake, inability to work within any system",
    examples: "Robin Hood, Rosa Parks, Jim Morrison",
  },
  lover: {
    name: "The Lover",
    essence: "The devotee — connection as the highest value",
    gift: "Intimacy, passion, the ability to be fully present with another",
    shadow: "Loss of self in the other, jealousy, emotional overwhelm",
    examples: "Romeo and Juliet, Rumi, Pablo Neruda",
  },
  jester: {
    name: "The Jester",
    essence: "The player — joy and truth through lightness",
    gift: "Humour, perspective, the ability to say the unsayable",
    shadow: "Avoiding depth, using wit as deflection, cruelty dressed as comedy",
    examples: "Puck, Robin Williams, Falstaff",
  },
  everyman: {
    name: "The Everyman",
    essence: "The connector — belonging through relatability",
    gift: "Empathy, down-to-earth wisdom, creating genuine community",
    shadow: "Losing individuality for acceptance, mediocrity as virtue",
    examples: "Harry Potter, Bilbo Baggins, Barack Obama",
  },
};

export function scoreJungian(answers: QuizAnswers): ModalityResult {
  const s = aggregateScores(answers);
  const archetypeKeys = Object.keys(ARCHETYPES);
  const archetypeScores: Record<string, number> = {};
  for (const k of archetypeKeys) archetypeScores[k] = s[k] ?? 0;

  const [primary, secondary] = topN(archetypeScores, 2);
  const arch = ARCHETYPES[primary];
  const secondArch = ARCHETYPES[secondary];

  return {
    modalityId: "jungian_archetype",
    headline: `${arch.name}${secondArch ? ` / ${secondArch.name}` : ""}`,
    subline: arch.essence,
    summary: "",
    details: {
      primaryArchetype: arch.name,
      essence: arch.essence,
      gift: arch.gift,
      shadow: arch.shadow,
      famousExamples: arch.examples,
      secondaryArchetype: secondArch?.name ?? "—",
      secondaryEssence: secondArch?.essence ?? "",
    },
    scores: archetypeScores,
  };
}

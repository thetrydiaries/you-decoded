import Anthropic from "@anthropic-ai/sdk";

/**
 * Anthropic client + the model used for all passport synthesis.
 *
 * claude-sonnet-4-6 writes:
 *  - the warm personalised paragraph on every modality card
 *  - the three AI modalities (Shadow Profile, Core Gift, Cosmic Headline)
 *  - the overall "Common Threads" summary
 */
export const CLAUDE_MODEL = "claude-sonnet-4-6";

let client: Anthropic | null = null;

export function anthropic(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("Missing ANTHROPIC_API_KEY (see .env.example).");
  }
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

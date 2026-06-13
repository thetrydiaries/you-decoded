import type { Config } from "tailwindcss";

/**
 * "You, Decoded" — Celestial Dark theme
 *
 * Deep midnight base, gold + iridescent accents.
 * Each modality category gets its own accent so result cards
 * feel distinct while staying in one family.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base midnight palette
        night: {
          950: "#070510", // page background
          900: "#0d0a1c", // card background
          800: "#161130", // raised surfaces
          700: "#221a4a", // borders / dividers
          600: "#33296b", // hover states
        },
        // Primary accent — celestial gold
        gold: {
          300: "#f5e3b3",
          400: "#eccf85",
          500: "#dfb755", // primary CTA / headings
          600: "#b8923a",
        },
        // Secondary accents per modality category
        cosmos: "#8b7ff7", // birth-data modalities (violet)
        psyche: "#5fd4c4", // quiz modalities (teal)
        oracle: "#f78fb8", // AI-synthesized (rose)
        starlight: "#e9e6f7", // primary text on dark
        stardust: "#9b93c0", // secondary text on dark
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "aurora":
          "radial-gradient(ellipse 80% 50% at 20% -10%, rgba(139,127,247,0.25), transparent), radial-gradient(ellipse 60% 40% at 90% 10%, rgba(247,143,184,0.12), transparent), radial-gradient(ellipse 70% 60% at 50% 110%, rgba(95,212,196,0.10), transparent)",
        "card-sheen":
          "linear-gradient(135deg, rgba(223,183,85,0.08) 0%, transparent 40%, rgba(139,127,247,0.06) 100%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(223,183,85,0.15)",
        "glow-violet": "0 0 40px rgba(139,127,247,0.2)",
        card: "0 4px 32px rgba(0,0,0,0.5)",
      },
      animation: {
        twinkle: "twinkle 4s ease-in-out infinite",
        float: "float 8s ease-in-out infinite",
        "fade-up": "fadeUp 0.7s ease-out both",
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

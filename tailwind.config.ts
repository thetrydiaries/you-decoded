import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // True deep navy — actual night sky, not AI purple
        night: {
          950: "#05071A",
          900: "#09102A",
          800: "#111830",
          700: "#1C2545",
          600: "#273360",
        },
        // Warm copper — replaces generic gold
        copper: {
          300: "#F0D0A8",
          400: "#D9A96E",
          500: "#C48A45",
          600: "#9B6530",
        },
        // Category accents — muted, not electric
        cosmos:    "#7B9FD4", // steel blue — birth data
        psyche:    "#6BB5A0", // jade — quiz
        oracle:    "#D4877A", // terracotta — AI synthesis
        // Typography
        starlight: "#ECE8E0", // warm ivory — primary text
        stardust:  "#8E8BAA", // muted lavender-grey — secondary
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body:    ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        // Subtle directional glow — not aurora blobs
        "page-glow":
          "radial-gradient(ellipse 70% 50% at 30% 50%, rgba(123,159,212,0.09) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 75% 40%, rgba(212,135,122,0.06) 0%, transparent 60%)",
      },
      boxShadow: {
        card:   "0 4px 32px rgba(0,0,0,0.5)",
        copper: "0 0 32px rgba(196,138,69,0.12)",
      },
      animation: {
        twinkle:  "twinkle var(--twinkle-dur, 4s) ease-in-out infinite var(--twinkle-delay, 0s)",
        "fade-up": "fadeUp 0.6s cubic-bezier(0.23,1,0.32,1) both",
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "var(--star-min, 0.15)" },
          "50%":       { opacity: "var(--star-max, 0.7)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

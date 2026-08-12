import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#121116",        // page background — warm-cool charcoal
        panel: "#1C1B21",      // card / raised surface
        panelLine: "#332F35",  // hairline dividers on panels
        cream: "#F1ECE2",      // primary text, paper-label warmth
        smoke: "#9C97A0",      // muted / secondary text
        amber: "#E7A33E",      // VU-meter needle — primary accent
        rust: "#C1502E",       // peak-warning red — secondary accent
        moss: "#5C7A5E",       // tape-reel green — tertiary accent, used sparingly
      },
      fontFamily: {
        display: ["Oswald", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      backgroundImage: {
        stripe:
          "repeating-linear-gradient(135deg, var(--tw-gradient-stops) 0 10px, transparent 10px 20px)",
      },
      keyframes: {
        spin_slow: { to: { transform: "rotate(360deg)" } },
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        spin_slow: "spin_slow 14s linear infinite",
        rise: "rise 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}",
    "./types/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#030712",
        foreground: "#f9fafb",
        card: "#111827",
        border: "#1f2937",
        input: "#111827",
        primary: "#06b6d4",
        secondary: "#0f172a",
        muted: "#94a3b8",
        ring: "#22d3ee"
      },
      boxShadow: {
        neon: "0 0 0 1px rgba(6,182,212,0.2), 0 0 28px rgba(6,182,212,0.16)"
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at top, rgba(6,182,212,0.12), transparent 40%), linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)"
      },
      backgroundSize: {
        "grid-glow": "auto, 40px 40px, 40px 40px"
      }
    }
  },
  plugins: []
};

export default config;

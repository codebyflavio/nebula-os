import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Menlo", "monospace"],
      },
      colors: {
        nebula: {
          bg:      "#020617",
          surface: "#0A0C1C",
          card:    "#0F1225",
          border:  "rgba(255,255,255,0.08)",
        },
        accent: {
          indigo: "#6366F1",
          cyan:   "#06B6D4",
          purple: "#A855F7",
        },
      },
      backgroundImage: {
        "nebula-gradient":
          "radial-gradient(ellipse at 20% 30%, rgba(99,102,241,0.15) 0%, transparent 50%)," +
          "radial-gradient(ellipse at 80% 70%, rgba(6,182,212,0.10) 0%, transparent 50%)," +
          "radial-gradient(ellipse at 50% 50%, rgba(168,85,247,0.08) 0%, transparent 60%)",
      },
      keyframes: {
        "nebula-drift": {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%":     { transform: "translate(30px,-20px) scale(1.08)" },
          "66%":     { transform: "translate(-15px,25px) scale(0.93)" },
        },
        "dock-bounce": {
          "0%,100%": { transform: "translateY(0)" },
          "50%":     { transform: "translateY(-14px)" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "scale(0.97)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "window-open": {
          from: { opacity: "0", transform: "scale(0.92) translateY(8px)" },
          to:   { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        blink: {
          "0%,100%": { opacity: "1" },
          "50%":     { opacity: "0" },
        },
        "eq-bar": {
          "0%,100%": { height: "4px"  },
          "50%":     { height: "20px" },
        },
      },
      animation: {
        "nebula-drift-1": "nebula-drift 18s ease-in-out infinite",
        "nebula-drift-2": "nebula-drift 24s ease-in-out infinite 4s",
        "nebula-drift-3": "nebula-drift 30s ease-in-out infinite 8s",
        "dock-bounce":    "dock-bounce 0.6s ease-in-out",
        "fade-in":        "fade-in 0.2s ease-out",
        "slide-up":       "slide-up 0.25s ease-out",
        "window-open":    "window-open 0.22s cubic-bezier(0.16,1,0.3,1)",
        shimmer:          "shimmer 2s linear infinite",
        "spin-slow":      "spin-slow 8s linear infinite",
        blink:            "blink 1s step-end infinite",
        "eq-bar-1":       "eq-bar 0.8s ease-in-out infinite",
        "eq-bar-2":       "eq-bar 0.8s ease-in-out infinite 0.2s",
        "eq-bar-3":       "eq-bar 0.8s ease-in-out infinite 0.4s",
        "eq-bar-4":       "eq-bar 0.8s ease-in-out infinite 0.1s",
      },
      backdropBlur: {
        "3xl": "48px",
        "4xl": "64px",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Obsidian dark palette
        obsidian: {
          900: "#0a0a0f",
          800: "#121218",
          700: "#1a1a24",
          600: "#252530",
          500: "#30303c",
        },
        // Accent gradients
        neon: {
          cyan: "#00f0ff",
          purple: "#b07aff",
          pink: "#ff6ec7",
          blue: "#4d7cff",
        },
      },
      backgroundImage: {
        "glass-gradient": "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
        "glow-gradient": "linear-gradient(135deg, #00f0ff, #b07aff, #ff6ec7)",
        "grid-white": "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
        "dot-white": "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
      },
      backdropBlur: {
        xs: "2px",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(0,240,255,0.3)" },
          "100%": { boxShadow: "0 0 40px rgba(176,122,255,0.6)" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

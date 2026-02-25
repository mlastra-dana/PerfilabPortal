import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "rgb(var(--brand-bg) / <alpha-value>)",
          text: "rgb(var(--brand-text) / <alpha-value>)",
          muted: "rgb(var(--brand-muted) / <alpha-value>)",
          primary: "rgb(var(--brand-primary) / <alpha-value>)",
          primary2: "rgb(var(--brand-primary-2) / <alpha-value>)",
          accent: "rgb(var(--brand-accent) / <alpha-value>)",
          ink: "rgb(var(--brand-ink) / <alpha-value>)",
          ink2: "rgb(var(--brand-ink-2) / <alpha-value>)",
          surface: "rgb(var(--brand-surface) / <alpha-value>)",
          border: "rgb(var(--brand-border) / <alpha-value>)",
        },
        state: {
          ok: "rgb(var(--state-ok) / <alpha-value>)",
          warn: "rgb(var(--state-warn) / <alpha-value>)",
          bad: "rgb(var(--state-bad) / <alpha-value>)",
        },
        whatsapp: "rgb(var(--whatsapp) / <alpha-value>)",
      },
      boxShadow: {
        soft: "0 10px 30px -15px rgb(2 6 23 / 0.25)",
      },
      borderRadius: {
        pill: "999px",
      },
    },
  },
  plugins: [],
};

export default config;

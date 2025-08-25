import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#164e63",
        card: {
          DEFAULT: "#ecfeff",
          foreground: "#475569"
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#164e63"
        },
        primary: {
          DEFAULT: "#164e63",
          foreground: "#ffffff"
        },
        secondary: {
          DEFAULT: "#8b5cf6",
          foreground: "#ffffff"
        },
        muted: {
          DEFAULT: "#f1f5f9",
          foreground: "#6b7280"
        },
        accent: {
          DEFAULT: "#8b5cf6",
          foreground: "#ffffff"
        },
        destructive: {
          DEFAULT: "#e53e3e",
          foreground: "#ffffff"
        },
        border: "#d1d5db",
        input: "#f9fafb",
        ring: "rgba(22, 78, 99, 0.5)",
        chart: {
          "1": "#a16207",
          "2": "#1f2937",
          "3": "#164e63",
          "4": "#8b5cf6",
          "5": "#ecfeff"
        }
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem"
      },
      fontFamily: {
        "work-sans": ["var(--font-work-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        "open-sans": ["var(--font-open-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;

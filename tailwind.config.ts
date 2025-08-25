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
        background: '#faf8f5',
        foreground: '#2d2d2d',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#2d2d2d'
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#2d2d2d'
        },
        primary: {
          DEFAULT: '#10b981',
          foreground: '#ffffff'
        },
        secondary: {
          DEFAULT: '#f5f5f0',
          foreground: '#2d2d2d'
        },
        muted: {
          DEFAULT: '#e8e6e1',
          foreground: '#6b7280'
        },
        accent: {
          DEFAULT: '#10b981',
          foreground: '#ffffff'
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff'
        },
        border: '#e5e7eb',
        input: '#f9fafb',
        ring: '#10b981',
        chart: {
          '1': '#10b981',
          '2': '#ef4444',
          '3': '#3b82f6',
          '4': '#8b5cf6',
          '5': '#f59e0b'
        }
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;

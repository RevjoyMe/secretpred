import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F1A',
        foreground: '#FFFFFF',
        card: '#0B0F1A',
        'card-foreground': '#FFFFFF',
        popover: '#0B0F1A',
        'popover-foreground': '#FFFFFF',
        primary: '#00F5FF',
        'primary-foreground': '#000000',
        secondary: '#8B949E',
        'secondary-foreground': '#FFFFFF',
        muted: '#1A1F2E',
        'muted-foreground': '#8B949E',
        accent: '#00F5FF',
        'accent-foreground': '#000000',
        destructive: '#FF4444',
        'destructive-foreground': '#FFFFFF',
        border: '#2A2F3E',
        input: '#1A1F2E',
        ring: '#00F5FF',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config

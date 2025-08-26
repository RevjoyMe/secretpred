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
        background: '#0f0f13',
        foreground: '#ffffff',
        card: '#1a1a1f',
        'card-foreground': '#ffffff',
        popover: '#1a1a1f',
        'popover-foreground': '#ffffff',
        primary: '#00d4aa',
        'primary-foreground': '#000000',
        secondary: '#8b5cf6',
        'secondary-foreground': '#ffffff',
        muted: '#2a2a2f',
        'muted-foreground': '#a1a1aa',
        accent: '#2a2a2f',
        'accent-foreground': '#ffffff',
        destructive: '#ef4444',
        'destructive-foreground': '#ffffff',
        border: '#2a2a2f',
        input: '#2a2a2f',
        ring: '#00d4aa',
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
        'fade-in': 'fadeIn 0.5s ease',
        'slide-up': 'slideUp 0.5s ease',
        'modal-slide-in': 'modalSlideIn 0.3s ease',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        modalSlideIn: {
          '0%': { opacity: '0', transform: 'translateY(-20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config

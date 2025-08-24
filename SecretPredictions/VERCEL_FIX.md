# 🔧 Исправление ошибки Vercel Build

## ❌ **Проблема:**
```
Syntax error: /vercel/path0/app/globals.css `@layer base` is used but no matching `@tailwind base` directive is present.
```

## ✅ **Решение:**

### 1. **Замени содержимое файла `src/app/globals.css` на:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }

  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

@layer components {
  .market-card {
    @apply bg-card text-card-foreground rounded-2xl border shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer overflow-hidden;
  }

  .bet-button-yes {
    @apply bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg;
  }

  .bet-button-no {
    @apply bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg;
  }

  .btn-primary {
    @apply bg-primary text-primary-foreground font-medium px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg;
  }

  .btn-secondary {
    @apply bg-secondary text-secondary-foreground font-medium px-6 py-3 rounded-xl transition-all duration-200;
  }

  .input-field {
    @apply bg-background border border-input rounded-xl px-4 py-3 focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 w-full;
  }

  .badge-active {
    @apply bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium;
  }

  .badge-closed {
    @apply bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-medium;
  }

  .stats-card {
    @apply bg-card text-card-foreground rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow duration-200;
  }

  .feature-card {
    @apply bg-card text-card-foreground rounded-2xl border p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center;
  }

  .nav-link {
    @apply text-muted-foreground hover:text-primary font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-accent;
  }

  .nav-link-active {
    @apply text-primary bg-accent font-semibold px-3 py-2 rounded-lg;
  }

  .spinner {
    @apply animate-spin rounded-full border-2 border-muted border-t-primary;
  }

  .container-grid {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }

  .gradient-bg {
    @apply bg-gradient-to-br from-primary via-primary to-primary/80;
  }

  .gradient-text {
    @apply bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.5s ease-out;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-scale-in {
    animation: scaleIn 0.3s ease-out;
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
}
```

### 2. **Убедись что в `tailwind.config.js` есть:**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### 3. **Перезапусти деплой в Vercel**

После этих изменений деплой должен пройти успешно! 🎯

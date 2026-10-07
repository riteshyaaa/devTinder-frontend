/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#050816',
          darker: '#03050B',
          surface: '#0B1020',
          card: '#111827',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-highlight': 'rgba(124, 58, 237, 0.3)',
          primary: '#7C3AED',
          primaryLight: '#8B5CF6',
          blue: '#2563EB',
          cyan: '#06B6D4',
          pink: '#EC4899',
        },
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(124, 58, 237, 0.3)',
        'glow-md': '0 0 25px -5px rgba(124, 58, 237, 0.45)',
        'glow-lg': '0 0 40px -8px rgba(124, 58, 237, 0.55)',
        'glow-cyan': '0 0 30px -6px rgba(6, 182, 212, 0.45)',
        'glow-pink': '0 0 30px -6px rgba(236, 72, 153, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(circle at 50% 20%, rgba(124, 58, 237, 0.15) 0%, rgba(6, 182, 212, 0.08) 35%, transparent 70%)',
        'card-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 100%)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      "dark",
      "light",
      "synthwave",
      "cyberpunk",
      "dracula",
      "forest",
      "aqua",
      "night",
      "retro",
      "valentine",
      "halloween",
      "garden",
      "lofi",
      "pastel",
      "wireframe",
      "luxury",
      "business",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
      "acid",
      "lemonade"
    ],
  },
}

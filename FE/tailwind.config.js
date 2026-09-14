/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#236640',
          80: '#1A4D30',
          50: '#91B2A0',
          25: 'rgba(35,102,64,0.25)',
          15: 'rgba(35,102,64,0.15)',
          8:  'rgba(35,102,64,0.08)',
          dark: '#0F2B1A',
        },
        accent: {
          DEFAULT: '#C8A951',
          20: 'rgba(200,169,81,0.20)',
          10: 'rgba(200,169,81,0.10)',
        },
        neutral: {
          DEFAULT: '#F5FAF6',
          card: '#F5FAF6',
        },
      },
      fontFamily: {
        display: ['"Pacifico"', 'cursive'],
        body: ['"Be Vietnam Pro"', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
      },
      animation: {
        'pulse-pin': 'pulse-pin 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
      },
      keyframes: {
        'pulse-pin': {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(200,169,81,0.5)' },
          '50%': { transform: 'scale(1.15)', boxShadow: '0 0 0 12px rgba(200,169,81,0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

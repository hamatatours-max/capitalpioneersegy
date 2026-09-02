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
          // Primary Brand Colors (Official Capital Pioneers Petrol Teal)
          primary: {
            DEFAULT: '#0B4D68',
            50: '#F1F7FA',
            100: '#E1EFF5',
            200: '#C5DFEB',
            300: '#9AC6DB',
            400: '#67A5C3',
            500: '#0B4D68', // Base logo color
            600: '#084057',
            700: '#063447',
            800: '#052938',
            900: '#031E2A',
            950: '#02121B',
          },
          // Architectural Midnight Dark Palette
          dark: {
            DEFAULT: '#061D28',
            surface: '#0A2533',
            elevated: '#0E3042',
            card: '#08212E',
            border: '#153648',
          },
          // Luxury Champagne Gold & Warm Bronze Accent
          gold: {
            DEFAULT: '#C5A880',
            light: '#E2D1B8',
            dark: '#A8895E',
            muted: '#D8C6AD',
            subtle: '#FAF7F2',
          },
          // Warm and Cool Neutrals
          slate: {
            50: '#FAFBFD',
            100: '#F3F5F8',
            200: '#E6E9EE',
            300: '#D2D7DF',
            400: '#9BA3AF',
            500: '#687282',
            600: '#4B5565',
            700: '#333D4B',
            800: '#1F2937',
            900: '#0F2432',
          },
        },
      },
      fontFamily: {
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        arabic: ['"IBM Plex Sans Arabic"', '"Noto Sans Arabic"', '"Cairo"', 'sans-serif'],
        cairo: ['"IBM Plex Sans Arabic"', '"Noto Sans Arabic"', '"Cairo"', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      borderRadius: {
        'card': '1.125rem', // 18px soft luxury card radius
        'button': '0.625rem', // 10px soft button radius
        'input': '0.625rem', // 10px soft input radius
        'modal': '1.25rem', // 20px soft modal radius
      },
      boxShadow: {
        'soft-sm': '0 2px 8px rgba(15, 36, 50, 0.04)',
        'soft': '0 10px 30px -5px rgba(15, 36, 50, 0.06), 0 4px 12px -2px rgba(15, 36, 50, 0.02)',
        'soft-lg': '0 20px 40px -10px rgba(15, 36, 50, 0.08), 0 8px 16px -4px rgba(15, 36, 50, 0.03)',
        'soft-dark': '0 20px 50px -10px rgba(0, 0, 0, 0.4), 0 0 1px 1px rgba(255, 255, 255, 0.06)',
        'gold-soft': '0 4px 20px rgba(197, 168, 128, 0.2)',
      },
      letterSpacing: {
        tightest: '-.04em',
        tighter: '-.025em',
        tight: '-.015em',
        normal: '0',
        wide: '.025em',
        wider: '.06em',
        widest: '.12em',
        eyebrow: '.15em',
      },
    },
  },
  plugins: [],
}

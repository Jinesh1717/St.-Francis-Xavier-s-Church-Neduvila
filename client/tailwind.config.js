/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFFFF',
          100: '#FFFDF8',
          200: '#FAF5EA',
          300: '#F3EBD8',
        },
        skyblue: {
          50: '#F4F9FE',
          100: '#DCEBFA',
          200: '#BEDDF7',
          300: '#94C6F2',
          600: '#2A72B5',
          800: '#1A4A77',
        },
        gold: {
          50: '#FDFBF4',
          100: '#FAF2D7',
          200: '#F3E3A6',
          400: '#DFB838',
          500: '#C9A227',
          600: '#A6831A',
          700: '#7F6413',
        },
        slate: {
          850: '#24282F',
          900: '#2B2F36',
          950: '#1D2025',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Malayalam', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        heading: ['Poppins', 'Noto Sans Malayalam', 'sans-serif'],
        malayalam: ['Noto Sans Malayalam', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(43, 47, 54, 0.06)',
        'soft-lg': '0 10px 30px -4px rgba(43, 47, 54, 0.08)',
      }
    },
  },
  plugins: [],
}


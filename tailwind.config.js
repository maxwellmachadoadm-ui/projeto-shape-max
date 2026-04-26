/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#05070d',
          900: '#0a0e1a',
          800: '#111827',
          700: '#1a2236',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(16, 185, 129, 0.35), 0 8px 30px -10px rgba(16, 185, 129, 0.45)',
        cardio: '0 0 0 1px rgba(56, 189, 248, 0.35), 0 8px 30px -10px rgba(56, 189, 248, 0.45)',
      },
    },
  },
  plugins: [],
}

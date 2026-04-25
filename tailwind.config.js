/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        orange: {
          primary: '#F5A623',
          dark: '#E8950F',
        },
        dark: {
          100: '#2a2a2a',
          200: '#242424',
          300: '#1e1e1e',
          400: '#1a1a1a',
        }
      }
    }
  },
  plugins: [],
}
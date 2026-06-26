/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Native Tailwind Class-Based System
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Keeping variables native for absolute component stability
        'saheli-dark': '#0B1120',      
        'saheli-surface': '#0f172a',   
        'saheli-border': '#1e293b',    
        'saheli-accent': '#e11d48',    
        'saheli-hover': '#be123c',     
        'saheli-text': '#cbd5e1',      
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      }
    },
  },
  plugins: [],
}
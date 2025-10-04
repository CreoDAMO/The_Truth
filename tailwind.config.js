
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./web/**/*.{html,js,jsx}",
    "./web/src/**/*.{js,jsx}",
    "./web/*.html"
  ],
  theme: {
    extend: {
      colors: {
        'truth-primary': '#8B5CF6',
        'truth-secondary': '#EC4899',
        'truth-dark': '#1E1B4B',
        'truth-light': '#F3F4F6',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Akkurat Pro', 'ui-sans-serif', 'system-ui'],
        serif: ['PT Serif', 'ui-serif', 'Georgia'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
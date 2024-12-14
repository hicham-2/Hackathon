/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html',
     './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],

}
module.exports = {
  theme: {
    extend: {
      colors: {
        'custom-blue': '#B0E1EA',
      },
    },
  },
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html',
     './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        'gradient': {
          to: { 'background-position': '200% center' },
        }
      } 
    },
  },
  plugins: [],

}

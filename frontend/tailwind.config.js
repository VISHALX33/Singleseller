/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fafa',
          100: '#e0f5f5',
          200: '#c2ebebd',
          300: '#a3e0e5',
          400: '#85d5dd',
          500: '#21808d', // Primary Teal
          600: '#1a6471',
          700: '#144855',
          800: '#0d2c39',
          900: '#07151d',
        },
        cream: '#fcfcf9',
        slate: '#134252',
        text: {
          primary: '#134252', // Slate
          secondary: '#666666',
          light: '#999999',
        },
        background: {
          light: '#fcfcf9', // Cream
          white: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

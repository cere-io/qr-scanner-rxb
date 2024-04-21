/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      xs: '320px',
      sm: '600px',
      md: '960px',
      lg: '1280px',
      xl: '1920px',
    },
    fontFamily: {
      sans: 'HumanSans, Inter, Roboto, Helvetica, Arial, sans-serif',
    },
    extend: {},
  },
  plugins: [],
};

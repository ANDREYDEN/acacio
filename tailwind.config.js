module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'body': ['Manrope', 'sans-serif'],
        'header': ['Gilroy', 'sans-serif']
      },
      backgroundImage: {
        'login': "url('/img/login.svg')",
      },
      colors: {
        'black': '#000121',
        'primary-text': '#313131',
        'primary-blue': '#010446',
        'dark-grey': '#656565',
        'grey': '#B2B2B2',
        'light-grey': '#E2E2E2',
        'error': '#C60000',
      }
    },
  },
  plugins: [],
}

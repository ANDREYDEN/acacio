module.exports = {
  purge: [
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
        'blue': '#649CD3',
        'light-blue': '#D7EBFF',
        'yellow': '#FFDE64',
        'light-yellow': '#FFF4CA',
        'green': '#A8D04B',
        'light-green': '#ECF9CE',
      }
    },
  },
  plugins: [],
}

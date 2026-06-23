module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        surface: '#1E1E1E',
        'surface-container': '#282828',
        primary: '#A8C7FA',
        'primary-fg': '#062E6F',
        'primary-container': '#004A77',
        secondary: '#7DDA9A',
        'secondary-fg': '#00391C',
        'secondary-container': '#005234',
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

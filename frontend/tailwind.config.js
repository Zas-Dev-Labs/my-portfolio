module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        surface: '#1E1E1E',
        'surface-container': '#282828',
        primary: '#00BFFF',
        'primary-fg': '#001A33',
        'primary-container': '#003A5C',
        secondary: '#32CD32',
        'secondary-fg': '#0D2E0D',
        'secondary-container': '#0A3D0A',
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

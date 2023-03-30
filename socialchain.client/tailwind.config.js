/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBlack: "#1C1E21",
        darkBlue:"#1E2B3D",
        darkBlueHalfTrans:"#1E2B3D80",
        primaryPinkColor: "#F213A4",
        primaryPinkColorTrans: "#f213a499",
        secondaryGold: "#BC9F4F",
        grayTextColor:"#b5b3b3c3"
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
};

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
      fontFamily: {
        poppins: ["Poppins"],
        "Arimo-navbar-font": ["Arimo"]
      },
      colors: {
        darkBlack: "#1C1E21",
        darkBlue: "#1E2B3D",
        darkBlueHalfTrans: "rgb(29, 35, 44)",
        primaryGoldColor: "#e0a500",
        primaryGoldColorTrans: "#343434",
        secondaryGold: "#BC9F4F",
        grayTextColor: "#b5b3b3c3",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};

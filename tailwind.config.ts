module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./app/**/*.{ts,tsx,js,jsx}",
    "./src/**/*.{ts,tsx,js,jsx}",
    "./sanity/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        plumPrimaryPurple: "#2c388b",
        plumSecondaryPurple: "#dd928c",
        plumPrimaryBlue: "#789cd1",
        plumSecondaryBlue: "#709cea",
        plumAboutUsBlue: "#0b2654",
        plumPrimaryOrange: "#FF9901",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./app/**/*.{ts,tsx,js,jsx}",
    "./src/**/*.{ts,tsx,js,jsx}",
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
        plumPrimaryPink: "#2c388b",
        plumSecondaryPink: "#dd928c",
        plumPrimaryBlue: "#789cd1",
        plumSecondaryBlue: "#709cea",
        plumAboutUsBlue: "#0b2654",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

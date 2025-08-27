/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        glccBlue: "#003366",
        glccGold: "#D4AF37",
      },
    },
  },
  plugins: [],
};

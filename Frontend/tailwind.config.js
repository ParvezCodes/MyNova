/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      height: {
        "80vh": "80vh",
        "94vh": "94vh",
        "92vh": "92vh",
      },
    },
  },
  plugins: [],
};

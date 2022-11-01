/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brandgray: {
          100: "#828282",
          200: "#3C393F",
          300: "#252329",
          400: "#120F13",
          500: "#0B090C",
        },
        brandblue: "#2F80ED",
        brandwhite: "#E0E0E0",
      },
    },
  },
  plugins: [],
};

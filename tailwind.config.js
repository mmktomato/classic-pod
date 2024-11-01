/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        88: "22rem",
        136: "34rem",
        "45p": "45%",
      },
    },
  },
  plugins: [],
};

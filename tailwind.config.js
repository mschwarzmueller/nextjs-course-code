/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'oswald': ['"Oswald"', "sans-serif"]
      }
    },
    backgroundColor: {
      primary: "#222b64",
      gray: "#1f2937",
      lightGray: "#d1d5db",
      slate: "#cbd5e1"
    }
  },
  plugins: [],
}

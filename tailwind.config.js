/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        moss: "#2E4036",
        clay: "#CC5833",
        cream: "#F2F0E9",
        charcoal: "#1A1A1A",
      },
      boxShadow: {
        soft: "0 20px 60px rgba(26, 26, 26, 0.16)",
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', '"Outfit"', "sans-serif"],
        drama: ['"Cormorant Garamond"', "serif"],
        data: ['"IBM Plex Mono"', "monospace"],
      },
    },
  },
  plugins: [],
}

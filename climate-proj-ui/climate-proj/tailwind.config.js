/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Make sure this path includes your components
  ],
  theme: {
    extend: {
      colors: {
        background: '#f0f0f0', // Customize colors here
        primary: '#ff6347',    // Example primary color
        accent: '#00f7ff',     // Example accent color
      },
    },
  },
  plugins: [],
}

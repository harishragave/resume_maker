/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': {
          800: '#1a2744',
          900: '#111827',
        },
      },
    },
  },
  plugins: [],
}


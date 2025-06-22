/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '0%': { maskPosition: '150% 0%' },
          '100%': { maskPosition: '-50% 0%' },
        },
      },
      animation: {
        "spin-slow": "spin 10s linear infinite",
        
      },
  
    },
  },
  plugins: [],
};

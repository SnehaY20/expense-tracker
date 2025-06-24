/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        subtleShimmer: "subtleGlassShimmer 10s ease-in-out infinite alternate",
        gentleWaterMovement: "gentleWaterMovement 15s ease-in-out infinite",
      },
      keyframes: {
        subtleGlassShimmer: {
          "0%": { transform: "translateX(-1px)", opacity: "0.8" },
          "100%": { transform: "translateX(1px)", opacity: "1" },
        },
        gentleWaterMovement: {
          "0%, 100%": { transform: "scale(1) rotate(0deg)" },
          "50%": { transform: "scale(1.01) rotate(0.3deg)" },
        },
      },
    },
  },
  plugins: [],
};

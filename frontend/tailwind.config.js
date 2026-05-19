/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 18px 50px -30px rgb(15 23 42 / 0.45)"
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)"
          }
        }
      },
      animation: {
        shimmer: "shimmer 1.4s infinite"
      }
    }
  },
  plugins: []
};

import type { Config } from "tailwindcss"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      background: "#050505",
      surface: "#0a0a0a",
      "surface-light": "#1a1a1a",
      text: {
        primary: "#F5F5F5",
        secondary: "#8A8A8A",
      },
      accent: "#00E5FF",
      white: "#ffffff",
      red: {
        500: "#ef4444",
      },
      transparent: "transparent",
    },
    fontFamily: {
      grotesk: ["Space Grotesk", "sans-serif"],
      inter: ["Inter", "sans-serif"],
    },
    extend: {},
  },
  plugins: [],
} satisfies Config

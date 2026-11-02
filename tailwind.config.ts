import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.ts"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1200px" } },
    extend: {
      colors: {
        // Contrast-checked tokens: see tests/unit/contrast.test.ts
        coal: { DEFAULT: "#16181d", 800: "#1f232a", 700: "#2a2f38" },
        brand: { DEFAULT: "#c4161c", dark: "#9e1015", light: "#fdecec" },
        amber: { DEFAULT: "#ffc20e", dark: "#e5a900" },
        paper: "#f4f4f2",
        muted: "#4a4f57",
        line: "#dcdcd8",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Arial", "sans-serif"],
        display: ['"Barlow Condensed"', "Impact", "Arial Narrow", "sans-serif"],
      },
      maxWidth: { prose: "68ch" },
    },
  },
  plugins: [],
} satisfies Config;

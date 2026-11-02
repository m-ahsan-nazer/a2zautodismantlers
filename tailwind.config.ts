import type { Config } from "tailwindcss";

/**
 * Colours copied from the WordPress (GeneratePress) global palette.
 * Text pairings are contrast-checked in tests/unit/contrast.test.ts.
 */
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.ts"],
  theme: {
    container: { center: true, padding: "1.25rem", screens: { "2xl": "1200px" } },
    extend: {
      colors: {
        navy: "#002448", // --contrast
        body: "#666666", // --contrast-2
        accent: { DEFAULT: "#2a77ca", dark: "#286db6", deep: "#1f5a99" }, // --accent, --accent-2
        orange: { DEFAULT: "#cb4a1f", dark: "#a93c17" }, // --accent-3
        sky: "#edf5ff", // --base
        submit: { DEFAULT: "#0a74bf", dark: "#085d99" },
        line: "#d6dde6",
        field: "#f7f7f7",
      },
      fontFamily: {
        sans: ["Nunito", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Arial", "sans-serif"],
        heading: ["Poppins", "system-ui", "-apple-system", "Segoe UI", "Arial", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 30px rgba(0, 36, 72, 0.08)",
        soft: "0 4px 20px rgba(0, 36, 72, 0.06)",
      },
      maxWidth: { prose: "70ch" },
    },
  },
  plugins: [],
} satisfies Config;

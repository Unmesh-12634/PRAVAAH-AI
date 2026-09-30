/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gov: {
          navy: "#0A2540",
          blue: "#0B5CAD",
          darkBlue: "#071A2B",
          accent: "#1976D2",
          light: "#EFF6FF",
          slate: "#0F172A",
          border: "#E2E8F0",
          subtle: "#F8FAFC",
          surface: "#FFFFFF",
          muted: "#64748B",
        },
      },
      fontFamily: {
        manrope: ["var(--font-manrope)", "Manrope", "sans-serif"],
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

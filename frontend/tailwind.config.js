/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-main)",
        surface: {
          DEFAULT: "var(--bg-surface)",
          elevated: "var(--bg-surface-elevated)",
          hover: "var(--bg-surface-hover)",
          border: "var(--border-color)",
        },
        accent: {
          DEFAULT: "var(--accent-color)",
          subtle: "var(--accent-subtle)",
          hover: "var(--accent-hover)",
        },
        success: {
          DEFAULT: "#10b981",
          subtle: "rgba(16, 185, 129, 0.12)",
        },
        warning: {
          DEFAULT: "#f59e0b",
          subtle: "rgba(245, 158, 11, 0.12)",
        },
        danger: {
          DEFAULT: "#f43f5e",
          subtle: "rgba(244, 63, 94, 0.12)",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}

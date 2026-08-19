import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#16a34a",
          greenDark: "#0f7a37",
          greenLight: "#e8f8ee",
          purple: "#8b5cf6",
          purpleLight: "#f1ebfd",
          blue: "#3b82f6",
          blueLight: "#eaf1ff",
          orange: "#f97316",
          orangeLight: "#fff1e8",
          pink: "#ec4899",
          yellow: "#f5b301",
          teal: "#14b8a6",
          ink: "#1f2937",
          muted: "#6b7280",
          line: "#e5e7eb",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(16,24,40,0.06), 0 1px 2px rgba(16,24,40,0.04)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
};

export default config;

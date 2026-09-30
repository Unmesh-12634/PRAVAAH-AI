/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        command: {
          900: '#060a11',
          800: '#0c1322',
          700: '#141e34',
          600: '#1e2c49',
          border: '#1f2e4d',
        },
        tactical: {
          cyan: '#00f0ff',
          teal: '#0df2c9',
          amber: '#ffb300',
          orange: '#ff6b00',
          red: '#ff2d55',
          blue: '#1976d2',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'SF Mono', 'Roboto Mono', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 15px rgba(0, 240, 255, 0.35)',
        'glow-red': '0 0 20px rgba(255, 45, 85, 0.45)',
        'glow-amber': '0 0 15px rgba(255, 179, 0, 0.4)',
        'hud': '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}

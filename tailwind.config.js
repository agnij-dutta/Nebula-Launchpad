/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0B1120',
          800: '#141B2D',
          700: '#1A2236',
          600: '#252D42',
        },
        purple: {
          300: '#B794F4',
          400: '#9F7AEA',
          500: '#805AD5',
          600: '#6B46C1',
        },
        whiteAlpha: {
          50: 'rgba(255, 255, 255, 0.04)',
          100: 'rgba(255, 255, 255, 0.06)',
          200: 'rgba(255, 255, 255, 0.08)',
          300: 'rgba(255, 255, 255, 0.16)',
          400: 'rgba(255, 255, 255, 0.24)',
          500: 'rgba(255, 255, 255, 0.36)',
          600: 'rgba(255, 255, 255, 0.48)',
          700: 'rgba(255, 255, 255, 0.64)',
          800: 'rgba(255, 255, 255, 0.80)',
          900: 'rgba(255, 255, 255, 0.92)',
        },
        background: '#111827',
        glass: 'rgba(255, 255, 255, 0.05)',
        primary: {
          purple: '#8B5CF6',
          blue: '#3B82F6'
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#9CA3AF'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'system-ui'],
      },
      backdropBlur: {
        'glass': '10px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}

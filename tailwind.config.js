/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Times New Roman"', 'Times', 'Georgia', 'serif'],
      },
      colors: {
        navy: {
          950: '#050B18',
          900: '#0A1428',
          800: '#0F1D3A',
          700: '#16294D',
          600: '#1E3660',
          500: '#2C4A7C',
        },
        accent: {
          DEFAULT: '#3E6BB0',
          light: '#6E93C9',
          dim: '#274874',
        },
        mist: {
          50: '#F7F9FC',
          100: '#EDF1F7',
          200: '#DCE3EE',
          300: '#B9C5D6',
        },
        status: {
          pending: '#8A93A6',
          progress: '#3E6BB0',
          done: '#3F8461',
          late: '#B54646',
          warn: '#C08A2E',
        },
      },
      borderRadius: {
        xl: '0.875rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(10, 20, 40, 0.06), 0 4px 16px rgba(10, 20, 40, 0.06)',
        card: '0 1px 3px rgba(10, 20, 40, 0.08), 0 8px 24px rgba(10, 20, 40, 0.06)',
      },
    },
  },
  plugins: [],
}

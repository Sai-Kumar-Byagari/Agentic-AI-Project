/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5A4270',
        'primary-dark': '#4A3560',
        deep: '#33253C',
        'text-primary': '#241E29',
        'text-secondary': '#6B6473',
        'text-tertiary': '#8B8391',
        success: '#3F7A52',
        warning: '#9A6C14',
        danger: '#A9503C',
      },
      fontFamily: {
        sans: ['Public Sans', 'system-ui', 'sans-serif'],
        serif: ['Spectral', 'Georgia', 'serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

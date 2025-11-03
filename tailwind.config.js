const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        surface: '#151520',
        'surface-light': '#1f1f2e',
        primary: '#8b5cf6',
        'primary-light': '#a78bfa',
        accent: '#06b6d4',
        'accent-light': '#22d3ee',
        success: '#10b981',
        warning: '#f59e0b',
        muted: '#6b7280',
        'text-primary': '#f9fafb',
        'text-secondary': '#d1d5db',
        'text-muted': '#9ca3af',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    }
  },
  plugins: [],
};

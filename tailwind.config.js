/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          main: '#4F46E5',
          light: '#6366F1',
          dark: '#4338CA',
          hover: '#4338CA',
          bg: '#EEF2FF',
        },
        'secondary': {
          main: '#3B82F6',
          light: '#60A5FA',
          dark: '#2563EB',
          hover: '#1D4ED8',
          bg: '#EFF6FF',
        },
        'success': {
          main: '#10B981',
          light: '#34D399',
          bg: '#ECFDF5',
          hover: '#059669',
        },
        'warning': {
          main: '#F59E0B',
          light: '#FBBF24',
          bg: '#FFFBEB',
          hover: '#D97706',
        },
        'error': {
          main: '#EF4444',
          light: '#F87171',
          bg: '#FEF2F2',
          hover: '#DC2626',
        },
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'scale': 'scale 0.15s ease-in-out',
        'blob': "blob 7s infinite",
        'shine': 'shine 1.5s linear infinite',
      },
      keyframes: {
        scale: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
        },
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}

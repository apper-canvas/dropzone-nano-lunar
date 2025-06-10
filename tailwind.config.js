/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',
        secondary: '#8B5CF6',
        accent: '#10B981',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      animation: {
        'gradient': 'gradient 3s ease-in-out infinite',
        'pulse-border': 'pulse-border 2s ease-in-out infinite',
        'draw-check': 'draw-check 0.5s ease-out'
      },
      keyframes: {
        gradient: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' }
        },
        'pulse-border': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.01)', opacity: '0.8' }
        },
        'draw-check': {
          '0%': { 'stroke-dasharray': '0 50', 'stroke-dashoffset': '0' },
          '100%': { 'stroke-dasharray': '50 50', 'stroke-dashoffset': '0' }
        }
      }
    },
  },
  plugins: [],
}
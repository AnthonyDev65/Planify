/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background colors - using CSS variables
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'bg-card': 'var(--bg-card)',
        'bg-hover': 'var(--bg-hover)',
        // Accent colors
        'accent-primary': '#8b5cf6',
        'accent-secondary': '#6366f1',
        'accent-tertiary': '#3b82f6',
        // Status colors
        'success': '#22c55e',
        'warning': '#eab308',
        'danger': '#ef4444',
        // Text colors - using CSS variables
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        'app': '28rem',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'card-md': '0 4px 16px rgba(0, 0, 0, 0.4)',
        'card-lg': '0 8px 32px rgba(0, 0, 0, 0.5)',
        'glow': '0 0 40px rgba(139, 92, 246, 0.2)',
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(to right, #8b5cf6, #6366f1)',
        'card-gradient': 'linear-gradient(to bottom right, #16161f, #1a1a24)',
      },
      borderRadius: {
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

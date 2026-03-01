/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0f1117',
          card: '#161b27',
          elevated: '#1e2535',
          border: '#2a3347',
        },
        text: {
          primary: '#e8eaf0',
          secondary: '#8b95a8',
          muted: '#535e72',
        },
        accent: {
          blue: '#4a9eff',
          blueHover: '#6fb3ff',
        },
        status: {
          verified: '#22c55e',
          unverified: '#f59e0b',
          contested: '#ef4444',
          discrepancy: '#a855f7',
        },
        category: {
          principal: '#ef4444',
          innerCircle: '#f97316',
          political: '#3b82f6',
          financial: '#10b981',
          legal: '#8b5cf6',
          intelligence: '#6366f1',
          academic: '#06b6d4',
          media: '#ec4899',
          victim: '#94a3b8',
          lawEnforcement: '#64748b',
          other: '#475569',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      keyframes: {
        'disclosure-in': {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'disclosure-in': 'disclosure-in 200ms ease-out',
      },
    },
  },
  plugins: [],
};

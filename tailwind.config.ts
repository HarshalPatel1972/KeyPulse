import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base:     'var(--bg-base)',
        surface:  'var(--bg-surface)',
        elevated: 'var(--bg-elevated)',
        primary:  'var(--text-primary)',
        muted:    'var(--text-muted)',
        hint:     'var(--text-hint)',
        accent:   'var(--accent)',
        valid:    'var(--valid)',
        invalid:  'var(--invalid)',
        quota:    'var(--quota)',
      },
      fontFamily: {
        heading: ['var(--font-cirka)'],
        sans: ['var(--font-season)'],
      },
      borderColor: {
        DEFAULT: 'var(--border)',
        hover:   'var(--border-hover)',
      },
    },
  },
}
export default config

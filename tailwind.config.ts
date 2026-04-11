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
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      borderColor: {
        DEFAULT: 'var(--border)',
        hover:   'var(--border-hover)',
      },
    },
  },
}
export default config

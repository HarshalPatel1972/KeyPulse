'use client'
import { useEffect, useState } from 'react'

const THEMES = [
  { id: 'theme-aurora', label: 'Aurora', dot: '#7c3aed' },
  { id: 'theme-void',   label: 'Void',   dot: '#0ea5e9' },
  { id: 'theme-dusk',   label: 'Dusk',   dot: '#f97316' },
] as const

type ThemeId = (typeof THEMES)[number]['id']

export default function ThemeSwitcher() {
  const [active, setActive] = useState<ThemeId>('theme-aurora')

  useEffect(() => {
    const saved = localStorage.getItem('keypulse-theme') as ThemeId | null
    if (saved) apply(saved)
  }, [])

  function apply(id: ThemeId) {
    const html = document.documentElement
    THEMES.forEach((t) => html.classList.remove(t.id))
    if (id !== 'theme-aurora') html.classList.add(id)
    localStorage.setItem('keypulse-theme', id)
    setActive(id)
  }

  return (
    <div className="flex items-center gap-1.5">
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => apply(t.id)}
          title={t.label}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all"
          style={{
            background: active === t.id ? 'var(--bg-elevated)' : 'transparent',
            border: `1px solid ${active === t.id ? 'var(--border-hover)' : 'var(--border)'}`,
            color: active === t.id ? 'var(--text-primary)' : 'var(--text-hint)',
          }}
        >
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: t.dot }}
          />
          {t.label}
        </button>
      ))}
    </div>
  )
}

'use client'
import { useEffect, useState } from 'react'

const THEMES = [
  { id: 'theme-aurora', label: 'Aurora', color: '#7c3aed' },
  { id: 'theme-void',   label: 'Void',   color: '#0ea5e9' },
  { id: 'theme-dusk',   label: 'Dusk',   color: '#f97316' },
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
    <div 
      className="p-1 rounded-full flex items-center relative gap-1"
      style={{ 
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(8px)'
      }}
    >
      {/* Sliding Highlight */}
      <div 
        className="absolute top-1 bottom-1 rounded-full transition-all duration-300 ease-out z-0 shadow-lg"
        style={{
          width: 'calc(33.333% - 6px)',
          left: active === 'theme-aurora' ? '4px' : active === 'theme-void' ? '33.333%' : '66.666%',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      />

      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => apply(t.id)}
          className="relative z-10 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
          style={{
            color: active === t.id ? 'var(--text-primary)' : 'var(--text-hint)',
          }}
        >
          <span 
            className="w-1 h-1 rounded-full transition-all" 
            style={{ 
              background: t.color,
              boxShadow: active === t.id ? `0 0 8px ${t.color}` : 'none',
              transform: active === t.id ? 'scale(1.2)' : 'scale(1)'
            }} 
          />
          {t.label}
        </button>
      ))}
    </div>
  )
}

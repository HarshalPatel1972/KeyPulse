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
      className="p-1 rounded-full flex items-center relative gap-0.5 bg-[#050505]/60 border border-[var(--border)] backdrop-blur-2xl shadow-2xl"
    >
      {/* Liquid Ambient Highlight */}
      <div 
        className="absolute top-1 bottom-1 rounded-full transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) z-0"
        style={{
          width: 'calc(33.333% - 4px)',
          left: active === 'theme-aurora' ? '4px' : active === 'theme-void' ? '33.333%' : '66.666%',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border)',
          boxShadow: `inset 0 1px 1px rgba(255,255,255,0.1), 0 0 20px ${THEMES.find(t => t.id === active)?.color}15`,
        }}
      />

      {/* Decorative Glow Layer (Ambient Atmosphere) */}
      <div 
        className="absolute inset-0 rounded-full opacity-20 blur-xl transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${active === 'theme-aurora' ? '20%' : active === 'theme-void' ? '50%' : '80%'} 50%, ${THEMES.find(t => t.id === active)?.color} 0%, transparent 60%)`,
        }}
      />

      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => apply(t.id)}
          className="group relative z-10 px-5 py-2 rounded-full text-[10px] font-bold tracking-[0.18em] uppercase transition-all duration-500 flex items-center gap-2.5"
          style={{
            color: active === t.id ? 'var(--text-primary)' : 'var(--text-hint)',
            textShadow: active === t.id ? `0 0 10px ${t.color}40` : 'none',
          }}
        >
          <div className="relative flex items-center justify-center">
             {/* The Jewel-Dot */}
             <span 
               className="block w-1.5 h-1.5 rounded-full transition-all duration-700" 
               style={{ 
                 background: active === t.id ? t.color : 'rgba(255,255,255,0.1)',
                 boxShadow: active === t.id ? `0 0 12px ${t.color}, inset 0 0 2px white` : 'none',
                 transform: active === t.id ? 'scale(1.1)' : 'scale(1)',
               }} 
             />
             
             {/* Subtle Inner Halo */}
             {active === t.id && (
               <span 
                 className="absolute inset-[-4px] rounded-full border border-white/5 animate-pulse" 
                 style={{ borderColor: `${t.color}20` }}
               />
             )}
          </div>
          
          <span className="relative z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-300 font-medium">
            {t.label}
          </span>
        </button>
      ))}
    </div>
  )
}

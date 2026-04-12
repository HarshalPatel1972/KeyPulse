import { useState, useRef, useEffect } from 'react'
import { PROVIDERS } from '@/lib/providers'
import { Provider } from '@/lib/types'

interface Props {
  value: Provider | null
  onChange: (provider: Provider) => void
}

export default function ManualSelect({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <div className="mt-4 animate-fade-in" ref={containerRef}>
      <p 
        className="font-sans text-[10px] uppercase tracking-[0.15em] font-bold mb-2 ml-1 opacity-60"
        style={{ color: 'var(--text-muted)' }}
      >
        Provider not detected — select manually:
      </p>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm 
            transition-all duration-300 backdrop-blur-xl bg-white/[0.03] border 
            ${isOpen ? 'border-accent/40 ring-2 ring-accent/20' : 'border-[var(--border)] hover:bg-white/[0.05] hover:border-[var(--border-hover)]'}
          `}
          style={{ color: value ? 'var(--text-primary)' : 'var(--text-hint)' }}
        >
          <div className="flex items-center gap-3">
            {value && (
              <img 
                src={`https://www.google.com/s2/favicons?domain=${value.domain}&sz=64`} 
                alt="" 
                className="w-4 h-4 rounded-sm"
              />
            )}
            <span className="font-sans tracking-wide">
              {value ? value.name : 'Pick one'}
            </span>
          </div>
          
          <svg 
            width="12" height="12" viewBox="0 0 12 12" fill="none" 
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          >
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40" />
          </svg>
        </button>

        {/* Custom Dropdown Grid - High Contrast Adaptive Grid / Mobile Bottom Sheet */}
        {isOpen && (
          <>
            {/* Backdrop for Mobile */}
            <div 
              className="fixed inset-0 z-[99998] bg-black/60 backdrop-blur-sm xl:hidden animate-fade-in"
              onClick={() => setIsOpen(false)}
            />
            
            <div className={`
              fixed left-0 bottom-0 w-full z-[99999] bg-[#161426] border-t border-white/20 shadow-[0_-25px_60px_-15px_rgba(0,0,0,0.7)]
              transition-all duration-300 ease-out animate-slide-up-drawer
              rounded-t-[32px] px-4 pb-12 pt-2
              xl:absolute xl:bottom-auto xl:top-full xl:left-0 xl:w-[120%] xl:sm:-left-[10%] xl:mt-2 xl:rounded-2xl xl:p-2 xl:border xl:pb-2 xl:animate-dropdown-open
            `}>
              {/* Drag Handle - Mobile Only */}
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto my-3 xl:hidden" />
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 overflow-y-auto max-h-[60vh] xl:max-h-[400px] custom-scrollbar">
                {PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onChange(p)
                      setIsOpen(false)
                    }}
                    className={`
                      flex items-center gap-2.5 px-3 py-3 rounded-2xl transition-all duration-300
                      hover:bg-white/[0.07] group border active-scale
                      ${value?.id === p.id 
                        ? 'bg-accent/15 border-accent/60 shadow-[0_0_20px_rgba(var(--accent-rgb),0.15)]' 
                        : 'border-white/5 hover:border-white/20'
                      }
                    `}
                  >
                    <div className={`
                      w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-500
                      ${value?.id === p.id ? 'bg-accent/20 scale-110 shadow-[0_0_15px_rgba(124,58,237,0.3)]' : 'bg-white/5'}
                      group-hover:bg-accent/20 group-hover:scale-105
                    `}>
                      <span className="text-sm scale-110 group-hover:animate-pulse-heartbeat">{p.icon}</span>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className={`text-[10px] font-bold tracking-[0.05em] uppercase transition-colors duration-300 ${value?.id === p.id ? 'text-accent' : 'text-white'}`}>
                        {p.name}
                      </span>
                      <span className="text-[8px] uppercase tracking-[0.05em] opacity-40 font-mono">
                        {p.model.split('/')[1] || p.model}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

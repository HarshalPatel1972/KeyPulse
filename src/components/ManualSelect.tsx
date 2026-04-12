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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="mt-4" ref={containerRef}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full flex items-center justify-between rounded-2xl px-5 py-4 text-sm 
            transition-all duration-300 bg-white/5 border border-white/10
            ${isOpen ? 'border-accent ring-2 ring-accent/10' : 'hover:border-white/20'}
          `}
          style={{ color: 'var(--text-primary)' }}
        >
          <div className="flex items-center gap-3">
            {value && (
              <img src={`https://www.google.com/s2/favicons?domain=${value.domain}&sz=64`} alt="" className="w-5 h-5 rounded-sm" />
            )}
            <span className="font-heading tracking-wide text-[16px]">
              {value ? value.name : 'Pick a provider'}
            </span>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 w-full z-[99999] mt-2 bg-[#DC9B9B] border border-white/10 shadow-2xl rounded-3xl p-3 xl:w-[120%] xl:-left-[10%]">
            <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[280px] p-1 pb-4">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { onChange(p); setIsOpen(false); }}
                  className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-all border ${value?.id === p.id ? 'bg-white/10 border-white/20' : 'bg-white/5 border-transparent hover:border-white/10'}`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center p-1.5 overflow-hidden">
                    <img src={p.icon} alt="" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F6F4E8]">
                    {p.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

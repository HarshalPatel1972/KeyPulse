import { PROVIDERS } from '@/lib/providers'
import { Provider } from '@/lib/types'

interface Props {
  value: Provider | null
  onChange: (provider: Provider) => void
}

export default function ManualSelect({ value, onChange }: Props) {
  return (
    <div className="mt-4 animate-fade-in">
      <p 
        className="font-sans text-[10px] uppercase tracking-[0.15em] font-bold mb-2 ml-1 opacity-60"
        style={{ color: 'var(--text-muted)' }}
      >
        Provider not detected — select manually:
      </p>
      
      <div className="relative group">
        <select
          className="w-full appearance-none rounded-2xl px-4 py-3.5 text-sm transition-all duration-300 backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] group-hover:bg-white/[0.05] group-hover:border-white/[0.15] focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 cursor-pointer"
          style={{ color: 'var(--text-primary)' }}
          value={value?.id ?? ''}
          onChange={(e) => {
            const p = PROVIDERS.find((p) => p.id === e.target.value)
            if (p) onChange(p)
          }}
        >
          <option value="" className="bg-[#0f0d1a]">Select a provider...</option>
          {PROVIDERS.map((p) => (
            <option key={p.id} value={p.id} className="bg-[#0f0d1a]">
              {p.name}
            </option>
          ))}
        </select>
        
        {/* Custom Chevron */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-hover:translate-y-[-40%]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 group-hover:opacity-80" />
          </svg>
        </div>
      </div>
    </div>
  )
}

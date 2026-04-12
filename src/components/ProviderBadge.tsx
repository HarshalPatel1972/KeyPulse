import { useState } from 'react'
import { Provider } from '@/lib/types'

interface Props {
  provider: Provider
}

export default function ProviderBadge({ provider }: Props) {
  const [imgError, setImgError] = useState(false)

  return (
    <div
      className="flex items-center gap-3 animate-fade-in group/badge px-2 py-1 rounded-full bg-lavender/[0.02] dark:bg-lavender/70 border border-lavender/[0.05] backdrop-blur-sm"
      style={{ '--provider-color': provider.color } as React.CSSProperties}
    >
      <div className="relative">
        {!imgError ? (
          <img
            src={`https://unavatar.io/${provider.domain}`}
            alt={provider.name}
            className="w-4 h-4 rounded-full shadow-[0_0_10px_var(--provider-color)] transition-transform duration-500 group-hover/badge:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          <span
            className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
            style={{ backgroundColor: provider.color, boxShadow: `0 0 10px ${provider.color}` }}
          />
        )}
      </div>
      
      <span className="text-[11px] font-bold tracking-tight text-primary opacity-80 group-hover/badge:opacity-100 transition-opacity">
        {provider.name}
      </span>

      <div className="relative flex items-center gap-2 px-2.5 py-1 rounded-full border border-lavender/[0.1] bg-lavender/[0.03] dark:bg-lavender/80 overflow-hidden group/pill">
        {/* Shimmer Sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-lavender/[0.05] to-transparent -translate-x-full animate-shimmer-button pointer-events-none" />
        
        {/* Live Pulse Dot */}
        <div className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40" style={{ backgroundColor: provider.color }}></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: provider.color, boxShadow: `0 0 8px ${provider.color}` }}></span>
        </div>
        
        <span 
          className="text-[9px] font-black uppercase tracking-[0.15em] relative z-10"
          style={{ 
            color: 'var(--text-primary)',
            filter: `drop-shadow(0 0 3px ${provider.color}40)` 
          }}
        >
          detected
        </span>
      </div>
    </div>
  )
}

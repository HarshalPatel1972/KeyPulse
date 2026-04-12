import React from 'react'

export default function TrustStrip() {
  const signals = [
    { label: 'Client-side only', desc: 'Verified in browser', color: '#C0E1D2' },
    { label: 'Zero logging', desc: 'Nothing stored', color: '#F6F4E8' },
    { label: 'Open source', desc: 'Verified on GitHub', color: '#E5EEE4' }
  ]

  return (
    <div className="flex flex-col md:flex-row items-stretch justify-center gap-3">
      {signals.map((s, i) => (
        <div 
          key={s.label} 
          className="flex-1 flex items-center gap-4 bg-surface/40 border border-primary rounded-[24px] p-5 transition-all hover:bg-surface/60 group shadow-sm"
        >
          <div className="w-2.5 h-2.5 rounded-full animate-pulse shadow-sm" style={{ backgroundColor: s.color }} />
          <div className="flex flex-col">
            <span className="text-primary font-heading font-bold text-[13px] uppercase tracking-wide">{s.label}</span>
            <span className="text-primary/40 font-sans text-[11px] font-medium leading-tight">{s.desc}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

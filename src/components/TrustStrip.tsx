import React from 'react'

export default function TrustStrip() {
  const signals = [
    { label: 'Client-Side', desc: 'Browser Verification', color: '#FAFAFA' },
    { label: 'Zero Logging', desc: 'No Memory Retained', color: '#D4D4D8' },
    { label: 'Open Source', desc: 'Fully Auditable', color: '#A1A1AA' }
  ]

  return (
    <div className="flex flex-col md:flex-row items-stretch justify-center gap-3">
      {signals.map((s, i) => (
        <div 
          key={s.label} 
          className="flex-1 flex items-center gap-3 bg-accent/[0.03] rounded-lg p-4 transition-all hover:bg-accent/[0.08] hover:shadow-[0_0_15px_rgba(212,175,55,0.05)] group border border-accent/10 hover:border-accent/30"
        >
          <div className="w-5 h-5 flex items-center justify-center transition-transform group-hover:scale-110 duration-500 opacity-80" style={{ color: s.color }}>
            {i === 0 && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
            {i === 1 && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
            {i === 2 && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>}
          </div>
          <div className="flex flex-col">
            <span className="text-primary font-sans font-semibold text-[12px] uppercase tracking-wider leading-none mb-1">{s.label}</span>
            <span className="text-primary/40 font-sans text-[10px] leading-none">{s.desc}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

import React from 'react'

export default function TrustStrip() {
  const signals = [
    { label: 'Client-side only', desc: 'Verified in browser' },
    { label: 'Zero logging', desc: 'Nothing stored' },
    { label: 'Open source', desc: 'Verified on GitHub' }
  ]

  return (
    <div className="flex flex-col md:flex-row items-stretch justify-center gap-3">
      {signals.map((s, i) => (
        <div key={s.label} className="flex-1 flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-5 transition-all hover:bg-white/10">
          <div className="w-2 h-2 rounded-full bg-[#F6F4E8] animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[#F6F4E8] font-heading font-bold text-[13px] uppercase tracking-wide">{s.label}</span>
            <span className="text-[#F6F4E8]/40 font-sans text-[11px] font-medium">{s.desc}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

import React from 'react'

export default function TrustStrip() {
  const signals = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent animate-pulse">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
      label: 'Client-side only',
      desc: 'Verified in your browser',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-valid">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      label: 'Zero logging',
      desc: 'Nothing stored, ever',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-secondary opacity-80">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      ),
      label: 'Open source',
      desc: 'Read the code on GitHub',
    },
  ]

  return (
    <div className="mt-8 relative group">
      {/* Container Background Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 via-valid/20 to-accent/20 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative flex flex-col md:flex-row items-stretch justify-center gap-0 rounded-2xl md:rounded-3xl overflow-hidden backdrop-blur-xl bg-white/[0.03] border border-white/[0.08]">
        {signals.map((s, i) => (
          <div
            key={s.label}
            className="flex-1 flex flex-row md:flex-col items-center md:items-center justify-start md:justify-center py-4 md:py-6 px-5 md:px-4 text-left md:text-center transition-all duration-300 hover:bg-white/[0.02] gap-4 md:gap-3"
            style={{
              borderRight: i < signals.length - 1 ? '1px solid var(--border)' : 'none',
              borderBottom: i < signals.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <div className="transition-transform duration-500 group-hover:scale-110 shrink-0 text-[var(--accent)] [&>svg]:w-6 md:[&>svg]:w-[18px] [&>svg]:h-6 md:[&>svg]:h-[18px] [&>svg]:stroke-[2.5] md:[&>svg]:stroke-[1.5]">
              {s.icon}
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-[14px] md:text-[13px] tracking-wide uppercase mb-0.5 md:mb-1" style={{ color: 'var(--text-primary)' }}>
                {s.label}
              </span>
              <span className="font-sans text-[11px] md:text-[11px] font-medium opacity-60" style={{ color: 'var(--text-muted)' }}>
                {s.desc}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Mobile Responsive Border adjustment */}
      <style jsx>{`
        @media (min-width: 768px) {
          .flex-1 { border-bottom: none !important; }
        }
      `}</style>
    </div>
  )
}

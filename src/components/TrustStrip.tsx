const signals = [
  {
    icon: '⬡',
    label: 'Client-side only',
    desc: 'Verified in your browser',
  },
  {
    icon: '⌀',
    label: 'Zero logging',
    desc: 'Nothing stored, ever',
  },
  {
    icon: '⬡',
    label: 'Open source',
    desc: 'Read the code on GitHub',
  },
]

export default function TrustStrip() {
  return (
    <div
      className="flex items-center justify-center gap-0 mt-5 rounded-xl overflow-hidden"
      style={{ border: '1px solid var(--border)' }}
    >
      {signals.map((s, i) => (
        <div
          key={s.label}
          className="flex-1 flex flex-col items-center py-3 px-2 text-center"
          style={{
            background: 'var(--bg-surface)',
            borderRight: i < signals.length - 1 ? '1px solid var(--border)' : 'none',
          }}
        >
          <span className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-primary)' }}>
            {s.label}
          </span>
          <span className="text-xs text-[10px]" style={{ color: 'var(--text-hint)' }}>
            {s.desc}
          </span>
        </div>
      ))}
    </div>
  )
}

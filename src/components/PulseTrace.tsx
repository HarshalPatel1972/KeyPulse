const TRACE =
  'M0 42 H70 l18 0 l10 -28 l14 50 l9 -22 H250 l18 0 l10 -28 l14 50 l9 -22 H430 l18 0 l10 -28 l14 50 l9 -22 H610 l18 0 l10 -28 l14 50 l9 -22 H790 l18 0 l10 -28 l14 50 l9 -22 H970 l18 0 l10 -28 l14 50 l9 -22 H1200'

export default function PulseTrace({ active = false }: { active?: boolean }) {
  return (
    <div className="trace-mask border-b border-line text-ink" aria-hidden>
      <svg viewBox="0 0 1200 84" preserveAspectRatio="none" className="block h-16 w-full md:h-20">
        <path
          d={TRACE}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          className="text-ink/20"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={TRACE}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          pathLength={1000}
          vectorEffect="non-scaling-stroke"
          className={active ? 'pulse-trace is-fast' : 'pulse-trace'}
        />
      </svg>
    </div>
  )
}

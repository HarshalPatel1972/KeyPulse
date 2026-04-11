import { PROVIDERS } from '@/lib/providers'
import { Provider } from '@/lib/types'

interface Props {
  value: Provider | null
  onChange: (provider: Provider) => void
}

export default function ManualSelect({ value, onChange }: Props) {
  return (
    <div className="mt-2">
      <p className="text-xs text-muted mb-1.5">Provider not detected — select manually:</p>
      <select
        className="w-full bg-elevated border border-border text-primary text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-border-hover"
        value={value?.id ?? ''}
        onChange={(e) => {
          const p = PROVIDERS.find((p) => p.id === e.target.value)
          if (p) onChange(p)
        }}
      >
        <option value="">Select a provider...</option>
        {PROVIDERS.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  )
}

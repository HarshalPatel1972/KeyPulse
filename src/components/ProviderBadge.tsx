import { useState } from 'react'
import { Provider } from '@/lib/types'

interface Props {
  provider: Provider
}

export default function ProviderBadge({ provider }: Props) {
  const [imgError, setImgError] = useState(false)

  return (
    <div
      className="flex items-center gap-2 animate-in"
      style={{ '--provider-color': provider.color } as React.CSSProperties}
    >
      {!imgError ? (
        <img
          src={`https://www.google.com/s2/favicons?sz=128&domain=${provider.domain}`}
          alt={provider.name}
          className="w-4 h-4 rounded-sm"
          onError={() => setImgError(true)}
        />
      ) : (
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: provider.color }}
        />
      )}
      <span className="text-xs font-medium text-primary">{provider.name}</span>
      <span
        className="text-xs px-2 py-0.5 rounded-full border"
        style={{
          color: provider.color,
          borderColor: provider.color + '40',
          backgroundColor: provider.color + '12',
        }}
      >
        detected
      </span>
    </div>
  )
}

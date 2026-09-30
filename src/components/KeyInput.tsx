'use client'

import { useCallback, useEffect, useState } from 'react'
import { detectProvider } from '@/lib/detect'
import { Provider } from '@/lib/types'
import ManualSelect from './ManualSelect'

interface Props {
  value: string
  selectedProvider: Provider | null
  onProviderChange: (provider: Provider | null) => void
  onKeyChange: (key: string) => void
  isLoading: boolean
  isInvalid: boolean
  forceManual?: boolean
}

export default function KeyInput({
  value,
  selectedProvider,
  onProviderChange,
  onKeyChange,
  isLoading,
  isInvalid,
  forceManual,
}: Props) {
  const [showKey, setShowKey] = useState(false)
  const [detection, setDetection] = useState<ReturnType<typeof detectProvider> | null>(null)

  useEffect(() => {
    if (!value.trim()) setDetection(null)
  }, [value])

  const handleChange = useCallback(
    (newValue: string) => {
      onKeyChange(newValue)
      if (!newValue.trim()) {
        setDetection(null)
        return
      }
      const result = detectProvider(newValue)
      setDetection(result)
      if (result.confidence === 'high' && result.provider) {
        onProviderChange(result.provider)
      }
    },
    [onKeyChange, onProviderChange],
  )

  const matched = detection?.confidence === 'high' && detection.provider
  const showManual = Boolean(forceManual || (detection?.confidence === 'unknown' && value.length > 8))

  return (
    <div className="w-full">
      <div className="mb-3 flex items-end justify-between gap-4">
        <label htmlFor="api-key" className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          API key
        </label>
        <button
          type="button"
          onClick={() => setShowKey((open) => !open)}
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
        >
          {showKey ? 'Hide' : 'Show'}
        </button>
      </div>

      <div className={`border-b ${isInvalid ? 'border-danger' : 'border-ink/25 focus-within:border-ink'}`}>
        <input
          id="api-key"
          name="api-key"
          type={showKey ? 'text' : 'password'}
          value={value}
          onChange={(event) => handleChange(event.target.value)}
          placeholder="sk-…"
          disabled={isLoading}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          data-1p-ignore
          data-lpignore="true"
          className="w-full bg-transparent py-3.5 font-mono text-[15px] text-ink outline-none placeholder:text-muted/70 md:text-base"
        />
      </div>

      <div className="mt-4 min-h-6">
        {isInvalid && (
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-danger">The provider refused this key.</p>
        )}
        {!isInvalid && matched && detection.provider && (
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink">
            <span className="h-1.5 w-1.5 bg-accent" />
            {detection.provider.name} matched
          </p>
        )}
      </div>

      {showManual && (
        <div className="mt-2">
          <ManualSelect value={selectedProvider} onChange={(provider) => onProviderChange(provider)} />
        </div>
      )}
    </div>
  )
}

'use client'
import { useState, useCallback } from 'react'
import { detectProvider } from '@/lib/detect'
import { Provider } from '@/lib/types'
import ProviderBadge from './ProviderBadge'
import ManualSelect from './ManualSelect'

interface Props {
  onProviderChange: (provider: Provider | null) => void
  onKeyChange: (key: string) => void
  isLoading: boolean
  isInvalid: boolean
}

export default function KeyInput({ onProviderChange, onKeyChange, isLoading, isInvalid }: Props) {
  const [key, setKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [detection, setDetection] = useState<ReturnType<typeof detectProvider> | null>(null)
  const [manualProvider, setManualProvider] = useState<Provider | null>(null)

  const handleChange = useCallback(
    (value: string) => {
      setKey(value)
      onKeyChange(value)
      if (!value.trim()) {
        setDetection(null)
        setManualProvider(null)
        onProviderChange(null)
        return
      }
      const result = detectProvider(value)
      setDetection(result)
      if (result.confidence === 'high' && result.provider) {
        setManualProvider(null)
        onProviderChange(result.provider)
      } else {
        onProviderChange(manualProvider)
      }
    },
    [manualProvider, onKeyChange, onProviderChange]
  )

  const handleManualSelect = (provider: Provider) => {
    setManualProvider(provider)
    onProviderChange(provider)
  }

  const showManual = detection?.confidence === 'unknown' && key.trim().length > 8

  return (
    <div className="w-full">
      <div
        className={`key-input-wrapper relative flex items-center transition-all duration-150 ${
          isInvalid ? 'animate-pulse-invalid' : ''
        }`}
        style={{
          background: 'var(--bg-surface)',
          border: `1px solid ${isInvalid ? 'var(--invalid)' : 'var(--border)'}`,
          borderRadius: '12px',
          transition: 'border-color 0.15s',
        }}
      >
        <input
          type={showKey ? 'text' : 'password'}
          value={key}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Paste your API key here..."
          disabled={isLoading}
          className="flex-1 px-4 py-4 outline-none placeholder:text-hint disabled:opacity-50"
          style={{
            background: 'transparent',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '13px',
          }}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <button
          type="button"
          onClick={() => setShowKey((v) => !v)}
          className="px-4 transition-colors text-xs"
          style={{ color: 'var(--text-hint)' }}
        >
          {showKey ? 'hide' : 'show'}
        </button>
      </div>

      <div className="mt-2 h-6 flex items-center">
        {detection?.confidence === 'high' && detection.provider && (
          <ProviderBadge provider={detection.provider} />
        )}
      </div>

      {showManual && <ManualSelect value={manualProvider} onChange={handleManualSelect} />}
    </div>
  )
}

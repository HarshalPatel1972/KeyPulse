'use client'
import { useState, useCallback, useEffect } from 'react'
import { detectProvider } from '@/lib/detect'
import { Provider } from '@/lib/types'
import ProviderBadge from './ProviderBadge'
import ManualSelect from './ManualSelect'

interface Props {
  value: string
  onProviderChange: (provider: Provider | null) => void
  onKeyChange: (key: string) => void
  isLoading: boolean
  isInvalid: boolean
}

export default function KeyInput({ value, onProviderChange, onKeyChange, isLoading, isInvalid }: Props) {
  const [showKey, setShowKey] = useState(false)
  const [detection, setDetection] = useState<ReturnType<typeof detectProvider> | null>(null)
  const [manualProvider, setManualProvider] = useState<Provider | null>(null)
  
  useEffect(() => {
    if (!value.trim()) {
      setDetection(null)
      setManualProvider(null)
    }
  }, [value])

  const handleChange = useCallback(
    (newValue: string) => {
      onKeyChange(newValue)
      if (!newValue.trim()) {
        onKeyChange(newValue)
        // Keep detection and provider persistent for a better UX during Reset
        return
      }
      const result = detectProvider(newValue)
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

  const showManual = detection?.confidence === 'unknown' && value.trim().length > 8

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
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Paste your API key here..."
          disabled={isLoading}
          className="flex-1 px-4 py-4 outline-none placeholder:text-hint disabled:opacity-50"
          style={{
            background: 'transparent',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '13px',
            WebkitTextSecurity: showKey ? 'none' : ('disc' as any),
          }}
          autoComplete="one-time-code"
          autoCorrect="off"
          spellCheck={false}
        />
        <div className="flex items-center pr-2 gap-1">
          {value && !isLoading && (
            <button
              type="button"
              onClick={() => handleChange('')}
              className="p-2 rounded-lg transition-all duration-300 hover:bg-white/[0.05] group/clear active:scale-95"
              title="Clear input"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted opacity-40 group-hover/clear:opacity-100 transition-opacity">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          )}
          
          <button
            type="button"
            onClick={() => setShowKey((v) => !v)}
            className="p-2 rounded-lg transition-all duration-300 hover:bg-white/[0.05] group/toggle active:scale-95"
            title={showKey ? 'Hide key' : 'Show key'}
          >
            {showKey ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted opacity-40 group-hover/toggle:opacity-100 transition-opacity">
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                <line x1="2" x2="22" y1="2" y2="22" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted opacity-40 group-hover/toggle:opacity-100 transition-opacity">
                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
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

import { useState, useCallback } from 'react'
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
  rightAction?: React.ReactNode
}

export default function KeyInput({ value, selectedProvider, onProviderChange, onKeyChange, isLoading, isInvalid, forceManual, rightAction }: Props) {
  const [showKey, setShowKey] = useState(false)
  const [detection, setDetection] = useState<ReturnType<typeof detectProvider> | null>(null)
  
  const handleChange = useCallback((newValue: string) => {
    onKeyChange(newValue)
    if (!newValue.trim()) return
    const result = detectProvider(newValue)
    setDetection(result)
    if (result.confidence === 'high' && result.provider) {
      onProviderChange(result.provider)
    }
  }, [onKeyChange, onProviderChange])

  return (
    <div className="w-full relative">
      <div className={`relative flex items-center transition-all duration-300 bg-base rounded-2xl p-1.5 border border-border-primary shadow-inner focus-within:ring-1 focus-within:ring-accent/50 focus-within:border-accent/50 focus-within:shadow-[0_0_30px_rgba(212,175,55,0.1)] ${isInvalid ? 'ring-2 ring-error/50 border-error/50 shadow-[0_0_30px_rgba(244,63,94,0.1)]' : ''}`}>
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Paste API key..."
          disabled={isLoading}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          className="flex-1 px-4 py-3.5 outline-none text-primary placeholder:text-primary/40 text-sm font-sans bg-transparent min-w-0"
          style={{ WebkitTextSecurity: showKey ? 'none' : 'disc' } as any}
        />
        <button 
          onClick={() => setShowKey(!showKey)} 
          className="px-3 py-2 text-[10px] uppercase font-bold tracking-widest text-primary/30 hover:text-primary transition-colors shrink-0"
        >
          {showKey ? 'Hide' : 'Show'}
        </button>
        {rightAction && (
          <div className="shrink-0 ml-1">
            {rightAction}
          </div>
        )}
      </div>

      <div className="mt-4 h-8 flex items-center">
        {detection?.confidence === 'high' && detection.provider && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 rounded-full border border-success/20 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-success">{detection.provider.name} Identified</span>
          </div>
        )}
      </div>

      {(forceManual || (detection?.confidence === 'unknown' && value.length > 8)) && (
        <ManualSelect value={selectedProvider} onChange={p => onProviderChange(p)} />
      )}
    </div>
  )
}


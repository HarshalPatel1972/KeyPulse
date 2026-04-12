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
}

export default function KeyInput({ value, selectedProvider, onProviderChange, onKeyChange, isLoading, isInvalid, forceManual }: Props) {
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
    <div className="w-full">
      <div className={`relative flex items-center transition-all bg-surface rounded-2xl p-1 border border-primary/10 dark:border-lavender/20 shadow-[0_10px_40px_rgba(66,72,116,0.08)] ${isInvalid ? 'ring-2 ring-error/50 border-error/50' : ''}`}>
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Paste API key..."
          disabled={isLoading}
          className="flex-1 px-5 py-4 outline-none text-primary placeholder:text-primary/50 dark:placeholder:text-lavender/40 text-sm font-heading bg-transparent"
          style={{ WebkitTextSecurity: showKey ? 'none' : 'disc' } as any}
        />
        <button 
          onClick={() => setShowKey(!showKey)} 
          className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-primary/40 hover:text-primary transition-colors"
        >
          {showKey ? 'Hide' : 'Show'}
        </button>
      </div>

      <div className="mt-4 h-8 flex items-center">
        {detection?.confidence === 'high' && detection.provider && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 dark:bg-primary/70 rounded-full border border-primary animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A6B1E1]" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-primary">{detection.provider.name} Identified</span>
          </div>
        )}
      </div>

      {(forceManual || (detection?.confidence === 'unknown' && value.length > 8)) && (
        <ManualSelect value={selectedProvider} onChange={p => onProviderChange(p)} />
      )}
    </div>
  )
}

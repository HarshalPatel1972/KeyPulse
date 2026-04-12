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
  forceManual?: boolean
}

export default function KeyInput({ value, onProviderChange, onKeyChange, isLoading, isInvalid, forceManual }: Props) {
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
      <div className={`relative flex items-center transition-all bg-white/5 border border-white/10 rounded-2xl p-1 ${isInvalid ? 'border-[#F6F4E8] shadow-[0_0_20px_rgba(246,244,232,0.3)]' : ''}`}>
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Paste API key..."
          disabled={isLoading}
          className="flex-1 px-5 py-4 outline-none text-[#F6F4E8] placeholder:opacity-40 text-sm font-heading"
          style={{ background: 'transparent', WebkitTextSecurity: showKey ? 'none' : 'disc' } as any}
        />
        <button onClick={() => setShowKey(!showKey)} className="p-3 text-[#F6F4E8] opacity-40 hover:opacity-100 transition-opacity">
          {showKey ? 'Hide' : 'Show'}
        </button>
      </div>

      <div className="mt-4">
        {detection?.confidence === 'high' && detection.provider && (
          <div className="flex items-center gap-3 animate-fade-in bg-white/5 p-3 rounded-2xl border border-white/10">
            <img src={detection.provider.icon} className="w-4 h-4 object-contain" alt="" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#F6F4E8]">{detection.provider.name} detected</span>
          </div>
        )}
      </div>

      {(forceManual || (detection?.confidence === 'unknown' && value.length > 8)) && (
        <ManualSelect value={null} onChange={p => onProviderChange(p)} />
      )}
    </div>
  )
}

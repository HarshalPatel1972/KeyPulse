'use client'
import { useState } from 'react'
import { VerifyResult, Provider } from '@/lib/types'
import { PROVIDERS_MAP } from '@/lib/providers'

interface Props {
  result: VerifyResult
  provider?: Provider
  onReset?: () => void
}

export default function ResultCard({ result, provider: manualProvider, onReset }: Props) {
  const provider = manualProvider || PROVIDERS_MAP[result.provider]
  const [showModels, setShowModels] = useState(false)
  const [imgError, setImgError] = useState(false)
  const isError = result.status === 'error' || result.status === 'invalid'
  const statusColor = result.status === 'valid' ? '#2dd4bf' : '#f87171'

  return (
    <div className="w-full bg-surface/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl animate-in slide-in-from-bottom-4 duration-300 group/card hover:border-white/20 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border overflow-hidden transition-transform duration-500 group-hover/card:scale-110"
            style={{
              borderColor: provider.color + '30',
              backgroundColor: provider.color + '10',
            }}
          >
            {!imgError ? (
              <img
                src={`https://www.google.com/s2/favicons?sz=128&domain=${provider.domain}`}
                alt={provider.name}
                className="w-6 h-6 object-contain"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: provider.color }} />
            )}
          </div>
          <div>
            <h3 className="text-primary text-sm font-medium tracking-tight">{provider.name}</h3>
            <p className="text-[9px] text-muted uppercase tracking-wider font-bold opacity-60">
              API Verification
            </p>
          </div>
        </div>
        <div
          className="px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase border"
          style={{
            color: statusColor,
            borderColor: statusColor + '40',
            backgroundColor: statusColor + '10',
          }}
        >
          {result.status.replace('_', ' ')}
        </div>
      </div>

      <div className="space-y-3">
        {result.rawError && (
          <div className="p-3 rounded-xl bg-invalid/10 border border-invalid/20 text-invalid text-[11px] leading-relaxed">
            {result.rawError}
          </div>
        )}

        {result.account && (
          <div className="bg-elevated/30 p-3 rounded-xl border border-white/5">
            <p className="text-[9px] text-muted mb-1 uppercase tracking-widest font-bold opacity-50">Account</p>
            <p className="text-xs text-primary font-medium truncate">
              {result.account.name || 'Anonymous'}{' '}
              <span className="text-muted ml-1 opacity-50 font-normal tracking-normal">• {result.account.type}</span>
            </p>
          </div>
        )}

        {result.rateLimit && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-elevated/30 p-3 rounded-xl border border-white/5">
              <p className="text-[9px] text-muted mb-1 uppercase tracking-widest font-bold opacity-50">Limit</p>
              <p className="text-xs text-primary font-medium">{result.rateLimit.limit}</p>
            </div>
            <div className="bg-elevated/30 p-3 rounded-xl border border-white/5">
              <p className="text-[9px] text-muted mb-1 uppercase tracking-widest font-bold opacity-50">
                Remaining
              </p>
              <p className="text-xs text-primary font-medium">{result.rateLimit.remaining}</p>
            </div>
          </div>
        )}

        {result.models.length > 0 && (
          <div className="bg-elevated/30 rounded-xl border border-white/5 overflow-hidden transition-all">
            <button
              onClick={() => setShowModels(!showModels)}
              className="w-full flex items-center justify-between p-3 hover:bg-white/[0.02] transition-colors"
            >
              <div>
                <p className="text-[9px] text-muted mb-1 text-left uppercase tracking-widest font-bold opacity-50">
                  Available Models
                </p>
                <p className="text-xs text-primary font-medium text-left">
                  {result.models.length} models
                </p>
              </div>
              <span
                className={`text-muted text-[10px] transition-transform duration-200 ${
                  showModels ? 'rotate-180' : ''
                }`}
              >
                ▼
              </span>
            </button>
            {showModels && (
              <div className="p-3 pt-0 grid grid-cols-1 gap-1 border-t border-white/5">
                {result.models.slice(0, 10).map((m) => (
                  <div key={m} className="text-[10px] font-mono text-muted py-1 flex items-center truncate opacity-70">
                    <span className="w-1 h-1 bg-muted/30 rounded-full mr-2 shrink-0" />
                    {m}
                  </div>
                ))}
                {result.models.length > 10 && (
                  <div className="text-[9px] text-hint py-2 text-center italic">
                    + {result.models.length - 10} more models
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <p className="text-[9px] text-hint uppercase tracking-widest font-bold opacity-50">
          {new Date(result.checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
        {onReset && result.checkedAt === 0 && ( // Hide button in history unless specifically needed
          <button
            onClick={onReset}
            className="text-[9px] font-bold text-primary hover:text-primary/70 transition-colors uppercase tracking-widest bg-elevated/50 px-3 py-1.5 rounded-lg border border-border"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  )
}

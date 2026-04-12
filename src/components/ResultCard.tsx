'use client'
import { useState } from 'react'
import { VerifyResult, Provider } from '@/lib/types'
import { PROVIDERS_MAP } from '@/lib/providers'

interface Props {
  result: VerifyResult
  provider?: Provider
  onReset?: () => void
  onDelete?: () => void
}

export default function ResultCard({ result, provider: manualProvider, onReset, onDelete }: Props) {
  const provider = manualProvider || PROVIDERS_MAP[result.provider]
  const [showModels, setShowModels] = useState(false)
  const [imgError, setImgError] = useState(false)
  const isError = result.status === 'error' || result.status === 'invalid'
  const statusColor = result.status === 'valid' ? '#2dd4bf' : '#f87171'

  return (
    <div className="w-full bg-transparent border border-[var(--border)] rounded-2xl p-5 animate-in slide-in-from-bottom-4 duration-300 group/card transition-[border-color,background-color] hover:border-[var(--border-hover)] relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border overflow-hidden transition-transform duration-500 group-hover/card:scale-110"
            style={{
              borderColor: provider.color + '20',
              backgroundColor: provider.color + '05',
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
            <h3 className="text-primary text-sm font-bold tracking-tight">{provider.name}</h3>
            <p className="text-[9px] text-muted uppercase tracking-widest font-bold opacity-40">
              API Verification
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="px-2.5 py-1 rounded-full text-[9px] font-bold tracking-[0.15em] uppercase border"
            style={{
              color: statusColor,
              borderColor: statusColor + '30',
              backgroundColor: statusColor + '05',
            }}
          >
            {result.status.replace('_', ' ')}
          </div>
          {onDelete && (
            <button 
              onClick={onDelete}
              className="p-1.5 rounded-lg hover:bg-white/[0.05] text-muted/40 hover:text-invalid transition-colors"
              title="Remove from history"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {result.rawError && (
          <div className="p-3 rounded-xl bg-invalid/[0.03] border border-invalid/20 text-invalid text-[11px] leading-relaxed">
            {result.rawError}
          </div>
        )}

        {result.account && (
          <div className="bg-black/[0.02] p-3 rounded-xl border border-black/5">
            <p className="text-[9px] text-muted mb-1 uppercase tracking-widest font-bold opacity-40">Account</p>
            <p className="text-xs text-primary font-medium truncate">
              {result.account.name || 'Anonymous'}{' '}
              <span className="text-muted ml-1 opacity-40 font-normal tracking-normal">• {result.account.type}</span>
            </p>
          </div>
        )}

        {result.rateLimit && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/[0.02] p-3 rounded-xl border border-black/5">
              <p className="text-[9px] text-muted mb-1 uppercase tracking-widest font-bold opacity-40">Limit</p>
              <p className="text-xs text-primary font-medium">{result.rateLimit.limit}</p>
            </div>
            <div className="bg-black/[0.02] p-3 rounded-xl border border-black/5">
              <p className="text-[9px] text-muted mb-1 uppercase tracking-widest font-bold opacity-40">
                Remaining
              </p>
              <p className="text-xs text-primary font-medium">{result.rateLimit.remaining}</p>
            </div>
          </div>
        )}

        {result.models.length > 0 && (
            <div className="bg-black/[0.02] rounded-xl border border-black/5 overflow-hidden transition-all">
            <button
              onClick={() => setShowModels(!showModels)}
              className="w-full flex items-center justify-between p-3 md:p-4 hover:bg-black/[0.03] transition-colors"
            >
              <div>
                <p className="text-[9px] text-muted mb-1 text-left uppercase tracking-[0.15em] font-bold opacity-40">
                  Available Models
                </p>
                <p className="text-xs text-primary font-bold text-left">
                  {result.models.length} models
                </p>
              </div>
              <span
                className={`text-muted text-[8px] opacity-40 transition-transform duration-300 ${
                  showModels ? 'rotate-180' : ''
                }`}
              >
                ▼
              </span>
            </button>
            {showModels && (
              <div className="p-3 pt-0 grid grid-cols-1 gap-1 border-t border-white/[0.03]">
                {result.models.slice(0, 10).map((m) => (
                  <div key={m} className="text-[10px] font-mono text-muted py-1 flex items-center truncate opacity-60">
                    <span className="w-1 h-1 bg-muted/20 rounded-full mr-2 shrink-0" />
                    {m}
                  </div>
                ))}
                {result.models.length > 10 && (
                  <div className="text-[9px] text-hint py-2 text-center italic opacity-60">
                    + {result.models.length - 10} more models
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-white/[0.03] flex items-center justify-between">
        <p className="text-[9px] text-hint uppercase tracking-widest font-bold opacity-30">
          {new Date(result.checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
        {onReset && result.checkedAt === '0' && ( // Hide button in history unless specifically needed
            <button
            onClick={onReset}
            className="text-[9px] font-bold text-primary hover:text-primary/70 transition-colors uppercase tracking-widest bg-white/[0.05] px-3 py-1.5 rounded-lg border border-white/[0.1]"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  )
}

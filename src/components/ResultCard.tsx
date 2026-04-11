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
    <div className="w-full bg-surface border border-border rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border overflow-hidden"
            style={{
              borderColor: provider.color + '30',
              backgroundColor: provider.color + '10',
            }}
          >
            {!imgError ? (
              <img
                src={`https://logo.clearbit.com/${provider.domain}`}
                alt={provider.name}
                className="w-6 h-6 object-contain"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: provider.color }} />
            )}
          </div>
          <div>
            <h3 className="text-primary font-medium tracking-tight">{provider.name}</h3>
            <p className="text-[11px] text-muted uppercase tracking-wider font-bold">
              API Verification
            </p>
          </div>
        </div>
        <div
          className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border"
          style={{
            color: statusColor,
            borderColor: statusColor + '40',
            backgroundColor: statusColor + '10',
          }}
        >
          {result.status.replace('_', ' ')}
        </div>
      </div>

      <div className="space-y-4">
        {result.rawError && (
          <div className="p-4 rounded-xl bg-invalid/10 border border-invalid/20 text-invalid text-sm">
            {result.rawError}
          </div>
        )}

        {result.account && (
          <div className="bg-elevated/50 p-4 rounded-xl border border-border">
            <p className="text-xs text-muted mb-1 uppercase tracking-widest font-bold">Account</p>
            <p className="text-sm text-primary font-medium">
              {result.account.name || 'Anonymous'}{' '}
              <span className="text-muted ml-1 opacity-50">• {result.account.type}</span>
            </p>
          </div>
        )}

        {result.rateLimit && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-elevated/50 p-4 rounded-xl border border-border">
              <p className="text-xs text-muted mb-1 uppercase tracking-widest font-bold">Limit</p>
              <p className="text-sm text-primary font-medium">{result.rateLimit.limit}</p>
            </div>
            <div className="bg-elevated/50 p-4 rounded-xl border border-border">
              <p className="text-xs text-muted mb-1 uppercase tracking-widest font-bold">
                Remaining
              </p>
              <p className="text-sm text-primary font-medium">{result.rateLimit.remaining}</p>
            </div>
          </div>
        )}

        {result.models.length > 0 && (
          <div className="bg-elevated/50 rounded-xl border border-border overflow-hidden transition-all">
            <button
              onClick={() => setShowModels(!showModels)}
              className="w-full flex items-center justify-between p-4 hover:bg-elevated/80 transition-colors"
            >
              <div>
                <p className="text-xs text-muted mb-1 text-left uppercase tracking-widest font-bold">
                  Available Models
                </p>
                <p className="text-sm text-primary font-medium text-left">
                  {result.models.length} models found
                </p>
              </div>
              <span
                className={`text-muted transition-transform duration-200 ${
                  showModels ? 'rotate-180' : ''
                }`}
              >
                ▼
              </span>
            </button>
            {showModels && (
              <div className="p-4 pt-0 grid grid-cols-1 gap-1 border-t border-border/50">
                {result.models.slice(0, 12).map((m) => (
                  <div key={m} className="text-[11px] font-mono text-muted py-1 flex items-center">
                    <span className="w-1 h-1 bg-muted/30 rounded-full mr-2" />
                    {m}
                  </div>
                ))}
                {result.models.length > 12 && (
                  <div className="text-[10px] text-hint py-2 text-center italic">
                    + {result.models.length - 12} more models
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
        <p className="text-[10px] text-hint uppercase tracking-widest font-bold">
          Checked at {new Date(result.checkedAt).toLocaleTimeString()}
        </p>
        {onReset && (
          <button
            onClick={onReset}
            className="text-xs font-bold text-primary hover:text-primary/70 transition-colors uppercase tracking-widest bg-elevated px-4 py-2 rounded-lg border border-border"
          >
            Check another
          </button>
        )}
      </div>
    </div>
  )
}

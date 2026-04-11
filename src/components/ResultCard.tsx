'use client'
import { VerifyResult, Provider } from '@/lib/types'

interface Props {
  result: VerifyResult
  provider: Provider
  onReset: () => void
}

export default function ResultCard({ result, provider, onReset }: Props) {
  const isError = result.status === 'error' || result.status === 'invalid'
  const statusColor = result.status === 'valid' ? 'var(--valid)' : 'var(--invalid)'

  return (
    <div className="w-full bg-surface border border-border rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border"
            style={{
              borderColor: provider.color + '30',
              backgroundColor: provider.color + '10',
            }}
          >
            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: provider.color }} />
          </div>
          <div>
            <h3 className="text-primary font-medium">{provider.name}</h3>
            <p className="text-xs text-muted">API Key Verification</p>
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
      
      {/* Rest of the card features will be added in subsequent commits */}
    </div>
  )
}

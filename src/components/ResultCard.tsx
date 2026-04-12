'use client'
import { useState } from 'react'
import { VerifyResult, Provider } from '@/lib/types'
import { PROVIDERS_MAP } from '@/lib/providers'

interface Props {
  result: VerifyResult
  provider?: Provider
  onDelete?: () => void
}

export default function ResultCard({ result, provider: manualProvider, onDelete }: Props) {
  const provider = manualProvider || PROVIDERS_MAP[result.provider]
  const [showModels, setShowModels] = useState(false)
  
  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 shadow-sm relative transition-all hover:bg-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center p-2 shrink-0 border border-black/5">
            <img src={`https://www.google.com/s2/favicons?sz=64&domain=${provider.domain}`} alt={provider.name} className="w-full h-full object-contain" />
          </div>
          <div>
            <h3 className="text-[#F6F4E8] text-[16px] font-heading font-bold leading-none mb-1">{provider.name}</h3>
            <p className="text-[10px] text-[#F6F4E8]/40 uppercase tracking-[0.15em] font-bold">IDENTITY VERIFIED</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase border border-white/20 bg-white/5 text-[#F6F4E8]">
            {result.status}
          </div>
          {onDelete && (
            <button onClick={onDelete} className="p-2 rounded-xl text-white/20 hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {result.rawError && <div className="p-4 rounded-2xl bg-white/10 text-[#F6F4E8] text-[12px] font-medium leading-relaxed">{result.rawError}</div>}
        {result.account && (
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <p className="text-[9px] text-[#F6F4E8]/40 mb-1 uppercase tracking-[0.2em] font-bold">ACCOUNT</p>
            <p className="text-sm text-[#F6F4E8] font-medium">{result.account.name || 'Anonymous'}</p>
          </div>
        )}
        {result.models.length > 0 && (
          <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
            <button onClick={() => setShowModels(!showModels)} className="w-full flex items-center justify-between p-4 hover:bg-white/5">
              <p className="text-xs text-[#F6F4E8] font-bold uppercase tracking-widest">{result.models.length} Access Points</p>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`transition-transform ${showModels ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6"/></svg>
            </button>
            {showModels && (
              <div className="p-4 pt-0 border-t border-white/5">
                {result.models.slice(0, 5).map(m => <div key={m} className="text-[11px] text-[#F6F4E8]/60 py-2 truncate flex items-center"><span className="w-1 h-1 bg-white/20 rounded-full mr-3"/>{m}</div>)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

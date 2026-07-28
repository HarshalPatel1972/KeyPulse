'use client'
import Image from 'next/image'
import { VerifyResult, Provider } from '@/lib/types'
import { PROVIDERS_MAP } from '@/lib/providers'

interface Props {
  result: VerifyResult
  provider?: Provider
  onDelete?: () => void
}

export default function ResultCard({ result, provider: manualProvider, onDelete }: Props) {
  const provider = manualProvider || (result.provider ? PROVIDERS_MAP[result.provider] : null)
  const providerName = provider?.name || result.provider || 'API Provider'
  const domain = provider?.domain || 'google.com'
  
  return (
    <div className="w-full bg-[var(--glass-bg)] backdrop-blur-2xl border border-[var(--glass-border)] shadow-[0_8px_32px_var(--glass-shadow)] rounded-[32px] p-6 md:p-8 relative transition-all duration-500 overflow-hidden">
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] flex items-center justify-center p-3 shadow-[0_4px_16px_var(--glass-shadow)]">
            <Image src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`} alt="" width={56} height={56} unoptimized className="w-full h-full object-contain brightness-110" />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[16px] font-heading font-semibold text-primary tracking-tight">{providerName}</span>
          <div className={`px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase border ${result.status === 'valid' ? 'bg-[var(--glass-bg)] backdrop-blur-md border-[var(--glass-border)] text-success shadow-[0_0_15px_rgba(52,199,89,0.2)]' : 'bg-[var(--glass-bg)] backdrop-blur-md border-[var(--glass-border)] text-error shadow-[0_0_15px_rgba(255,59,48,0.2)]'}`}>
            {result.status}
          </div>
          {onDelete && (
            <button onClick={onDelete} className="p-2.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-md text-primary/50 hover:text-primary transition-all hover:scale-110 active:scale-95 hover:shadow-[0_4px_12px_var(--glass-shadow)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        {result.rawError && (
          <div className="p-5 rounded-[24px] bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] shadow-[0_4px_16px_rgba(255,59,48,0.15)] text-primary text-[13px] font-medium animate-fade-in font-sans leading-relaxed">
            <span className="block text-[10px] uppercase tracking-widest font-bold mb-1 opacity-70 text-error">API Exception</span>
            {result.rawError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {result.account && (
            <div className="bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] p-6 rounded-[24px] group transition-all hover:bg-[var(--glass-highlight)] shadow-[0_4px_16px_var(--glass-shadow)]">
              <p className="text-[11px] text-primary/60 mb-2 uppercase tracking-[0.2em] font-semibold">Authenticated Subject</p>
              <p className="text-[18px] text-primary font-heading font-semibold">{result.account.name || 'Anonymous Identifier'}</p>
              {result.account.email && <p className="text-[14px] text-primary/70 mt-1 font-medium">{result.account.email}</p>}
            </div>
          )}

          <div className="bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] rounded-[24px] overflow-hidden flex flex-col transition-all shadow-[0_4px_16px_var(--glass-shadow)] hover:bg-[var(--glass-highlight)]">
            <div className="flex items-center justify-between p-6 border-b border-[var(--glass-border)]">
              <p className="text-[11px] text-primary/60 font-semibold uppercase tracking-[0.2em]">Available Endpoints</p>
              <span className="text-[11px] py-1 px-3 bg-gradient-to-r from-[var(--mesh-c2)] to-[var(--mesh-c3)] text-white rounded-full font-bold shadow-[0_0_10px_var(--mesh-c2)]">{result.models.length} Nodes</span>
            </div>
            
            <div className="max-h-[200px] overflow-y-auto px-4 py-4 custom-scrollbar">
              <div className="grid grid-cols-1 gap-1.5">
                {result.models.length > 0 ? (
                  result.models.map((m, idx) => (
                    <div 
                      key={m} 
                      className="text-[11px] text-primary/80 p-3 rounded-xl bg-[var(--glass-bg)] border border-transparent hover:border-[var(--glass-border)] hover:bg-[var(--glass-highlight)] transition-all flex items-center justify-between group animate-slide-up"
                      style={{ animationDelay: `${idx * 0.03}s` }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-gradient-to-r from-[var(--mesh-c2)] to-[var(--mesh-c3)] rounded-full group-hover:scale-150 transition-transform" />
                        <span className="font-mono font-medium">{m}</span>
                      </div>
                      <span className="text-[8px] uppercase tracking-widest text-primary/40 font-bold">Active</span>
                    </div>
                  ))
                ) : (
                  <p className="p-6 text-center text-primary/30 text-[11px] italic">No public endpoints exposed.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

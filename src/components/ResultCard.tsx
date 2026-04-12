'use client'
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
    <div className="w-full bg-surface shadow-[0_15px_45px_rgba(66,72,116,0.12)] rounded-[40px] p-6 md:p-8 relative animate-slide-up transition-colors duration-500 overflow-hidden">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-base flex items-center justify-center p-2.5 shadow-inner">
            <img src={`https://logo.clearbit.com/${domain}`} alt="" className="w-full h-full object-contain brightness-110" />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[14px] font-heading font-black text-primary/80 tracking-tight">{providerName}</span>
          <div className={`px-5 py-2 rounded-full text-[11px] font-black tracking-[0.2em] uppercase border ${result.status === 'valid' ? 'bg-success/20 border-success/40 text-success' : 'bg-error/20 border-error/40 text-error'}`}>
            {result.status}
          </div>
          {onDelete && (
            <button onClick={onDelete} className="p-2.5 rounded-xl bg-primary/5 border border-primary/10 text-primary/20 hover:text-primary/60 transition-all hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {result.rawError && (
          <div className="p-5 rounded-[24px] bg-indigo-deep/5 dark:bg-black/20 border border-indigo-deep/10 dark:border-lavender/10 text-primary dark:text-lavender/80 text-[12px] font-medium italic animate-fade-in font-sans leading-relaxed">
            <span className="block text-[9px] uppercase tracking-widest font-bold mb-1 opacity-50">API Exception</span>
            {result.rawError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {result.account && (
            <div className="bg-base/70 dark:bg-base/95 backdrop-blur-sm p-6 rounded-[32px] group transition-all">
              <p className="text-[10px] text-primary/30 mb-2 uppercase tracking-[0.3em] font-bold">Authenticated Subject</p>
              <p className="text-[16px] text-primary font-heading font-bold">{result.account.name || 'Anonymous Identifier'}</p>
              {result.account.email && <p className="text-[12px] text-primary/40 mt-1 font-sans">{result.account.email}</p>}
            </div>
          )}

          <div className="bg-base/60 dark:bg-base/90 rounded-[32px] overflow-hidden flex flex-col transition-all hover:bg-base/30 shadow-[0_4px_15px_rgba(66,72,116,0.04)]">
            <div className="flex items-center justify-between p-6 border-b border-primary/5">
              <p className="text-[10px] text-primary/60 font-bold uppercase tracking-[0.4em]">Available Endpoints</p>
              <span className="text-[10px] py-1 px-3 bg-primary/10 rounded-full text-primary/60 font-bold">{result.models.length} Nodes</span>
            </div>
            
            {/* Liquid Scrollable Model Zone */}
            <div className="max-h-[200px] overflow-y-auto px-4 py-4 custom-scrollbar">
              <div className="grid grid-cols-1 gap-1.5">
                {result.models.length > 0 ? (
                  result.models.map((m, idx) => (
                    <div 
                      key={m} 
                      className="text-[11px] text-primary/60 p-3 rounded-xl bg-primary/5 border border-transparent hover:border-primary/20 hover:bg-primary/10 transition-all flex items-center justify-between group animate-slide-up"
                      style={{ animationDelay: `${idx * 0.03}s` }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-primary/20 rounded-full group-hover:bg-primary/40 transition-colors" />
                        <span className="font-sans font-medium">{m}</span>
                      </div>
                      <span className="text-[8px] uppercase tracking-widest text-primary/60 font-black">Active</span>
                    </div>
                  ))
                ) : (
                  <p className="p-6 text-center text-primary/20 text-[11px] italic">No public endpoints exposed.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

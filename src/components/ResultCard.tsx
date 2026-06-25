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
    <div className="w-full bg-[#18252C] border-2 border-[#2A3A43] shadow-[0_8px_0_0_#111C21] rounded-[32px] p-6 md:p-8 relative animate-[bounce-scale_0.4s_ease-out] transition-colors duration-500 overflow-hidden">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#202F36] border-2 border-[#2A3A43] flex items-center justify-center p-3">
            <img src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`} alt="" className="w-full h-full object-contain brightness-110" />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[16px] font-heading font-black text-white tracking-tight">{providerName}</span>
          <div className={`px-5 py-2 rounded-full text-[12px] font-black tracking-widest uppercase border-2 ${result.status === 'valid' ? 'bg-success/20 border-success text-success' : 'bg-error/20 border-error text-error'}`}>
            {result.status}
          </div>
          {onDelete && (
            <button onClick={onDelete} className="p-2.5 rounded-xl bg-[#202F36] border-2 border-[#2A3A43] text-white/50 hover:text-white transition-all hover:scale-110 active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {result.rawError && (
          <div className="p-5 rounded-[24px] bg-error/10 border-2 border-error/30 text-white text-[13px] font-bold animate-fade-in font-sans leading-relaxed">
            <span className="block text-[10px] uppercase tracking-widest font-black mb-1 opacity-50 text-error">API Exception</span>
            {result.rawError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {result.account && (
            <div className="bg-[#202F36] border-2 border-[#2A3A43] p-6 rounded-[24px] group transition-all">
              <p className="text-[11px] text-white/50 mb-2 uppercase tracking-[0.2em] font-black">Authenticated Subject</p>
              <p className="text-[18px] text-white font-heading font-black">{result.account.name || 'Anonymous Identifier'}</p>
              {result.account.email && <p className="text-[14px] text-white/60 mt-1 font-bold">{result.account.email}</p>}
            </div>
          )}

          <div className="bg-[#202F36] border-2 border-[#2A3A43] rounded-[24px] overflow-hidden flex flex-col transition-all">
            <div className="flex items-center justify-between p-6 border-b-2 border-[#2A3A43]">
              <p className="text-[11px] text-white/50 font-black uppercase tracking-[0.2em]">Available Endpoints</p>
              <span className="text-[11px] py-1 px-3 bg-accent/20 border-2 border-accent/40 rounded-full text-accent font-black">{result.models.length} Nodes</span>
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

import { PROVIDERS } from '@/lib/providers'
import ProviderMark from './ProviderMark'

export default function ProviderMarquee() {
  const loop = [...PROVIDERS, ...PROVIDERS]

  return (
    <section id="providers" className="border-y border-line">
      <h2 className="sr-only">Supported providers</h2>
      <div className="marquee overflow-hidden" aria-hidden>
        <div className="marquee-track animate-marquee flex w-max items-center">
          {loop.map((provider, index) => (
            <div key={`${provider.id}-${index}`} className="flex items-center gap-4 px-7 py-5 md:px-9">
              <ProviderMark domain={provider.domain} name={provider.name} size={18} />
              <span className="font-sans text-[15px] tracking-tight text-ink">{provider.name}</span>
              <span className="font-serif italic text-muted">/</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

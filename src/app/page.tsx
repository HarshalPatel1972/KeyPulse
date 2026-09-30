'use client'

import { useCallback, useEffect, useState } from 'react'
import { verify } from '@/lib/verifiers'
import { PROVIDERS } from '@/lib/providers'
import { Provider, VerifyResult } from '@/lib/types'
import KeyInput from '@/components/KeyInput'
import VerifyButton from '@/components/VerifyButton'
import ResultCard from '@/components/ResultCard'
import GitHubButton from '@/components/GitHubButton'
import PulseTrace from '@/components/PulseTrace'
import ProviderMarquee from '@/components/ProviderMarquee'

const LINKS = [
  { label: 'Portfolio', href: 'http://harshal-patel-chi.vercel.app/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/harshal-patel-59b9a5278/' },
  { label: 'Instagram', href: 'https://www.instagram.com/harshalpatel2819' },
  { label: 'Coffee', href: 'https://www.chai4.me/harshalpatel' },
  { label: 'Email', href: 'mailto:hp842484n@gmail.com' },
]

const STEPS = [
  {
    index: '01',
    title: 'Detect',
    body: 'A prefix names OpenAI, Anthropic, Gemini, Groq, Hugging Face, or Replicate before the call. Everything else, you pick.',
  },
  {
    index: '02',
    title: 'Ask once',
    body: 'One request goes to that provider. Six are called from this browser. Five pass through a stateless proxy that does not keep the key.',
  },
  {
    index: '03',
    title: 'Read it',
    body: 'Status, models, account, and rate limits land in this tab. Leave the page, and the key leaves with you.',
  },
]

export default function Home() {
  const [key, setKey] = useState('')
  const [provider, setProvider] = useState<Provider | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastResult, setLastResult] = useState<VerifyResult | null>(null)
  const [hasChecked, setHasChecked] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)
  const [forceManual, setForceManual] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('kp_theme') as 'light' | 'dark' | null
    const next = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('kp_theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  const handleVerify = useCallback(async () => {
    if (!key.trim() || !provider || isLoading) return
    setIsLoading(true)
    setHasChecked(true)
    setLastResult(null)
    const result = await verify(key.trim(), provider.id)
    setIsLoading(false)
    if (
      result.status === 'error' &&
      (result.rawError?.toLowerCase().includes('invalid') || result.rawError?.toLowerCase().includes('unauthorized'))
    ) {
      setIsInvalid(true)
      return
    }
    setIsInvalid(false)
    setLastResult(result)
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      window.setTimeout(() => {
        document.getElementById('readout')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
    }
  }, [key, provider, isLoading])

  const handleReset = () => {
    setKey('')
    setProvider(null)
    setHasChecked(false)
    setIsInvalid(false)
    setLastResult(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="relative min-h-screen bg-paper text-ink">
      <a
        href="#check"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[90] focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-ink"
      >
        Skip to check
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-5 md:px-8">
          <a href="#check" className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70 ${isLoading ? '[animation-duration:0.55s]' : ''}`}
              />
              <span className="relative h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="font-sans text-[15px] font-medium tracking-tight">keypulse</span>
          </a>

          <nav className="hidden items-center gap-8 font-mono text-[11px] uppercase tracking-[0.18em] text-muted md:flex">
            <a href="#check" className="link-draw hover:text-ink">
              Check
            </a>
            <a href="#providers" className="link-draw hover:text-ink">
              Providers
            </a>
            <a href="#privacy" className="link-draw hover:text-ink">
              Privacy
            </a>
          </nav>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            <GitHubButton />
          </div>
        </div>
        <div className="flex gap-5 border-t border-line px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted md:hidden">
          <a href="#check" className="hover:text-ink">
            Check
          </a>
          <a href="#providers" className="hover:text-ink">
            Providers
          </a>
          <a href="#privacy" className="hover:text-ink">
            Privacy
          </a>
        </div>
      </header>

      <main>
        <section id="check" className="mx-auto grid max-w-[1440px] items-end gap-14 px-5 pt-14 pb-16 md:px-8 md:pt-20 md:pb-24 lg:grid-cols-12 lg:gap-16 lg:pt-28">
          <div className="lg:col-span-5 lg:pb-6">
            <div>
              <p className="animate-rise font-mono text-[11px] uppercase tracking-[0.22em] text-muted">API health, live</p>
              <h1 className="animate-rise mt-5 font-serif text-[clamp(3.5rem,6.4vw,6.35rem)] leading-[0.88] tracking-[-0.04em] [animation-delay:80ms]">
                Does your key
                <br />
                still have a
                <br />
                <em className="text-accent-ink italic bg-[linear-gradient(transparent_58%,var(--accent)_58%,var(--accent)_90%,transparent_90%)]">
                  pulse?
                </em>
              </h1>
              <p className="animate-rise mt-8 max-w-md text-lg leading-relaxed text-muted [animation-delay:160ms]">
                Paste a key. We name the provider, ask it once whether the key is alive, and show what came back. Nothing is written down.
              </p>
              <dl className="animate-rise mt-12 grid grid-cols-3 gap-4 border-t border-line pt-6 [animation-delay:240ms]">
                <div>
                  <dt className="font-sans text-[2.75rem] font-medium leading-none tracking-[-0.05em] tabular-nums">{PROVIDERS.length}</dt>
                  <dd className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Providers</dd>
                </div>
                <div>
                  <dt className="font-sans text-[2.75rem] font-medium leading-none tracking-[-0.05em] tabular-nums">0</dt>
                  <dd className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Logs kept</dd>
                </div>
                <div>
                  <dt className="font-sans text-[2.75rem] font-medium leading-none tracking-[-0.05em]">1×</dt>
                  <dd className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Live call</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="animate-rise relative border border-line bg-raised lg:col-span-7 [animation-delay:180ms]">
            <span className="frame-tick frame-tick-tl" />
            <span className="frame-tick frame-tick-tr" />
            <span className="frame-tick frame-tick-bl" />
            <span className="frame-tick frame-tick-br" />

            <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5 md:px-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                Session
                <span className="mx-2 text-line">/</span>
                <span className="text-ink">{provider ? provider.name : 'Idle'}</span>
              </p>
              <button
                type="button"
                onClick={() => setForceManual((value) => !value)}
                className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
              >
                {forceManual ? 'Auto-detect' : 'Pick provider'}
              </button>
            </div>

            <PulseTrace active={isLoading} />

            <form
              className="px-5 py-6 md:px-7 md:py-8"
              onSubmit={(event) => {
                event.preventDefault()
                void handleVerify()
              }}
            >
              <KeyInput
                value={key}
                selectedProvider={provider}
                onProviderChange={setProvider}
                forceManual={forceManual}
                onKeyChange={(value) => {
                  setKey(value)
                  if (!value) {
                    setIsInvalid(false)
                    setHasChecked(false)
                    setProvider(null)
                  }
                }}
                isLoading={isLoading}
                isInvalid={isInvalid}
              />

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="order-2 sm:order-1">
                  {hasChecked ? (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="link-draw font-mono text-[11px] uppercase tracking-[0.18em] text-muted hover:text-ink"
                    >
                      Clear
                    </button>
                  ) : (
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Enter to run</p>
                  )}
                </div>
                <div className="order-1 sm:order-2">
                  <VerifyButton disabled={!key.trim() || !provider} isLoading={isLoading} />
                </div>
              </div>
              <p className="mt-5 font-mono text-[11px] leading-relaxed tracking-[0.04em] text-muted">
                Held in this tab only. Clear it, or leave, and it is gone.
              </p>
            </form>
          </div>
        </section>

        <section id="readout" aria-live="polite" className="border-t border-line">
          {isLoading && !lastResult && (
            <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 md:py-24">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">Readout</p>
              <p className="mt-4 font-serif text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.88] tracking-[-0.04em]">
                Listening
                <span className="animate-blink">_</span>
              </p>
              <p className="mt-5 max-w-md text-lg text-muted">
                Asking {provider?.name ?? 'the provider'} whether this key is alive.
              </p>
            </div>
          )}

          {!isLoading && !lastResult && (
            <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-6 px-5 py-14 md:flex-row md:items-end md:px-8 md:py-16">
              <p className="font-serif text-[clamp(3.4rem,7vw,6rem)] leading-[0.88] tracking-[-0.04em] text-ink/15">
                Flatline
              </p>
              <p className="max-w-xs font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-muted">
                Waiting for a key. The line moves when a check is running.
              </p>
            </div>
          )}

          {lastResult && <ResultCard result={lastResult} onDelete={() => setLastResult(null)} />}
        </section>

        <ProviderMarquee />

        <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-8 md:py-28">
          <h2 className="max-w-xl font-serif text-[clamp(2.8rem,5vw,4.8rem)] leading-[0.92] tracking-[-0.035em]">
            Three beats.
            <br />
            Then the truth.
          </h2>
          <ol className="mt-14 grid gap-px border border-line bg-line md:grid-cols-3">
            {STEPS.map((step) => (
              <li key={step.index} className="bg-paper px-6 py-8 md:px-8 md:py-10">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{step.index}</p>
                <h3 className="mt-6 font-serif text-4xl tracking-[-0.03em]">{step.title}</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="privacy" className="bg-ink text-paper">
          <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-8 md:py-32">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55">Zero persistence</p>
            <h2 className="mt-6 max-w-4xl font-serif text-[clamp(3rem,6.5vw,6.4rem)] leading-[0.9] tracking-[-0.04em]">
              Read once.
              <br />
              <em className="italic">Stored never.</em>
            </h2>
            <div className="mt-16 grid gap-12 border-t border-paper/15 pt-10 md:grid-cols-3">
              <div>
                <h3 className="font-serif text-2xl tracking-tight">In this tab</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-paper/70">
                  Detection runs here. The key sits in memory for the check, then only for as long as you leave it on screen.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-2xl tracking-tight">Direct when it can be</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-paper/70">
                  OpenAI, Anthropic, Gemini, Groq, Hugging Face, and Replicate are called from your browser. No server of ours sees those keys.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-2xl tracking-tight">A pipe, not a vault</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-paper/70">
                  Perplexity, Mistral, Cohere, Together, and ElevenLabs need a proxy for CORS. It forwards the request and keeps nothing.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-8">
          <div>
            <p className="font-serif text-4xl tracking-[-0.03em]">keypulse</p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">By Harshal Patel</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-3">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="link-draw font-mono text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">© 2026</p>
        </div>
      </footer>
    </div>
  )
}

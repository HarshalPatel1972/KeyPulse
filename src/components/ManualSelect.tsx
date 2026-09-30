'use client'

import { useEffect, useRef, useState } from 'react'
import { PROVIDERS } from '@/lib/providers'
import { Provider } from '@/lib/types'
import ProviderMark from './ProviderMark'

interface Props {
  value: Provider | null
  onChange: (provider: Provider) => void
}

export default function ManualSelect({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!isOpen) setActiveIndex(null)
  }, [isOpen])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault()
        setIsOpen(true)
        setActiveIndex(0)
      }
      return
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActiveIndex((prev) => (prev === null || prev === PROVIDERS.length - 1 ? 0 : prev + 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActiveIndex((prev) => (prev === null || prev === 0 ? PROVIDERS.length - 1 : prev - 1))
        break
      case 'Enter':
        event.preventDefault()
        if (activeIndex !== null) {
          onChange(PROVIDERS[activeIndex])
          setIsOpen(false)
        }
        break
      case 'Escape':
        event.preventDefault()
        setIsOpen(false)
        break
    }
  }

  return (
    <div className="relative w-full" ref={containerRef} onKeyDown={handleKeyDown}>
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">Provider</p>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between gap-4 border border-line bg-paper px-4 py-3.5 text-left transition-colors hover:bg-raised"
      >
        {value ? (
          <span className="flex min-w-0 items-center gap-3">
            <ProviderMark domain={value.domain} name={value.name} size={22} />
            <span className="truncate font-sans text-[15px] tracking-tight">{value.name}</span>
          </span>
        ) : (
          <span className="font-sans text-[15px] tracking-tight text-muted">Choose a provider</span>
        )}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`shrink-0 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute top-full left-0 z-50 mt-2 max-h-72 w-full overflow-y-auto border border-line bg-raised shadow-[0_22px_50px_rgba(20,24,10,0.18)] custom-scrollbar"
        >
          {PROVIDERS.map((provider, index) => {
            const selected = value?.id === provider.id
            const active = activeIndex === index
            return (
              <button
                key={provider.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(provider)
                  setIsOpen(false)
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                  selected ? 'bg-ink text-paper' : active ? 'bg-paper' : 'hover:bg-paper'
                }`}
              >
                <ProviderMark domain={provider.domain} name={provider.name} size={20} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-sans text-[14px] tracking-tight">{provider.name}</span>
                  <span className={`block truncate font-mono text-[10px] uppercase tracking-[0.14em] ${selected ? 'text-paper/60' : 'text-muted'}`}>
                    {provider.domain}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

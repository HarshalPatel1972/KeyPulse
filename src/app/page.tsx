'use client'
import { useState, useCallback, useEffect } from 'react'
import { Provider } from '@/lib/types'
import KeyInput from '@/components/KeyInput'
import TrustBanner from '@/components/TrustBanner'
import VerifyButton from '@/components/VerifyButton'
import ResultCard from '@/components/ResultCard'

import { verify } from '@/lib/verifiers'
import { VerifyResult } from '@/lib/types'

export default function Home() {
  const [key, setKey] = useState('')
  const [provider, setProvider] = useState<Provider | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)
  const [result, setResult] = useState<VerifyResult | null>(null)

  const handleVerify = useCallback(async () => {
    if (!key.trim() || !provider) return
    setIsLoading(true)
    setIsInvalid(false)

    try {
      const res = await verify(key.trim(), provider.id)
      console.log('Verification Result:', res)
      if (res.status === 'invalid') {
        setIsInvalid(true)
      } else {
        setResult(res)
      }
    } catch (err) {
      console.error('Verification failed:', err)
    } finally {
      setIsLoading(false)
    }
  }, [key, provider])

  const handleReset = () => {
    setResult(null)
    setIsInvalid(false)
    // Key and provider are preserved for convenience, but could be cleared
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleVerify()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleVerify])

  return (
    <main className="min-h-screen bg-base flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-[560px]">
        {!result ? (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="mb-10 text-center">
              <h1 className="text-3xl font-medium text-primary mb-2 tracking-tight">KeyPulse</h1>
              <p className="text-muted text-base">Check if your key still has a pulse.</p>
            </div>

            <KeyInput
              onProviderChange={setProvider}
              onKeyChange={setKey}
              isLoading={isLoading}
              isInvalid={isInvalid}
            />

            <VerifyButton
              onClick={handleVerify}
              disabled={!key.trim() || !provider}
              isLoading={isLoading}
            />

            <TrustBanner />
          </div>
        ) : (
          <ResultCard result={result} provider={provider!} onReset={handleReset} />
        )}
      </div>
    </main>
  )
}

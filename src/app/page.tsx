'use client'
import { useState, useCallback, useEffect } from 'react'
import { Provider } from '@/lib/types'
import KeyInput from '@/components/KeyInput'
import VerifyButton from '@/components/VerifyButton'
import TrustBanner from '@/components/TrustBanner'

import { verify } from '@/lib/verifiers'

export default function Home() {
  const [key, setKey] = useState('')
  const [provider, setProvider] = useState<Provider | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)

  const handleVerify = useCallback(async () => {
    if (!key.trim() || !provider) return
    setIsLoading(true)
    setIsInvalid(false)

    try {
      const result = await verify(key.trim(), provider.id)
      console.log('Verification Result:', result)
      if (result.status === 'invalid') {
        setIsInvalid(true)
      }
    } catch (err) {
      console.error('Verification failed:', err)
    } finally {
      setIsLoading(false)
    }
  }, [key, provider])

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
    <main className="min-h-screen bg-base flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[560px]">
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
    </main>
  )
}

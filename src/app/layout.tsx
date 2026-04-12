import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://key-pulse-tau.vercel.app'),
  title: 'KeyPulse — The Heartbeat of your API Lifecycle',
  description:
    'Paste any API key. We detect the provider, verify it live, and tell you everything — in seconds. Privacy-first, zero-log API key validation.',
  alternates: {
    canonical: '/',
  },
  keywords: ['API key', 'validator', 'checker', 'OpenAI', 'Anthropic', 'Gemini', 'security', 'key pulse'],
  authors: [{ name: 'KeyPulse Team' }],
  openGraph: {
    title: 'KeyPulse — Check if your key still has a pulse',
    description: 'Instant, privacy-first API key detection and validation.',
    url: 'https://key-pulse-tau.vercel.app',
    siteName: 'KeyPulse',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KeyPulse — API Key Validator',
    description: 'The heartbeat of your API lifecycle.',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}

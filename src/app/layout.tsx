import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'KeyPulse — The Heartbeat of your API Lifecycle',
  description:
    'Paste any API key. We detect the provider, verify it live, and tell you everything — in seconds. Privacy-first, zero-log API key validation.',
  keywords: ['API key', 'validator', 'checker', 'OpenAI', 'Anthropic', 'Gemini', 'security'],
  authors: [{ name: 'KeyPulse Team' }],
  openGraph: {
    title: 'KeyPulse — Check if your key still has a pulse',
    description: 'Instant, privacy-first API key detection and validation.',
    url: 'https://keypulse.app',
    siteName: 'KeyPulse',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KeyPulse — API Key Validator',
    description: 'The heartbeat of your API lifecycle.',
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}

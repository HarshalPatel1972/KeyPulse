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
  other: {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://unavatar.io https://logo.clearbit.com https://t1.gstatic.com https://www.google.com; connect-src 'self' https://*.openai.com https://*.anthropic.com https://*.googleapis.com https://*.groq.com https://*.huggingface.co https://*.replicate.com https://*.perplexity.ai https://*.mistral.ai https://*.cohere.com https://*.together.xyz https://*.elevenlabs.io https://keypulse-worker.hp842484.workers.dev; font-src 'self' data:; frame-ancestors 'none'; upgrade-insecure-requests;",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('kp_theme');
                if (savedTheme) {
                  document.documentElement.setAttribute('data-theme', savedTheme);
                } else {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}

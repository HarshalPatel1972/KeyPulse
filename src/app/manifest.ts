import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KeyPulse — API Key Validator',
    short_name: 'KeyPulse',
    description: 'Instant, privacy-first API key detection and validation.',
    start_url: '/',
    display: 'standalone',
    background_color: '#090a08',
    theme_color: '#090a08',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}

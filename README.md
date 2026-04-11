# KeyPulse 💓

**KeyPulse is the heartbeat of your API lifecycle.**

KeyPulse is a high-performance, privacy-first API key validator. It allows developers to instantly detect the provider of an API key and verify its status live, directly from the browser, with zero server-side logging.

## 🚀 Features

- **Instant Recognition**: Automatic prefix-based detection for 11+ major AI providers.
- **Live Verification**: Real-time status checks (Valid, Invalid, Quota Exceeded, Rate Limited).
- **Privacy First**: Direct browser-to-API communication. Your keys never leave your device.
- **Deep Insights**: View available models, account types, and remaining rate limits.
- **Beautiful UI**: A focused, dark-mode experience built with Geist Mono and Tailwind CSS.

## 🛠 Supported Providers

- OpenAI
- Anthropic
- Google Gemini
- Groq
- Mistral
- Cohere
- HuggingFace
- Perplexity
- Together AI
- Replicate
- ElevenLabs

## 📦 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Fonts**: [Geist](https://vercel.com/font)
- **Proxy**: Cloudflare Workers (for CORS-restricted providers)

## 🛠 Setup

### Prerequisites

- [pnpm](https://pnpm.io/)
- A Cloudflare Worker (optional, for proxy-dependent providers)

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/HarshalPatel1972/keypulse.git
   cd keypulse
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure environment**:
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_CF_WORKER_URL=your_worker_url
   ```

4. **Run the development server**:
   ```bash
   pnpm dev
   ```

5. **Open the app**:
   Navigate to `http://localhost:3000`.

## 🔒 Privacy & Security

KeyPulse is designed with a strict zero-log policy. We utilize direct browser-to-API calls whenever possible. For providers where CORS is restricted, we use a stateless Cloudflare Worker proxy that does not log requests or keys.

## 📄 License

MIT

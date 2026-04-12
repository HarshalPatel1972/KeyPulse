# KeyPulse 💓

**The definitive biometric for your API lifecycle.**

KeyPulse is a high-fidelity, privacy-first API validation suite designed for developers who demand both speed and aesthetic excellence. It provides instant, pulse-accurate verification for 11+ global AI providers, ensuring your intelligence layer is always operational.

Built with a **Zero-Persistence** philosophy, KeyPulse operates in "Ghost-Mode"—your API keys never cross a database, never touch a log, and never leave the neural isolation of your client session.

---

## 📽️ Elite Experience

KeyPulse is more than a tool; it's a cinematic dashboard for your workspace.

- **Neural Isolation Architecture**: 100% client-side verification. Zero history. Zero logs.
- **Cinematic Design System**: A high-contrast, boutique interface utilizing a "Lavender & Deep Indigo" color hierarchy.
- **Micro-Interaction Fidelity**: Fluid animations, including the "Logo Fountain" and "Star River" background for a premium feel.
- **Node Verification**: Beyond just "valid/invalid"—retrieve available endpoints, account subject identifiers, and real-time API exceptions.

---

## 🔒 Security & Privacy

We believe in **Absolute Transparency**. Security is the core of the KeyPulse DNA.

### Zero-Persistence Pattern
Unlike traditional validators, KeyPulse does not utilize a backend database. We treat API keys as radioactive: the second your verification is complete, the state is purged.

### Neural Isolation
- **Direct-to-API**: 90% of providers are queried directly from your browser.
- **Stateless Proxy**: For CORS-restricted providers, requests are routed through a stateless Cloudflare Worker that acts as a pass-through. No keys are ever stored or logged at the edge.

---

## 🧩 Supported Intelligence Sources

KeyPulse provides native, prefix-aware support for:

- **OpenAI** (Auto-detection for `sk-` and `sk-proj-`)
- **Anthropic** (Native `sk-ant-` support)
- **Google Gemini**
- **Meta Llama / Mistral**
- **Groq**
- **HuggingFace**
- **Perplexity**
- **Cohere**
- **Together AI**
- **Replicate**
- **ElevenLabs**

---

## 🛠️ Technical Specifications

KeyPulse is engineered with the modern web's most powerful primitives:

- **Framework**: [Next.js 16.2.3](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Custom Saturated Palette)
- **Performance**: [unavatar.io](https://unavatar.io) integration for instant sub-millisecond brand recognition.
- **Language**: TypeScript (Strict-mode)

---

## 🚀 Setup & Deployment

### Prerequisites

- **pnpm** (Recommended package manager)
- **Node.js 20+**

### Local Development

1. **Initialize the Repository**:
   ```bash
   git clone https://github.com/HarshalPatel1972/KeyPulse.git
   cd KeyPulse
   ```

2. **Sync Dependencies**:
   ```bash
   pnpm install
   ```

3. **Environment Configuration**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_CF_WORKER_URL=your_stateless_proxy_url
   ```

4. **Launch Interface**:
   ```bash
   pnpm dev
   ```

---

## 🌐 Connect & Contribute

KeyPulse is a boutique project maintained by **Harshal Patel**.

[**Portfolio**](http://harshal-patel-chi.vercel.app/) | [**LinkedIn**](https://www.linkedin.com/in/harshal-patel-59b9a5278/) | [**Instagram**](https://www.instagram.com/harshalpatel2819) | [**Sponsor**](https://www.chai4.me/harshalpatel)

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

© 2026 **Harshal Patel**. All Rights Reserved.

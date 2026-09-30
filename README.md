# KeyPulse

Paste an API key. KeyPulse names the provider, asks it once if the key is alive, and shows what came back.

The key is not saved. OpenAI, Anthropic, Gemini, Groq, Hugging Face, and Replicate are called straight from your browser. Perplexity, Mistral, Cohere, Together, and ElevenLabs need a proxy because of CORS. That proxy forwards the request and keeps nothing.

You get a status, the provider’s own error when there is one, and — when the API sends them — the account, rate limit, and model list.

## Run it locally

You need Node 20 or newer, and pnpm.

```bash
git clone https://github.com/HarshalPatel1972/KeyPulse.git
cd KeyPulse
pnpm install
pnpm dev
```

Open http://localhost:3000.

The proxied providers need a worker URL. Put this in `.env.local`:

```env
NEXT_PUBLIC_CF_WORKER_URL=your_worker_url
```

## Who

Harshal Patel — [portfolio](http://harshal-patel-chi.vercel.app/), [LinkedIn](https://www.linkedin.com/in/harshal-patel-59b9a5278/), [Instagram](https://www.instagram.com/harshalpatel2819), [coffee](https://www.chai4.me/harshalpatel).

MIT license.

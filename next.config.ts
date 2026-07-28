import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://unavatar.io https://logo.clearbit.com https://t1.gstatic.com https://www.google.com; connect-src 'self' https://*.openai.com https://*.anthropic.com https://*.googleapis.com https://*.groq.com https://*.huggingface.co https://*.replicate.com https://*.perplexity.ai https://*.mistral.ai https://*.cohere.com https://*.together.xyz https://*.elevenlabs.io https://keypulse-worker.hp842484.workers.dev; font-src 'self' data:; frame-ancestors 'none'; upgrade-insecure-requests;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

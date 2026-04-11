import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Note: Tailind v4 handles most of these via @theme in globals.css
    },
  },
}
export default config

import { describe, it, expect, vi } from 'vitest'
import { verify } from '@/lib/verifiers/index'
import * as openai from '@/lib/verifiers/openai'

vi.mock('@/lib/verifiers/openai', () => ({
  verifyOpenAI: vi.fn(),
}))

describe('verify root dispatcher', () => {
  it('calls the correct direct verifier', async () => {
    vi.mocked(openai.verifyOpenAI).mockResolvedValue({
      status: 'valid',
      provider: 'openai',
      models: [],
      account: null,
      rateLimit: null,
      checkedAt: new Date().toISOString(),
    })

    const result = await verify('test-key', 'openai')
    expect(openai.verifyOpenAI).toHaveBeenCalledWith('test-key')
    expect(result.status).toBe('valid')
  })

  it('handles unhandled promise rejections safely', async () => {
    vi.mocked(openai.verifyOpenAI).mockRejectedValue(new Error('Network failure'))

    const result = await verify('test-key', 'openai')
    
    expect(result.status).toBe('error')
    expect(result.rawError).toBe('Network failure')
  })
})

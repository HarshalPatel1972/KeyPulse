'use client'
import { useEffect, useRef } from 'react'

export default function StarRiver() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationFrameId: number
    let particles: { x: number; y: number; radius: number; speed: number; opacity: number; color: string }[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      particles = []
      // Fewer, larger particles for an organic feel
      const numParticles = Math.floor((canvas.width * canvas.height) / 15000)
      for (let i = 0; i < numParticles; i++) {
        particles.push(createParticle(true))
      }
    }

    const createParticle = (randomY = false) => {
      // Pick higher contrast colors from the organic palette for the Rose backdrop
      const colors = ['#F6F4E8', '#C0E1D2', '#E5EEE4']
      const color = colors[Math.floor(Math.random() * colors.length)]
      
      return {
        x: Math.random() * canvas.width,
        y: randomY ? Math.random() * canvas.height : -20,
        // Larger, softer orbs
        radius: Math.random() * 8 + 2,
        // Very slow drifting downwards
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.3 + 0.1,
        color: color
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        
        // Use the assigned palette color with individual opacity
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        
        ctx.shadowBlur = 15
        ctx.shadowColor = p.color
        
        ctx.fill()
        ctx.globalAlpha = 1 // reset alpha

        // Slow drifting movement
        p.y += p.speed
        p.x += Math.sin(p.y / 50) * 0.2 // subtle sway

        // Reset if off bottom
        if (p.y > canvas.height + 20) {
          Object.assign(p, createParticle(false))
          p.x = Math.random() * canvas.width
        }
      })

      animationFrameId = requestAnimationFrame(render)
    }

    window.addEventListener('resize', resize)
    resize()
    render()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1]"
      style={{ background: 'transparent' }}
    />
  )
}

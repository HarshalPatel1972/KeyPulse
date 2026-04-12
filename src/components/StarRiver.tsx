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
    let particles: { x: number; y: number; radius: number; speed: number; opacity: number; color: string; angle: number }[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      particles = []
      const numParticles = Math.floor((canvas.width * canvas.height) / 20000)
      for (let i = 0; i < numParticles; i++) {
        particles.push(createParticle(true))
      }
    }

    const createParticle = (randomY = false) => {
      // Strictly using only the 4-color identity palette
      const colors = ['#F4EEFF', '#DCD6F7', '#A6B1E1']
      const color = colors[Math.floor(Math.random() * colors.length)]
      return {
        x: Math.random() * canvas.width,
        y: randomY ? Math.random() * canvas.height : -50,
        radius: Math.random() * 20 + 8,
        speed: Math.random() * 0.12 + 0.04,
        opacity: Math.random() * 0.12 + 0.05,
        color: color,
        angle: Math.random() * Math.PI * 2
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.shadowBlur = 40
        ctx.shadowColor = p.color
        ctx.fill()
        ctx.globalAlpha = 1
        p.y += p.speed
        p.angle += 0.001
        p.x += Math.sin(p.angle) * 0.1
        if (p.y > canvas.height + 50) Object.assign(p, createParticle(false))
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
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  )
}

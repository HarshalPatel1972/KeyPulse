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
    let stars: { x: number; y: number; radius: number; speed: number; opacity: number }[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initStars()
    }

    const initStars = () => {
      stars = []
      // Number of stars scales with screen width to keep density consistent
      const numStars = Math.floor((canvas.width * canvas.height) / 8000)
      for (let i = 0; i < numStars; i++) {
        stars.push(createStar(true))
      }
    }

    const createStar = (randomY = false) => {
      return {
        x: Math.random() * canvas.width,
        y: randomY ? Math.random() * canvas.height : -10,
        // Increased radius for better visibility
        radius: Math.random() * 1.5 + 0.5,
        // Slow downward flow (river effect)
        speed: Math.random() * 0.5 + 0.1,
        // Increased opacity for better visibility
        opacity: Math.random() * 0.6 + 0.2,
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Get computed CSS variable for accent color to match the active theme
      const style = getComputedStyle(document.documentElement)
      const accent = style.getPropertyValue('--accent').trim() || '#7c3aed'

      stars.forEach((star) => {
        // Subtle glow effect
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        
        // Add a very faint tint of the theme accent color to some stars
        if (star.radius > 0.6) {
           ctx.shadowBlur = 8
           ctx.shadowColor = accent
        } else {
           ctx.shadowBlur = 0
        }
        
        ctx.fill()

        // Move star down
        star.y += star.speed
        
        // Slight horizontal drift (river effect)
        star.x -= star.speed * 0.3

        // Reset if off screen
        if (star.y > canvas.height + 10 || star.x < -10) {
          Object.assign(star, createStar(false))
          star.x = Math.random() * canvas.width + 50 // starting slightly to the right to drift left
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

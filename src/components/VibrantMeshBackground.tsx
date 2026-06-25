'use client'
import React from 'react'

export default function VibrantMeshBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-base transition-colors duration-700">
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-60 animate-[var(--animate-mesh-1)]" style={{ backgroundColor: 'var(--mesh-c1)' }}></div>
      <div className="absolute top-[10%] right-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-50 animate-[var(--animate-mesh-2)]" style={{ backgroundColor: 'var(--mesh-c2)' }}></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[70vw] h-[70vw] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[150px] opacity-40 animate-[var(--animate-mesh-3)]" style={{ backgroundColor: 'var(--mesh-c3)' }}></div>
      <div className="absolute top-[40%] left-[40%] w-[40vw] h-[40vw] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[90px] opacity-50 animate-[var(--animate-pulse-slow)]" style={{ backgroundColor: 'var(--mesh-c4)' }}></div>
      
      {/* Noise Overlay for premium texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      ></div>
    </div>
  )
}

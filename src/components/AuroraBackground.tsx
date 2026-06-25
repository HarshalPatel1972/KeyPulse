import React from 'react'

export default function AuroraBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base Deep Navy */}
      <div className="absolute inset-0 bg-[#0A0F1C]" />
      
      {/* Aurora Orbs */}
      <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-indigo-900/20 blur-[120px] animate-aurora-1 mix-blend-screen" />
      <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-emerald-900/10 blur-[120px] animate-aurora-2 mix-blend-screen" />
      <div className="absolute -bottom-[20%] left-[20%] w-[80vw] h-[80vw] rounded-full bg-blue-900/15 blur-[150px] animate-aurora-3 mix-blend-screen" />
      
      {/* Subtle Noise Texture for Classic Feel */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
    </div>
  )
}

'use client'

import { useState } from 'react'

export default function ProviderMark({
  domain,
  name,
  size = 28,
}: {
  domain: string
  name: string
  size?: number
}) {
  const [failed, setFailed] = useState(false)
  const src = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`

  const plate = size + 10

  if (failed) {
    return (
      <span
        className="grid shrink-0 place-items-center bg-[#f4f1ea] font-mono text-[10px] uppercase tracking-wider text-[#14180a]"
        style={{ width: plate, height: plate }}
      >
        {name.slice(0, 2)}
      </span>
    )
  }

  return (
    <span className="grid shrink-0 place-items-center bg-[#f4f1ea]" style={{ width: plate, height: plate }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        onError={() => setFailed(true)}
        className="object-contain"
        style={{ width: size, height: size }}
      />
    </span>
  )
}

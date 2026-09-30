import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import React from 'react'

const require = createRequire(import.meta.url)
const { ImageResponse } = require('next/og')

const h = React.createElement
const font = readFileSync(new URL('../src/fonts/InstrumentSerif-Regular.ttf', import.meta.url))

function pulse(size) {
  return h(
    'svg',
    { width: size, height: size, viewBox: '0 0 32 32', style: { display: 'flex' } },
    h('rect', { width: '32', height: '32', fill: 'none', stroke: '#f3f0e6', strokeWidth: '1.4' }),
    h('path', {
      d: 'M3.5 17.5h6l2.3-7.2 4.2 14.6 2.5-7.4H28.5',
      fill: 'none',
      stroke: '#d6ff4a',
      strokeWidth: '2.2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }),
  )
}

async function writeImage(element, width, height, file) {
  const response = new ImageResponse(element, {
    width,
    height,
    fonts: [{ name: 'Instrument Serif', data: font, style: 'normal' }],
  })
  writeFileSync(file, Buffer.from(await response.arrayBuffer()))
}

const og = h(
  'div',
  {
    style: {
      width: '1200px',
      height: '630px',
      display: 'flex',
      flexDirection: 'column',
      background: '#090a08',
      color: '#f3f0e6',
      padding: '76px 80px',
      fontFamily: 'Instrument Serif',
    },
  },
  h(
    'div',
    { style: { display: 'flex', alignItems: 'center' } },
    pulse(72),
    h('div', { style: { marginLeft: 22, fontSize: 46, letterSpacing: -1.2 } }, 'keypulse'),
  ),
  h(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 72,
        fontSize: 92,
        lineHeight: 0.9,
        letterSpacing: -3,
      },
    },
    h('div', null, 'Does your key'),
    h(
      'div',
      { style: { display: 'flex', alignItems: 'flex-end' } },
      h('div', null, 'still have a'),
      h(
        'div',
        {
          style: {
            display: 'flex',
            marginLeft: 18,
            background: '#d6ff4a',
            color: '#14180a',
            padding: '0 14px 6px',
          },
        },
        'pulse?',
      ),
    ),
  ),
  h(
    'div',
    { style: { display: 'flex', marginTop: 'auto', fontSize: 28, color: '#9a9486' } },
    'Paste a key. We ask the provider once.',
  ),
)

const apple = h(
  'div',
  {
    style: {
      width: '180px',
      height: '180px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#090a08',
    },
  },
  h(
    'svg',
    { width: '132', height: '132', viewBox: '0 0 32 32', style: { display: 'flex' } },
    h('path', {
      d: 'M3 17.5h6.2l2.4-7.5 4.4 15.2 2.6-7.7H29',
      fill: 'none',
      stroke: '#d6ff4a',
      strokeWidth: '2.6',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }),
  ),
)

await writeImage(og, 1200, 630, new URL('../public/og-image.png', import.meta.url))
await writeImage(apple, 180, 180, new URL('../public/apple-touch-icon.png', import.meta.url))

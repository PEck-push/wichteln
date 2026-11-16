import type { ReactNode } from 'react'

const rnd = (i: number) => {
  const x = Math.sin(i * 999.13) * 10000
  return x - Math.floor(x)
}

/** Holly wreath framing a portrait. */
export function Wreath({ children, size }: { children: ReactNode; size: number }) {
  const leaves = 34
  return (
    <div className="wreath" style={{ width: size, height: size }}>
      <svg viewBox="-100 -100 200 200" className="wreath__svg" aria-hidden="true">
        <defs>
          <linearGradient id="leaf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3f9a63" />
            <stop offset="1" stopColor="#0d3a25" />
          </linearGradient>
          <radialGradient id="berry" cx="35%" cy="30%" r="70%">
            <stop offset="0" stopColor="#ff8a7e" />
            <stop offset=".5" stopColor="#d42a30" />
            <stop offset="1" stopColor="#5c0b0f" />
          </radialGradient>
        </defs>
        <circle r="86" fill="none" stroke="#0b2c1c" strokeWidth="16" />
        {Array.from({ length: leaves }, (_, i) => {
          const a = (360 / leaves) * i + rnd(i) * 6
          const r = 82 + (i % 3) * 5
          const tilt = i % 2 ? 50 : -50
          return (
            <path
              key={i}
              d="M0 -13 C7 -9 8 -2 4 4 C6 7 3 11 0 13 C-3 11 -6 7 -4 4 C-8 -2 -7 -9 0 -13 Z"
              fill="url(#leaf)"
              stroke="#0b2c1c"
              strokeWidth=".6"
              transform={`rotate(${a}) translate(0 ${-r}) rotate(${tilt})`}
            />
          )
        })}
        {Array.from({ length: 12 }, (_, i) => {
          const a = ((360 / 12) * i + 15) * (Math.PI / 180)
          const r = 84 + rnd(i + 50) * 6
          return <circle key={i} cx={Math.sin(a) * r} cy={-Math.cos(a) * r} r={4.2 + rnd(i) * 1.4} fill="url(#berry)" />
        })}
        <g transform="translate(0 86)">
          <path d="M0 0 C-14 -18 -34 -14 -30 0 C-34 14 -14 18 0 0 Z" fill="url(#berry)" />
          <path d="M0 0 C14 -18 34 -14 30 0 C34 14 14 18 0 0 Z" fill="url(#berry)" />
          <path d="M-4 2 L-16 26 L-8 24 L-4 30 Z M4 2 L16 26 L8 24 L4 30 Z" fill="#a61e23" />
          <circle r="6" fill="#d42a30" stroke="#5c0b0f" strokeWidth="1" />
        </g>
      </svg>
      <div className="wreath__inner">{children}</div>
    </div>
  )
}

/** String of fairy lights draped along the top edge. */
export function Garland() {
  const n = 9
  const pts = Array.from({ length: n }, (_, i) => {
    const t = (i + 0.5) / n
    const x = t * 400
    const y = 14 + Math.sin(t * Math.PI * 3) * 6 + 10 * Math.sin(t * Math.PI)
    return [x, y] as const
  })
  const colors = ['#ff5a4e', '#ffd25a', '#4fd17f', '#5ab4ff', '#ff5a4e', '#ffd25a', '#4fd17f', '#ff9a3c', '#5ab4ff']
  return (
    <svg className="garland" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true">
      <path d="M-10 8 Q 66 46 133 22 T 266 24 T 410 8" fill="none" stroke="#1b1208" strokeWidth="1.6" />
      {pts.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y + 4}) rotate(${(i % 2 ? 1 : -1) * 12})`}>
          <circle cy="10" r="14" fill={colors[i]} opacity=".22" className="garland__glow" />
          <rect x="-2.5" y="-2" width="5" height="5" rx="1" fill="#2a2a2a" />
          <path d="M0 2 C5 4 5 14 0 17 C-5 14 -5 4 0 2 Z" fill={colors[i]} />
          <ellipse cx="-1.4" cy="7" rx="1" ry="2.4" fill="#fff" opacity=".7" />
        </g>
      ))}
    </svg>
  )
}

/** Satin bow for gift cards. */
export function Bow({ className = '' }: { className?: string }) {
  return (
    <svg className={`bow ${className}`} viewBox="-40 -24 80 44" aria-hidden="true">
      <defs>
        <linearGradient id="satin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff1b8" />
          <stop offset=".5" stopColor="#e2a83c" />
          <stop offset="1" stopColor="#9a6514" />
        </linearGradient>
      </defs>
      <path d="M0 0 C-10 -22 -38 -20 -34 -4 C-32 8 -12 6 0 0 Z" fill="url(#satin)" stroke="#7a4d0e" strokeWidth="1" />
      <path d="M0 0 C10 -22 38 -20 34 -4 C32 8 12 6 0 0 Z" fill="url(#satin)" stroke="#7a4d0e" strokeWidth="1" />
      <path d="M-3 2 L-14 18 L-6 16 L-2 20 Z M3 2 L14 18 L6 16 L2 20 Z" fill="#c8902a" stroke="#7a4d0e" strokeWidth=".8" />
      <ellipse rx="6.5" ry="5.5" fill="url(#satin)" stroke="#7a4d0e" strokeWidth="1" />
      <path d="M-26 -10 C-20 -14 -12 -12 -8 -6" stroke="#fff" strokeWidth="1.6" fill="none" opacity=".6" />
    </svg>
  )
}

import type { Person } from '../characters'

const COLORS = ['#c8262c', '#1d5a3c', '#e9dcc6', '#a61e23', '#246b48', '#f3e8d4']
const INK = ['#fff8ee', '#fff8ee', '#2b1a12', '#fff8ee', '#fff8ee', '#2b1a12']

type Props = { names: Person[]; locked: Person[]; rotation: number }

const R = 150
const polar = (deg: number, r = R) => {
  const a = ((deg - 90) * Math.PI) / 180
  return [r * Math.cos(a), r * Math.sin(a)] as const
}

/** Pure SVG wheel. Segment i spans [i*seg, (i+1)*seg] clockwise from 12 o'clock. */
export function Wheel({ names, locked, rotation }: Props) {
  const seg = 360 / names.length
  const bulbs = 24
  return (
    <div className="wheel">
      <svg viewBox="-180 -180 360 360" className="wheel__svg" aria-hidden="true">
        <defs>
          <radialGradient id="rim" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffe39a" />
            <stop offset="100%" stopColor="#c8902a" />
          </radialGradient>
          <radialGradient id="hub" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#fff8ee" />
            <stop offset="100%" stopColor="#e7c98c" />
          </radialGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.35" />
          </filter>
        </defs>
        <circle r="172" fill="url(#rim)" filter="url(#soft)" />
        <circle r="160" fill="#7a1418" />
        <g style={{ transform: `rotate(${rotation}deg)` }}>
          {names.map((name, i) => {
            const a0 = i * seg
            const a1 = (i + 1) * seg
            const [x0, y0] = polar(a0)
            const [x1, y1] = polar(a1)
            const large = seg > 180 ? 1 : 0
            const isLocked = locked.includes(name)
            const mid = a0 + seg / 2
            const color = COLORS[i % COLORS.length]
            return (
              <g key={name}>
                <path
                  d={`M0 0 L${x0} ${y0} A${R} ${R} 0 ${large} 1 ${x1} ${y1} Z`}
                  fill={color}
                  stroke="#f2c45a"
                  strokeWidth="2"
                />
                {isLocked && <path d={`M0 0 L${x0} ${y0} A${R} ${R} 0 ${large} 1 ${x1} ${y1} Z`} fill="#0f3323" opacity="0.55" />}
                <g transform={`rotate(${mid - 90})`}>
                  <text
                    className="wheel__label"
                    x={R * 0.56}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isLocked ? 'rgba(255,248,238,0.55)' : INK[i % INK.length]}
                    fontSize={28}
                  >
                    {name}
                  </text>
                  {isLocked && (
                    <g transform={`translate(${R * 0.92} 0) rotate(90) scale(0.8)`} fill="rgba(255,248,238,0.85)">
                      <rect x="-8" y="-3" width="16" height="12" rx="2.5" />
                      <path d="M-5 -3v-3a5 5 0 0 1 10 0v3" fill="none" stroke="rgba(255,248,238,0.85)" strokeWidth="2.4" />
                    </g>
                  )}
                </g>
              </g>
            )
          })}
        </g>
        {Array.from({ length: bulbs }, (_, i) => {
          const [x, y] = polar((360 / bulbs) * i, 166)
          return <circle key={i} cx={x} cy={y} r="3.6" className={`bulb ${i % 2 ? 'bulb--b' : ''}`} />
        })}
        <circle r="30" fill="url(#hub)" stroke="#c8902a" strokeWidth="3" />
        <path d="M0 -14 L4 -4 L14 -4 L6 3 L9 13 L0 7 L-9 13 L-6 3 L-14 -4 L-4 -4 Z" fill="#c8262c" />
      </svg>
      <svg className="wheel__pointer" viewBox="0 0 40 52" aria-hidden="true">
        <path d="M20 50 L4 18 A17 17 0 1 1 36 18 Z" fill="#f2c45a" stroke="#8a5a12" strokeWidth="2" />
        <circle cx="20" cy="17" r="7" fill="#c8262c" />
      </svg>
    </div>
  )
}

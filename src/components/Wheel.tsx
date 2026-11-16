import type { Person } from '../characters'

type Props = { names: Person[]; rotation: number; spinning: boolean; restRotation?: number }

const R = 150
const polar = (deg: number, r = R) => {
  const a = ((deg - 90) * Math.PI) / 180
  return [r * Math.cos(a), r * Math.sin(a)] as const
}
// wrapping-paper palette: [inner, mid, outer, ink]
const PAPER = [
  ['#7d1015', '#c8262c', '#e8443f', '#fff8ee'],
  ['#0d3a25', '#1d6b45', '#2f8a5b', '#fff8ee'],
  ['#c9b48e', '#f4e9d2', '#fffaf0', '#7d1015'],
] as const

/** Layered SVG wheel: metallic rim, shaded wrapping-paper segments, glowing bulbs, gold hub. */
export function Wheel({ names, rotation, spinning, restRotation = 0 }: Props) {
  const seg = 360 / names.length
  const bulbs = 20
  return (
    <div className={`wheel ${spinning ? 'is-spinning' : ''}`}>
      <svg viewBox="-190 -190 380 380" className="wheel__svg" aria-hidden="true">
        <defs>
          <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff4c8" />
            <stop offset=".22" stopColor="#e8b04a" />
            <stop offset=".45" stopColor="#8a5a12" />
            <stop offset=".62" stopColor="#f6d47e" />
            <stop offset=".8" stopColor="#b47b1e" />
            <stop offset="1" stopColor="#fff0b8" />
          </linearGradient>
          {PAPER.map(([a, b, c], i) => (
            <radialGradient key={i} id={`paper${i}`} cx="0" cy="0" r={R} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor={a} />
              <stop offset=".55" stopColor={b} />
              <stop offset="1" stopColor={c} />
            </radialGradient>
          ))}
          <pattern id="stripes" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <rect width="4" height="10" fill="#fff" />
          </pattern>
          <radialGradient id="depth" cx="0" cy="0" r={R} gradientUnits="userSpaceOnUse">
            <stop offset=".72" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity=".38" />
          </radialGradient>
          <radialGradient id="bulb" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#fffbe8" />
            <stop offset=".35" stopColor="#ffe08a" />
            <stop offset=".6" stopColor="#ffb83d" stopOpacity=".55" />
            <stop offset="1" stopColor="#ff9a1f" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hubGold" cx="35%" cy="30%" r="75%">
            <stop offset="0" stopColor="#fff6d0" />
            <stop offset=".45" stopColor="#e6ae45" />
            <stop offset="1" stopColor="#7a4d0e" />
          </radialGradient>
          <radialGradient id="hubRed" cx="35%" cy="30%" r="75%">
            <stop offset="0" stopColor="#ff7a6e" />
            <stop offset=".5" stopColor="#c8262c" />
            <stop offset="1" stopColor="#5c0b0f" />
          </radialGradient>
          <linearGradient id="glare" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".28" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <filter id="drop" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#000" floodOpacity=".45" />
          </filter>
          <filter id="txt" x="-20%" y="-50%" width="140%" height="200%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#000" floodOpacity=".45" />
          </filter>
        </defs>

        {/* metallic rim */}
        <circle r="182" fill="url(#gold)" filter="url(#drop)" />
        <circle r="170" fill="none" stroke="#5c3a08" strokeWidth="1.5" opacity=".6" />
        <circle r="162" fill="#5c0b0f" />
        <circle r="158" fill="none" stroke="url(#gold)" strokeWidth="3" />

        {/* segments */}
        <g style={{ transform: `rotate(${rotation}deg)` }}>
          {names.map((name, i) => {
            const a0 = i * seg
            const a1 = (i + 1) * seg
            const [x0, y0] = polar(a0)
            const [x1, y1] = polar(a1)
            const d = `M0 0 L${x0} ${y0} A${R} ${R} 0 ${seg > 180 ? 1 : 0} 1 ${x1} ${y1} Z`
            const k = i % PAPER.length
            const mid = a0 + seg / 2
            // orient labels for where the wheel comes to rest, so the winner reads upright at the pointer
            const screen = (((mid + restRotation) % 360) + 360) % 360
            const flip = screen > 90 && screen < 270
            return (
              <g key={name}>
                <path d={d} fill={`url(#paper${k})`} />
                <path d={d} fill="url(#stripes)" opacity={k === 2 ? 0.18 : 0.07} />
                <g transform={`rotate(${mid}) translate(0 ${-R * 0.64}) rotate(${flip ? 180 : 0})`}>
                  <text
                    className="wheel__label"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={PAPER[k][3]}
                    fontSize={names.length > 5 ? 26 : 30}
                    filter={k === 2 ? undefined : 'url(#txt)'}
                  >
                    {name}
                  </text>
                </g>
              </g>
            )
          })}
          {/* gold separators with studs */}
          {names.map((_, i) => {
            const [x, y] = polar(i * seg)
            const [sx, sy] = polar(i * seg, R - 8)
            return (
              <g key={`s${i}`}>
                <line x1="0" y1="0" x2={x} y2={y} stroke="url(#gold)" strokeWidth="3.5" />
                <circle cx={sx} cy={sy} r="4.5" fill="url(#hubGold)" stroke="#7a4d0e" strokeWidth=".8" />
              </g>
            )
          })}
        </g>

        {/* depth + glass glare (static, does not rotate) */}
        <circle r={R} fill="url(#depth)" pointerEvents="none" />
        <ellipse cx="0" cy="-70" rx="120" ry="70" fill="url(#glare)" pointerEvents="none" />

        {/* marquee bulbs on the rim */}
        {Array.from({ length: bulbs }, (_, i) => {
          const [x, y] = polar((360 / bulbs) * i, 176)
          return (
            <g key={i} className={`bulb ${i % 2 ? 'bulb--b' : 'bulb--a'}`} transform={`translate(${x} ${y})`}>
              <circle r="11" fill="url(#bulb)" className="bulb__halo" />
              <circle r="3.8" fill="#fffbe8" stroke="#a8741c" strokeWidth=".8" />
            </g>
          )
        })}

        {/* ornament hub */}
        <circle r="36" fill="url(#hubGold)" stroke="#5c3a08" strokeWidth="1.2" filter="url(#drop)" />
        <circle r="27" fill="url(#hubRed)" />
        <path d="M0 -15 L4.4 -4.6 L15 -4.6 L6.4 2.4 L9.6 13.4 L0 6.8 L-9.6 13.4 L-6.4 2.4 L-15 -4.6 L-4.4 -4.6 Z" fill="url(#hubGold)" />
        <ellipse cx="-8" cy="-12" rx="9" ry="5" fill="#fff" opacity=".35" transform="rotate(-30 -8 -12)" />
      </svg>

      {/* pointer: a glass bauble with gold cap */}
      <svg className="wheel__pointer" viewBox="-6 -6 60 84" aria-hidden="true">
        <defs>
          <radialGradient id="bauble" cx="35%" cy="30%" r="75%">
            <stop offset="0" stopColor="#ff8a7e" />
            <stop offset=".45" stopColor="#d42a30" />
            <stop offset="1" stopColor="#5c0b0f" />
          </radialGradient>
          <linearGradient id="cap" x1="0" x2="1">
            <stop offset="0" stopColor="#8a5a12" />
            <stop offset=".5" stopColor="#fff0b8" />
            <stop offset="1" stopColor="#8a5a12" />
          </linearGradient>
        </defs>
        <path d="M24 72 L8 34 A20 20 0 1 1 40 34 Z" fill="url(#bauble)" stroke="#5c0b0f" strokeWidth="1.5" />
        <ellipse cx="16" cy="18" rx="6" ry="9" fill="#fff" opacity=".45" transform="rotate(25 16 18)" />
        <rect x="16" y="-2" width="16" height="9" rx="2" fill="url(#cap)" stroke="#5c3a08" strokeWidth=".8" />
        <path d="M21 0 a3 3 0 0 1 6 0" fill="none" stroke="#c8902a" strokeWidth="2" transform="translate(0 -2)" />
      </svg>
    </div>
  )
}

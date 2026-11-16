import { useEffect, useRef, useState } from 'react'
import { Wheel } from '../components/Wheel'
import { Garland } from '../components/Decor'
import type { Person } from '../characters'
import { chime, haptic, tick } from '../lib/audio'

type Props = { names: Person[]; result: Person; onDone: () => void }

const DURATION = 5600
const SPINS = 6
// ease-out without overshoot (tasteskill: no bounce)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4)

export function Spin({ names, result, onDone }: Props) {
  const [rot, setRot] = useState(0)
  const [phase, setPhase] = useState<'spin' | 'stop'>('spin')
  const [rest, setRest] = useState(0)
  const done = useRef(onDone)
  done.current = onDone

  useEffect(() => {
    const seg = 360 / names.length
    const i = names.indexOf(result)
    const offset = (Math.random() - 0.5) * seg * 0.6 // land somewhere inside the segment, never on a line
    const target = SPINS * 360 + ((((-(i * seg + seg / 2 + offset)) % 360) + 360) % 360)
    setRest(target)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reduce ? 600 : DURATION
    let raf = 0
    let lastSeg = 0
    const start = performance.now()
    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const r = target * easeOut(t)
      setRot(r)
      const s = Math.floor((r + seg / 2) / seg)
      if (s !== lastSeg) {
        lastSeg = s
        tick()
        haptic(6)
      }
      if (t < 1) raf = requestAnimationFrame(frame)
      else {
        setPhase('stop')
        chime()
        haptic(30)
        setTimeout(() => done.current(), 1100)
      }
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [names, result])

  return (
    <div className={`screen spin is-${phase}`}>
      <div className="backdrop" aria-hidden="true" />
      <Garland />
      <header className="spin__head">
        <p className="spin__kicker">Du beschenkst heuer …</p>
        <p className="display title spin__live" aria-live="polite">{phase === 'stop' ? result : ' '}</p>
      </header>
      <div className="spin__stage">
        <Wheel names={names} rotation={rot} spinning={phase === "spin"} restRotation={rest} />
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { CandyCaneBar } from '../components/CandyCaneBar'
import { CHARACTERS, PEOPLE } from '../characters'
import { fetchState, type PublicState } from '../lib/api'

const MIN_MS = 2200

/** Preloads everything the next screens need and reports real progress. */
export function Loading({ onDone }: { onDone: (s: PublicState | null) => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let cancelled = false
    const start = performance.now()
    const tasks: Array<[number, () => Promise<unknown>]> = [
      [5, () => loadImage('/bg.jpg')],
      [2, () => document.fonts.load('40px "Jolly Christmas"')],
      [3, () => fetch('/music/loop.mp3').then((r) => r.blob())],
      [1, () => fetchState()],
      ...PEOPLE.flatMap((p) => [
        [0.5, () => loadImage(CHARACTERS[p].image)] as [number, () => Promise<unknown>],
        [0.5, () => fetch(CHARACTERS[p].audio).then((r) => (r.ok ? r.blob() : null))] as [number, () => Promise<unknown>],
      ]),
    ]
    const total = tasks.reduce((s, [w]) => s + w, 0)
    let loaded = 0
    let real = 0
    let state: PublicState | null = null

    const step = () => {
      if (cancelled) return
      const t = Math.min(1, (performance.now() - start) / MIN_MS)
      // never run ahead of the real load, never jump faster than the minimum show time
      const shown = Math.min(real, 1 - Math.pow(1 - t, 2))
      setProgress(shown)
      if (shown >= 1) {
        setTimeout(() => !cancelled && onDone(state), 260)
        return
      }
      requestAnimationFrame(step)
    }
    requestAnimationFrame(step)

    tasks.forEach(([w, fn], i) =>
      fn()
        .then((v) => { if (i === 3) state = v as PublicState })
        .catch(() => undefined)
        .finally(() => { loaded += w; real = loaded / total }),
    )
    return () => { cancelled = true }
  }, [onDone])

  return (
    <div className="screen loading">
      <div className="loading__bg" aria-hidden="true" />
      <div className="loading__body">
        <h1 className="display title loading__title">Wichteln ’26</h1>
        <p className="loading__sub">Der Wichtel steht grad vom Sessel auf …</p>
        <CandyCaneBar value={progress} />
        <p className="loading__pct" aria-hidden="true">{Math.round(progress * 100)} %</p>
      </div>
    </div>
  )
}

function loadImage(src: string) {
  return new Promise<void>((res) => {
    const img = new Image()
    img.onload = () => (img.decode ? img.decode().catch(() => undefined).then(() => res()) : res())
    img.onerror = () => res()
    img.src = src
  })
}

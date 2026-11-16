import { useEffect, useRef } from 'react'

/** Calm, linear snow drift on a canvas. Holds still under reduced motion. */
export function Snowfall({ density = 70 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0, raf = 0
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    type Flake = { x: number; y: number; r: number; v: number; drift: number; phase: number; a: number }
    let flakes: Flake[] = []
    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      flakes = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.8 + Math.random() * 2.4,
        v: 12 + Math.random() * 30,
        drift: 6 + Math.random() * 14,
        phase: Math.random() * Math.PI * 2,
        a: 0.35 + Math.random() * 0.55,
      }))
    }
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      for (const f of flakes) {
        const x = f.x + Math.sin(t / 1000 + f.phase) * f.drift
        ctx.globalAlpha = f.a
        ctx.beginPath()
        ctx.arc(x, f.y, f.r, 0, Math.PI * 2)
        ctx.fillStyle = '#fff'
        ctx.fill()
      }
    }
    let last = performance.now()
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000)
      last = t
      for (const f of flakes) {
        f.y += f.v * dt
        if (f.y > h + 4) { f.y = -4; f.x = Math.random() * w }
      }
      draw(t)
      raf = requestAnimationFrame(loop)
    }
    resize()
    if (reduce) draw(0)
    else raf = requestAnimationFrame(loop)
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const vis = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden && !reduce) { last = performance.now(); raf = requestAnimationFrame(loop) }
    }
    document.addEventListener('visibilitychange', vis)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); document.removeEventListener('visibilitychange', vis) }
  }, [density])
  return <canvas ref={ref} className="snow" aria-hidden="true" />
}

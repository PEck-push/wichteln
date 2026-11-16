import { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Avatar } from '../components/Avatar'
import type { Person } from '../characters'

const enter = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }

export function Result({ me, to, fresh, onClose }: { me: Person; to: Person; fresh: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!fresh || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const colors = ['#c8262c', '#1d5a3c', '#f2c45a', '#fff8ee']
    const shoot = (x: number, angle: number) =>
      confetti({ particleCount: 70, spread: 70, startVelocity: 48, origin: { x, y: 0.75 }, angle, colors, scalar: 1.05, disableForReducedMotion: true })
    shoot(0.1, 60)
    shoot(0.9, 120)
    const t = setTimeout(() => confetti({ particleCount: 90, spread: 120, origin: { y: 0.35 }, colors, disableForReducedMotion: true }), 380)
    return () => clearTimeout(t)
  }, [fresh])

  return (
    <div className="screen result">
      <div className="backdrop" aria-hidden="true" />
      <div className="result__body">
        <motion.p className="result__kicker" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={enter}>
          {me}, du beschenkst heuer
        </motion.p>
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...enter, duration: 0.9 }}>
          <Avatar person={to} size={180} className="result__avatar" />
        </motion.div>
        <motion.h1 className="display result__name" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...enter, delay: 0.12 }}>
          {to}
        </motion.h1>
        <motion.p className="result__secret" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...enter, delay: 0.24 }}>
          Psst – des bleibt unter uns!
        </motion.p>
      </div>
      <div className="dock">
        <button className="btn btn--primary" onClick={onClose}>Fertig</button>
      </div>
    </div>
  )
}

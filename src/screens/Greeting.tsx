import { motion } from 'framer-motion'
import { Avatar } from '../components/Avatar'
import { Garland, Wreath } from '../components/Decor'
import { CHARACTERS, type Person } from '../characters'
import { playVoice } from '../lib/audio'

const enter = { duration: 0.52, ease: [0.22, 1, 0.36, 1] as const }

export function Greeting({ me, busy, onGo, onBack }: { me: Person; busy: boolean; onGo: () => void; onBack: () => void }) {
  return (
    <div className="screen greet">
      <div className="backdrop" aria-hidden="true" />
      <Garland />
      <div className="greet__body">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
          <Wreath size={220}><Avatar person={me} size={150} className="greet__avatar" /></Wreath>
        </motion.div>
        <motion.h1 className="display title greet__name" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...enter, delay: 0.15 }}>
          Servas, {me}!
        </motion.h1>
      </div>
      <motion.div className="dock" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...enter, delay: 0.39 }}>
        <button className="btn btn--primary btn--go" onClick={onGo} disabled={busy}>
          {busy ? 'Der Wichtel mischt …' : 'Los!'}
        </button>
        <div className="greet__links">
          <button className="link" onClick={() => playVoice(CHARACTERS[me].audio)}>Nochmal anhören</button>
          <button className="link" onClick={onBack}>Doch nicht ich</button>
        </div>
      </motion.div>
    </div>
  )
}

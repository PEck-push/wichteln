import { motion } from 'framer-motion'

export function Privacy({ onClose }: { onClose: () => void }) {
  return (
    <motion.div className="sheet-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={onClose}>
      <motion.div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-h"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 12, opacity: 0 }}
        transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="privacy-h">Datenschutz</h2>
        <p>Diese App ist ein privates Familien-Wichteln. Gespeichert wird nur, <strong>wer schon gezogen hat</strong> und <strong>wer wen beschenkt</strong> – sonst nichts.</p>
        <ul>
          <li>Speicherort: Upstash Redis, Rechenzentrum Frankfurt (EU). Die Daten löschen sich automatisch nach 90 Tagen.</li>
          <li>Auf deinem Handy merken wir uns (localStorage) nur deinen Namen und dein Ergebnis, damit du es wieder ansehen kannst. Keine Cookies, kein Tracking, keine Analyse.</li>
          <li>Gehostet bei Vercel (Funktionen in Frankfurt). Der Hoster verarbeitet technisch bedingt IP-Adressen in Server-Logs.</li>
          <li>Schriften und Musik werden von dieser Seite selbst geladen, nicht von Drittanbietern.</li>
        </ul>
        <button className="btn btn--primary" onClick={onClose}>Alles klar</button>
      </motion.div>
    </motion.div>
  )
}

import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CHARACTERS, PEOPLE, type Person } from './characters'
import { DrawError, draw, fetchState, type PublicState } from './lib/api'
import { enterFullscreen, playVoice, startMusic, stopVoice } from './lib/audio'
import { forget, loadSaved, save, type Saved } from './lib/memory'
import { Loading } from './screens/Loading'
import { Hero } from './screens/Hero'
import { PickName } from './screens/PickName'
import { Greeting } from './screens/Greeting'
import { Spin } from './screens/Spin'
import { Result } from './screens/Result'
import { Snowfall } from './components/Snowfall'
import { MuteToggle } from './components/MuteToggle'
import { Privacy } from './components/Privacy'
import './app.css'

type Step = 'loading' | 'hero' | 'pick' | 'greet' | 'spin' | 'result'

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, transition: { duration: 0.28, ease: [0.2, 0.8, 0.2, 1] as const } },
}

export default function App() {
  const [step, setStep] = useState<Step>('loading')
  const [state, setState] = useState<PublicState | null>(null)
  const [me, setMe] = useState<Person | null>(null)
  const [wheel, setWheel] = useState<{ names: Person[]; locked: Person[]; to: Person } | null>(null)
  const [saved, setSaved] = useState<Saved | null>(() => loadSaved())
  const [fresh, setFresh] = useState(false)
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [privacy, setPrivacy] = useState(false)

  const flash = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3600)
  }

  const refresh = useCallback(async () => {
    try {
      const s = await fetchState()
      setState(s)
      // server was reset (new round) → forget the stale device result
      const local = loadSaved()
      if (local && !s.done.includes(local.me)) {
        forget()
        setSaved(null)
      }
      return s
    } catch {
      return null
    }
  }, [])

  const onLoaded = useCallback((s: PublicState | null) => {
    if (s) setState(s)
    const local = loadSaved()
    if (s && local && !s.done.includes(local.me)) { forget(); setSaved(null) }
    setStep('hero')
  }, [])

  const onStart = () => {
    enterFullscreen()
    void startMusic()
    void refresh()
    setStep('pick')
  }

  const onPick = (p: Person) => {
    setMe(p)
    // started inside the tap so iOS lets it play
    void playVoice(CHARACTERS[p].audio)
    setStep('greet')
  }

  const onGo = async () => {
    if (!me) return
    setBusy(true)
    stopVoice()
    try {
      const before = (await refresh()) ?? state
      const { to, token } = await draw(me)
      const names = PEOPLE.filter((p) => p !== me)
      const locked = (before?.drawn ?? []).filter((p) => p !== to)
      const s: Saved = { me, to, token }
      save(s)
      setSaved(s)
      setFresh(true)
      setWheel({ names, locked, to })
      setStep('spin')
    } catch (e) {
      if (e instanceof DrawError && e.status === 409) {
        flash(`Für ${me} wurde schon gezogen.`)
        await refresh()
        setStep('pick')
      } else {
        flash('Keine Verbindung zum Nordpol – bitte nochmal probieren.')
      }
    } finally {
      setBusy(false)
    }
  }

  const showSaved = async () => {
    if (!saved) return
    try {
      // confirm against the server with this device's token
      await draw(saved.me, saved.token)
      setFresh(false)
      setStep('result')
    } catch {
      forget()
      setSaved(null)
      flash('Dein Ergebnis ist nicht mehr gültig.')
    }
  }

  const resultFor = step === 'result' && saved ? saved : null

  return (
    <>
      <main className="device">
        <Snowfall density={step === 'hero' ? 55 : 40} />
        <AnimatePresence mode="sync">
          <motion.div key={step} className="screen-wrap" {...fade}>
            {step === 'loading' && <Loading onDone={onLoaded} />}
            {step === 'hero' && <Hero onStart={onStart} />}
            {step === 'pick' && (
              <PickName
                done={state?.done ?? []}
                saved={saved}
                onPick={onPick}
                onShowSaved={showSaved}
                onPrivacy={() => setPrivacy(true)}
              />
            )}
            {step === 'greet' && me && (
              <Greeting me={me} busy={busy} onGo={onGo} onBack={() => { stopVoice(); setStep('pick') }} />
            )}
            {step === 'spin' && wheel && me && (
              <Spin names={wheel.names} locked={wheel.locked} result={wheel.to} onDone={() => setStep('result')} />
            )}
            {resultFor && (
              <Result me={resultFor.me} to={resultFor.to} fresh={fresh} onClose={() => { setFresh(false); void refresh(); setStep('hero') }} />
            )}
          </motion.div>
        </AnimatePresence>
        {step !== 'loading' && <MuteToggle />}
        <AnimatePresence>
          {toast && (
            <motion.div className="toast" role="status" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>{privacy && <Privacy onClose={() => setPrivacy(false)} />}</AnimatePresence>
      </main>
      <p className="desk-hint">Am schönsten am Handy – einfach den Link aufs Handy schicken.</p>
    </>
  )
}

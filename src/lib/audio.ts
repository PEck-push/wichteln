// Web Audio graph so ducking works on iOS (HTMLMediaElement.volume is read-only there).
let ctx: AudioContext | null = null
let musicGain: GainNode | null = null
let music: HTMLAudioElement | null = null
let muted = false
const MUSIC_LEVEL = 0.45
const DUCK_LEVEL = 0.08

function ensure() {
  if (ctx) return ctx
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  ctx = new AC()
  music = new Audio('/music/loop.mp3')
  music.loop = true
  music.preload = 'auto'
  const src = ctx.createMediaElementSource(music)
  musicGain = ctx.createGain()
  musicGain.gain.value = 0
  src.connect(musicGain).connect(ctx.destination)
  return ctx
}

/** Must be called from a user gesture. */
export async function startMusic() {
  const c = ensure()
  if (c.state === 'suspended') await c.resume()
  try {
    await music!.play()
  } catch {
    return
  }
  ramp(muted ? 0 : MUSIC_LEVEL, 1.2)
  void loadSfx()
}
export const hasSfx = (name: Sfx) => Boolean(buffers[name])
/** Duck the background music while an effect plays. */
export function duck(on: boolean) {
  ramp(muted ? 0 : on ? DUCK_LEVEL * 2 : MUSIC_LEVEL, on ? 0.3 : 1.2)
}

function ramp(to: number, seconds: number) {
  if (!ctx || !musicGain) return
  const t = ctx.currentTime
  musicGain.gain.cancelScheduledValues(t)
  musicGain.gain.setValueAtTime(musicGain.gain.value, t)
  musicGain.gain.linearRampToValueAtTime(to, t + seconds)
}

export function setMuted(m: boolean) {
  muted = m
  ramp(m ? 0 : MUSIC_LEVEL, 0.3)
  if (voice) voice.muted = m
}
export const isMuted = () => muted

let voice: HTMLAudioElement | null = null

/** Plays a voice clip with the music ducked. Resolves when done (or immediately if missing). */
export function playVoice(src: string): Promise<void> {
  stopVoice()
  return new Promise((resolve) => {
    const a = new Audio(src)
    voice = a
    a.muted = muted
    const end = () => {
      if (voice === a) voice = null
      ramp(muted ? 0 : MUSIC_LEVEL, 0.8)
      resolve()
    }
    a.addEventListener('ended', end, { once: true })
    a.addEventListener('error', end, { once: true })
    ramp(muted ? 0 : DUCK_LEVEL, 0.4)
    a.play().catch(end)
  })
}
export function stopVoice() {
  if (voice) {
    voice.pause()
    voice = null
    ramp(muted ? 0 : MUSIC_LEVEL, 0.8)
  }
}

// Sound effects decoded into Web Audio buffers (reliable timing, works on iOS once unlocked).
const SFX = { wheel: '/sfx/wheel.mp3', win: '/sfx/win.mp3' } as const
type Sfx = keyof typeof SFX
const buffers: Partial<Record<Sfx, AudioBuffer>> = {}
let sfxSource: AudioBufferSourceNode | null = null

/** Decode effects after the first gesture (call from startMusic). */
async function loadSfx() {
  const c = ensure()
  await Promise.all(
    (Object.keys(SFX) as Sfx[]).map(async (k) => {
      if (buffers[k]) return
      try {
        const data = await (await fetch(SFX[k])).arrayBuffer()
        buffers[k] = await c.decodeAudioData(data)
      } catch {
        /* effect missing: stay silent */
      }
    }),
  )
}

export function playSfx(name: Sfx, volume = 1) {
  if (!ctx || muted) return
  const buf = buffers[name]
  if (!buf) return
  stopSfx()
  const src = ctx.createBufferSource()
  const g = ctx.createGain()
  g.gain.value = volume
  src.buffer = buf
  src.connect(g).connect(ctx.destination)
  src.start()
  sfxSource = src
}
export function stopSfx() {
  try {
    sfxSource?.stop()
  } catch {
    /* already stopped */
  }
  sfxSource = null
}

/** Short wooden tick (fallback if the wheel sound could not load). */
export function tick() {
  if (!ctx || muted) return
  const t = ctx.currentTime
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = 'triangle'
  o.frequency.setValueAtTime(1800, t)
  o.frequency.exponentialRampToValueAtTime(600, t + 0.03)
  g.gain.setValueAtTime(0.18, t)
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.05)
  o.connect(g).connect(ctx.destination)
  o.start(t)
  o.stop(t + 0.06)
}

/** Bright chime for the result. */
export function chime() {
  if (!ctx || muted) return
  const t = ctx.currentTime
  ;[1318.5, 1568, 2093].forEach((f, i) => {
    const o = ctx!.createOscillator()
    const g = ctx!.createGain()
    o.type = 'sine'
    o.frequency.value = f
    g.gain.setValueAtTime(0, t + i * 0.09)
    g.gain.linearRampToValueAtTime(0.12, t + i * 0.09 + 0.01)
    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.09 + 1.2)
    o.connect(g).connect(ctx!.destination)
    o.start(t + i * 0.09)
    o.stop(t + i * 0.09 + 1.3)
  })
}

export const haptic = (ms = 8) => {
  try {
    navigator.vibrate?.(ms)
  } catch {
    /* unsupported */
  }
}

/** Fullscreen on first tap (Android/Chrome). iPhone Safari has no page fullscreen: there the home-screen web app runs fullscreen via the manifest. */
export function enterFullscreen() {
  const el = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => void }
  if (document.fullscreenElement) return
  try {
    if (el.requestFullscreen) void el.requestFullscreen({ navigationUI: 'hide' }).catch(() => undefined)
    else el.webkitRequestFullscreen?.()
  } catch {
    /* unsupported */
  }
}

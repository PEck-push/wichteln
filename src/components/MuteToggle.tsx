import { useState } from 'react'
import { isMuted, setMuted } from '../lib/audio'

export function MuteToggle() {
  const [muted, set] = useState(isMuted())
  return (
    <button
      className="mute"
      aria-label={muted ? 'Ton einschalten' : 'Ton ausschalten'}
      aria-pressed={muted}
      onClick={() => { setMuted(!muted); set(!muted) }}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path d="M4 9h3l5-4v14l-5-4H4z" fill="currentColor" />
        {muted ? (
          <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        ) : (
          <path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}
      </svg>
    </button>
  )
}

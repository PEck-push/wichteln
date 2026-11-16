import { useState } from 'react'
import { Avatar } from '../components/Avatar'
import { Garland } from '../components/Decor'
import { PEOPLE, type Person } from '../characters'
import type { Saved } from '../lib/memory'

type Props = {
  done: Person[]
  saved: Saved | null
  onPick: (p: Person) => void
  onShowSaved: () => void
  onPrivacy: () => void
}

export function PickName({ done, saved, onPick, onShowSaved, onPrivacy }: Props) {
  const [sel, setSel] = useState<Person | null>(null)
  return (
    <div className="screen pick">
      <div className="backdrop" aria-hidden="true" />
      <Garland />
      <header className="pick__head">
        <h1 className="display title pick__title">Wer bist du?</h1>
        <p className="pick__sub">{saved ? `Servas ${saved.me}, du hast schon gezogen.` : done.length >= PEOPLE.length ? 'Alle haben gezogen – frohe Weihnachten!' : 'Tipp auf deinen Namen.'}</p>
      </header>

      <div className="pick__grid" role="radiogroup" aria-label="Ich bin">
        {PEOPLE.map((p) => {
          const isDone = done.includes(p)
          const active = sel === p
          return (
            <button
              key={p}
              role="radio"
              aria-checked={active}
              disabled={isDone}
              className={`pcard ${active ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`}
              onClick={() => setSel(p)}
            >
              <Avatar person={p} size={64} className="pcard__avatar" />
              <span className="display pcard__name">{p}</span>
              {isDone && (
                <span className="pcard__lock" title="hat schon gezogen">
                  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                    <rect x="5" y="10" width="14" height="10" rx="2.5" fill="currentColor" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2.2" fill="none" />
                  </svg>
                  <span className="sr-only">hat schon gezogen</span>
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="dock">
        {saved ? (
          <button className="btn btn--primary" onClick={onShowSaved}>Mein Ergebnis ansehen</button>
        ) : (
          <button className="btn btn--primary" disabled={!sel} onClick={() => sel && onPick(sel)}>
            {sel ? `Ich bin ${sel}` : 'Namen wählen'}
          </button>
        )}
        <button className="link" onClick={onPrivacy}>Datenschutz</button>
      </div>
    </div>
  )
}

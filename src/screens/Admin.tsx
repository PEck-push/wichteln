import { useState } from 'react'
import { PEOPLE } from '../characters'

/** Minimal admin page at /admin-wichtel: status + reset (live and test). */
export function Admin() {
  const [key, setKey] = useState('')
  const [msg, setMsg] = useState('')
  const [done, setDone] = useState<{ live: string[]; test: string[] } | null>(null)

  const load = async () => {
    const [l, t] = await Promise.all([
      fetch('/api/state', { cache: 'no-store' }).then((r) => r.json()),
      fetch('/api/state?test=1', { cache: 'no-store' }).then((r) => r.json()),
    ])
    setDone({ live: l.done, test: t.done })
  }

  const reset = async (test: boolean) => {
    if (!test && !confirm('Echte Ziehung wirklich zurücksetzen? Alle müssen dann neu ziehen.')) return
    const r = await fetch(test ? '/api/test-reset' : '/api/reset', { method: 'POST', headers: { 'x-admin-key': key } })
    setMsg(r.ok ? (test ? 'Testdaten zurückgesetzt.' : 'Echte Ziehung zurückgesetzt.') : 'Falscher Admin-Schlüssel.')
    void load()
  }

  return (
    <div className="screen admin">
      <div className="backdrop" aria-hidden="true" />
      <div className="admin__card">
        <h1 className="display title">Admin</h1>
        <label className="admin__label">
          Admin-Schlüssel
          <input value={key} onChange={(e) => setKey(e.target.value)} autoCapitalize="off" autoComplete="off" />
        </label>
        <button className="btn btn--secondary admin__btn" onClick={load}>Status laden</button>
        {done && (
          <ul className="admin__list">
            {PEOPLE.map((p) => (
              <li key={p}>
                <span>{p}</span>
                <span>{done.live.includes(p) ? '✅ hat gezogen' : '—'}</span>
                <span className="admin__muted">Test: {done.test.includes(p) ? '✅' : '—'}</span>
              </li>
            ))}
          </ul>
        )}
        <button className="btn btn--secondary admin__btn" onClick={() => reset(true)}>Testdaten zurücksetzen</button>
        <button className="btn btn--primary" disabled={!key} onClick={() => reset(false)}>Echte Ziehung zurücksetzen</button>
        {msg && <p className="admin__msg" role="status">{msg}</p>}
        <a className="link" href="/">Zur App</a>
      </div>
    </div>
  )
}

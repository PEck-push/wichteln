import type { Person } from '../characters'

// Strictly functional device memory (no tracking): your own name, result and re-open token.
export type Saved = { me: Person; to: Person; token: string }
const KEY = 'wichteln26'

export function loadSaved(): Saved | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Saved) : null
  } catch {
    return null
  }
}
export function save(s: Saved) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* private mode: result simply isn't remembered */
  }
}
export function forget() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}

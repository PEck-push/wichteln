import type { Person } from '../characters'

export type PublicState = { people: Person[]; done: Person[]; drawn: Person[] }

export async function fetchState(): Promise<PublicState> {
  const r = await fetch('/api/state', { cache: 'no-store' })
  if (!r.ok) throw new Error('state')
  return r.json()
}

export class DrawError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function draw(name: Person, token?: string): Promise<{ to: Person; token: string }> {
  const r = await fetch('/api/draw', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name, token }),
  })
  const body = await r.json().catch(() => ({}))
  if (!r.ok) throw new DrawError(r.status, body.error ?? 'error')
  return body
}

import type { Person } from '../characters'
import { q } from './mode'

export type PublicState = { people: Person[]; done: Person[] }

export async function resetTest() {
  await fetch(`/api/test-reset${q}`, { method: 'POST' })
}

export async function fetchState(): Promise<PublicState> {
  const r = await fetch(`/api/state${q}`, { cache: 'no-store' })
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
  const r = await fetch(`/api/draw${q}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name, token }),
  })
  const body = await r.json().catch(() => ({}))
  if (!r.ok) throw new DrawError(r.status, body.error ?? 'error')
  return body
}

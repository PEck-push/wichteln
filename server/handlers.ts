import { randomUUID, timingSafeEqual } from 'node:crypto'
import { PEOPLE, isPerson, pick } from './draw.js'
import { getStore, type State } from './store.js'

type Res = { status: number; body: unknown }
const ok = (body: unknown): Res => ({ status: 200, body })
const err = (status: number, error: string): Res => ({ status, body: { error } })

function publicState(state: State) {
  const pairs = Object.entries(state.pairs)
  // Only who has already drawn — never which names are taken or who drew whom.
  return { people: PEOPLE, done: pairs.map(([giver]) => giver) }
}

export async function getState(test = false): Promise<Res> {
  const { state } = await getStore(test).read()
  return ok(publicState(state))
}

export async function postDraw(body: unknown, test = false): Promise<Res> {
  const { name, token } = (body ?? {}) as { name?: unknown; token?: unknown }
  if (!isPerson(name)) return err(400, 'unknown name')
  const store = getStore(test)
  for (let attempt = 0; attempt < 8; attempt++) {
    const { raw, state } = await store.read()
    const existing = state.pairs[name]
    if (existing) {
      // Re-open own result only from the device that drew it.
      if (typeof token === 'string' && token === existing.token) return ok({ to: existing.to, token })
      return err(409, 'already drawn')
    }
    const plain = Object.fromEntries(Object.entries(state.pairs).map(([g, p]) => [g, p!.to]))
    let to
    try {
      to = pick(name, plain)
    } catch {
      return err(500, 'no valid assignment left')
    }
    const next: State = { pairs: { ...state.pairs, [name]: { to, token: randomUUID() } } }
    if (await store.cas(raw, next)) return ok({ to, token: next.pairs[name]!.token })
    // someone else drew at the same moment: retry with fresh state
  }
  return err(503, 'busy, try again')
}

/** Test data only: anyone may reset it, the live draw is untouched. */
export async function postTestReset(): Promise<Res> {
  await getStore(true).reset()
  return ok({ reset: true, test: true })
}

export async function postReset(adminKey: string | null): Promise<Res> {
  const expected = process.env.ADMIN_KEY
  if (!expected || !adminKey) return err(401, 'unauthorized')
  const a = Buffer.from(adminKey)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return err(401, 'unauthorized')
  await getStore().reset()
  return ok({ reset: true })
}

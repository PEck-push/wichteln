// Server-only: the secret rules never ship to the browser bundle.
export const PEOPLE = ['Peter', 'Klaudia', 'Niki', 'Meli', 'Philipp', 'Sabsi'] as const
export type Person = (typeof PEOPLE)[number]

const FORCED: Partial<Record<Person, Person>> = { Philipp: 'Niki' }
const FORBIDDEN: Partial<Record<Person, Person[]>> = {
  Peter: ['Klaudia'],
  Sabsi: ['Philipp'],
  Niki: ['Meli'],
}

export function isPerson(x: unknown): x is Person {
  return typeof x === 'string' && (PEOPLE as readonly string[]).includes(x)
}

export function allowed(giver: Person, recipient: Person): boolean {
  if (giver === recipient) return false
  const forced = FORCED[giver]
  if (forced) return recipient === forced
  // a recipient reserved for someone else is never available
  for (const [g, r] of Object.entries(FORCED)) if (r === recipient && g !== giver) return false
  return !(FORBIDDEN[giver] ?? []).includes(recipient)
}

/** Can the givers still be matched to the free recipients? (backtracking, n <= 6) */
export function completable(givers: Person[], free: Person[]): boolean {
  if (givers.length === 0) return true
  const [g, ...rest] = givers
  return free.some((r) => allowed(g, r) && completable(rest, free.filter((x) => x !== r)))
}

/**
 * Pick a recipient for `giver` given existing pairs, so that the remaining
 * people can always still be assigned. Uniform over all safe candidates.
 */
export function pick(giver: Person, pairs: Partial<Record<Person, Person>>, rand = Math.random): Person {
  const taken = new Set(Object.values(pairs))
  const free = PEOPLE.filter((p) => !taken.has(p))
  const others = PEOPLE.filter((p) => p !== giver && !(p in pairs))
  const safe = free.filter((r) => allowed(giver, r) && completable(others, free.filter((x) => x !== r)))
  if (safe.length === 0) throw new Error('no valid assignment left')
  return safe[Math.floor(rand() * safe.length)]
}

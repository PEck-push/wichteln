import { describe, expect, it } from 'vitest'
import { PEOPLE, pick, type Person } from './draw.js'

function shuffle<T>(a: T[]): T[] {
  const b = [...a]
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  return b
}

describe('wichtel draw', () => {
  it('always completes and respects every rule (10k random orders)', () => {
    const seen: Record<string, Set<string>> = {}
    for (let run = 0; run < 10_000; run++) {
      const pairs: Partial<Record<Person, Person>> = {}
      for (const g of shuffle([...PEOPLE])) pairs[g] = pick(g, pairs)
      expect(new Set(Object.values(pairs)).size).toBe(6)
      for (const g of PEOPLE) {
        expect(pairs[g]).not.toBe(g)
        ;(seen[g] ??= new Set()).add(pairs[g]!)
      }
      expect(pairs.Philipp).toBe('Niki')
      expect(pairs.Peter).not.toBe('Klaudia')
      expect(pairs.Sabsi).not.toBe('Philipp')
      expect(pairs.Niki).not.toBe('Meli')
    }
    // still random for everyone except Philipp
    for (const g of PEOPLE) if (g !== 'Philipp') expect(seen[g].size).toBeGreaterThan(1)
  })
})

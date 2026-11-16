import { Redis } from '@upstash/redis'
import type { Person } from './draw.js'

export type Pair = { to: Person; token: string }
export type State = { pairs: Partial<Record<Person, Pair>> }

// Data deletes itself after the season (DSGVO: Speicherbegrenzung, Art. 5 Abs. 1 lit. e)
const TTL_SECONDS = 60 * 60 * 24 * 90

export interface Store {
  read(): Promise<{ raw: string; state: State }>
  /** compare-and-set: only writes if nobody changed the state since `read` */
  cas(oldRaw: string, next: State): Promise<boolean>
  reset(): Promise<void>
}

const parse = (raw: string | null): State => (raw ? (JSON.parse(raw) as State) : { pairs: {} })

class MemoryStore implements Store {
  private raw = ''
  async read() {
    return { raw: this.raw, state: parse(this.raw || null) }
  }
  async cas(oldRaw: string, next: State) {
    if (this.raw !== oldRaw) return false
    this.raw = JSON.stringify(next)
    return true
  }
  async reset() {
    this.raw = ''
  }
}

const CAS_SCRIPT = `
local cur = redis.call('GET', KEYS[1]) or ''
if cur == ARGV[1] then
  redis.call('SET', KEYS[1], ARGV[2], 'EX', tonumber(ARGV[3]))
  return 1
end
return 0`

class UpstashStore implements Store {
  private redis: Redis
  private key: string
  constructor(redis: Redis, key: string) {
    this.redis = redis
    this.key = key
  }
  async read() {
    const raw = (await this.redis.get<string>(this.key)) ?? ''
    return { raw, state: parse(raw || null) }
  }
  async cas(oldRaw: string, next: State) {
    const r = await this.redis.eval(CAS_SCRIPT, [this.key], [oldRaw, JSON.stringify(next), String(TTL_SECONDS)])
    return Number(r) === 1
  }
  async reset() {
    await this.redis.del(this.key)
  }
}

// Test mode lives in its own key: it can never touch the real draw.
const stores: Partial<Record<'live' | 'test', Store>> = {}
export function getStore(test = false): Store {
  const mode = test ? 'test' : 'live'
  const existing = stores[mode]
  if (existing) return existing
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
  const store = url && token
    ? new UpstashStore(new Redis({ url, token, automaticDeserialization: false }), `wichteln26:${mode}`)
    : new MemoryStore()
  stores[mode] = store
  return store
}

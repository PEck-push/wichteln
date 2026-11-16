import { postTestReset } from '../server/handlers.js'

export async function POST() {
  const r = await postTestReset()
  return Response.json(r.body, { status: r.status, headers: { 'cache-control': 'no-store' } })
}

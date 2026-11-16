import { getState } from '../server/handlers.js'

export async function GET() {
  const r = await getState()
  return Response.json(r.body, { status: r.status, headers: { 'cache-control': 'no-store' } })
}

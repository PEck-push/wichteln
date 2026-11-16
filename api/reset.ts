import { postReset } from '../server/handlers.js'

export async function POST(req: Request) {
  const r = await postReset(req.headers.get('x-admin-key'))
  return Response.json(r.body, { status: r.status, headers: { 'cache-control': 'no-store' } })
}

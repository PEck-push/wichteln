import { postDraw } from '../server/handlers.js'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const r = await postDraw(body)
  return Response.json(r.body, { status: r.status, headers: { 'cache-control': 'no-store' } })
}

import { postDraw } from '../server/handlers.js'

export async function POST(req: Request) {
  const test = new URL(req.url).searchParams.get('test') === '1'
  const body = await req.json().catch(() => null)
  const r = await postDraw(body, test)
  return Response.json(r.body, { status: r.status, headers: { 'cache-control': 'no-store' } })
}

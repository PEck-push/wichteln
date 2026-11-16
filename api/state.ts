import { getState } from '../server/handlers.js'

export async function GET(req: Request) {
  const test = new URL(req.url).searchParams.get('test') === '1'
  const r = await getState(test)
  return Response.json(r.body, { status: r.status, headers: { 'cache-control': 'no-store' } })
}

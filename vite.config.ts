import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Local dev: serve the same API handlers as Vercel (in-memory store, no secrets needed).
function devApi(): Plugin {
  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next()
        const h = await server.ssrLoadModule('/server/handlers.ts')
        let raw = ''
        for await (const c of req) raw += c
        const body = raw ? JSON.parse(raw) : null
        const [path, qs] = req.url.split('?')
        const test = new URLSearchParams(qs).get('test') === '1'
        const r =
          path === '/api/state' && req.method === 'GET' ? await h.getState(test)
          : path === '/api/draw' && req.method === 'POST' ? await h.postDraw(body, test)
          : path === '/api/test-reset' && req.method === 'POST' ? await h.postTestReset()
          : path === '/api/reset' && req.method === 'POST' ? await h.postReset((req.headers['x-admin-key'] as string) ?? null)
          : { status: 404, body: { error: 'not found' } }
        res.statusCode = r.status
        res.setHeader('content-type', 'application/json')
        res.end(JSON.stringify(r.body))
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), devApi()],
  server: { host: true },
})

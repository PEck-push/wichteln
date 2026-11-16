# Wichteln ’26

Mobile Wichtel-App für Peter, Klaudia, Niki, Meli, Philipp und Sabsi.
Ladescreen → Key Art („Los geht’s“) → „Wer bist du?“ → persönlicher Wichtel-Gruß → Glücksrad → Ergebnis.

**Stack:** Vite + React + TypeScript, Framer Motion, canvas-confetti · Vercel Functions (`/api`, Region `fra1`) · Upstash Redis (EU).
Spacing-, Motion- und Button-Tokens folgen dem [taste-skill](https://github.com/Leonxlnx/taste-skill) (`src/tokens.css`).

## Lokal

```bash
npm install
npm run dev        # API läuft im Vite-Server mit In-Memory-Speicher
npm test           # Simulation der Ziehungslogik (10.000 Durchläufe)
```

Reset lokal: `ADMIN_KEY=dev npm run dev`, dann `curl -XPOST -H 'x-admin-key: dev' localhost:5173/api/reset`.

## Deployment (Vercel)

1. Repo in Vercel importieren (Framework: Vite).
2. Storage → Marketplace → **Upstash Redis**, Region **Frankfurt (eu-central-1)** → mit dem Projekt verbinden
   (setzt `KV_REST_API_URL` / `KV_REST_API_TOKEN` bzw. `UPSTASH_REDIS_REST_*`).
3. Env-Variable `ADMIN_KEY` (langer Zufallswert) setzen.
4. Deploy, Link per WhatsApp an alle schicken.

Neue Runde / Löschen: `curl -XPOST -H "x-admin-key: $ADMIN_KEY" https://<domain>/api/reset`.
Ohne Reset löschen sich die Daten nach 90 Tagen selbst.

## Assets austauschen

| Datei | Zweck |
|---|---|
| `public/characters/<name>.webp` | Charakterbild (quadratisch, ≥ 512 px; `peter`, `klaudia`, `niki`, `meli`, `philipp`, `sabsi`). Fehlt es, erscheint ein Monogramm. |
| `public/characters/<name>.mp3` | Persönlicher Gruß (ElevenLabs). Fehlt er, läuft die App ohne Ton weiter. |
| `src/characters.ts` | Gruß-Untertitel pro Person |
| `public/music/loop.mp3` | Hintergrundmusik (Loop) |

## Wie die Ziehung funktioniert

Die Regeln liegen **nur am Server** (`server/draw.ts`) und kommen nie ins Browser-Bundle.
Bei jeder Ziehung bleiben nur Namen im Topf, bei denen sich alle übrigen noch gültig zuteilen lassen (Backtracking).
So entsteht nie eine Sackgasse („der Letzte zieht sich selbst“). Gleichzeitige Ziehungen sind per Compare-and-set (Redis-Lua) atomar.
Das Rad dreht nur zum Ergebnis, das der Server bestimmt hat.
Das eigene Ergebnis lässt sich nur vom ziehenden Gerät aus erneut abrufen (Token in localStorage).

## Datenschutz

- Gespeichert werden nur Vornamen und die Zuordnung, in der EU (Frankfurt), mit TTL 90 Tage.
- Keine Cookies, kein Tracking, keine Drittanbieter-Requests (Font und Musik sind selbst gehostet).
- localStorage ist rein funktional (§ 165 Abs. 3 TKG 2021), Info-Sheet „Datenschutz“ in der App, `noindex` gesetzt.
- Lizenz von Font („Jolly Christmas“) und Musik für die öffentliche Web-Nutzung prüfen (Envato-Lizenz).

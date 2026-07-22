# pra-pkl

Inventory management app — **Go backend** + **Next.js 16 frontend**.

## Startup

```sh
# Terminal 1 — backend (port 8080)
cd backend; go run main.go

# Terminal 2 — frontend (port 3000)
cd frontend; npm run dev
```

## Database

- MySQL database `db_invent`, table `users(id, email, password)`.
- Rename `db_invent.example` → `db_invent.sql`, import into MySQL.
- Default credentials: `admin@example.com` / `testingajah123`.
- Backend DSN: `root:@tcp(127.0.0.1:3306)/db_invent` (no password, no env).

## Architecture

| Layer | Dir | Tech | Entrypoint |
|-------|-----|------|------------|
| Backend | `backend/` | Go stdlib + go-sql-driver/mysql | `backend/main.go` |
| Frontend | `frontend/` | Next.js 16 App Router, Tailwind v4, TS | `frontend/app/` |

**Backend** is a single-file Go server (`backend/main.go`). Two endpoints:
- `POST /api/login` — plaintext password comparison, sets `token` cookie.
- `POST /api/logout` — clears `token` cookie.
- CORS hardcoded to `http://localhost:3000`.

**Frontend** routes: `/` (login), `/dashboard`, `/inventory`, `/reports`, `/suppliers`.
- `middleware.ts` protects all routes except `/` by checking `token` cookie.
- Login calls backend with `credentials: 'include'`.

## Lint

```sh
cd frontend; npm run lint
```

No test suite or typecheck script.

## Next.js 16 caveats

**Always read `frontend/AGENTS.md` before editing frontend code** — Next.js 16 has breaking changes from your training data. Relevant guides in `node_modules/next/dist/docs/`.

# BiyaHero Deployment

BiyaHero is configured for a Render static frontend and Render Node API. The API connects to an external MySQL server; database credentials remain server-side.

## Render Blueprint

Use the repository's `render.yaml` with Render Blueprints. It defines:

| Service | Root directory | Build command | Runtime command/output |
| --- | --- | --- | --- |
| `biyahero-api` web service | `backend` | `npm ci` | `npm start`; health check `/health` |
| `biyahero-frontend` static site | repository root | `npm ci && npm run build` | Publish `dist`; SPA fallback rewrites to `index.html` |

Do not deploy the legacy root `server/index.js`; it is a mock API. The production API entrypoint is `backend/server.js`.

After creating the services, set the backend's `FRONTEND_URL` to the actual public frontend origin. Set the frontend's `VITE_API_URL` to the actual backend origin followed by `/api/v1`, for example `https://<api-service>.onrender.com/api/v1`. Rebuild the frontend after changing this public build-time variable.

## Backend Environment

Render supplies `PORT`; do not set a fixed production port. Configure these on the API service:

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | Set to `production` |
| `API_VERSION` | `v1` |
| `DB_HOST` | Public/reachable hostname of the external MySQL server |
| `DB_PORT` | MySQL port, usually `3306` |
| `DB_NAME` | BiyaHero schema/database name |
| `DB_USER` | Dedicated database user |
| `DB_PASSWORD` | Database password; keep in Render secrets |
| `DB_DIALECT` | `mysql` |
| `DB_SSL` | `true` if required by the database provider, otherwise `false` |
| `DB_SSL_CA` | Optional CA certificate when required for MySQL TLS |
| `DB_SSL_REJECT_UNAUTHORIZED` | Keep `true` for certificate verification |
| `JWT_SECRET` | Random secret, at least 32 characters |
| `JWT_REFRESH_SECRET` | A separate random secret, at least 32 characters |
| `JWT_EXPIRE` | Access-token lifetime; default `7d` |
| `JWT_REFRESH_EXPIRE` | Refresh-token lifetime; default `30d` |
| `FRONTEND_URL` | Exact deployed frontend origin, no trailing slash |
| `OPENROUTE_API_KEY` | Optional; routing falls back to public OSRM when absent |

Never put database values, JWT secrets, or provider keys in frontend variables or `render.yaml`. The root and backend `.env.example` files are templates; local `.env` files are ignored by Git.

The external database provider must allow connections from Render's outbound IP ranges and provide its hostname, port, database, user, password, and TLS requirements. Use a least-privilege database user. No connection to the external production database can be validated until those values and network permissions are supplied.

## Schema Initialization

The repository has Sequelize models but no migration framework or seed data. Production startup uses `sequelize.sync()` with `alter: false`, which can create missing model tables but does not alter existing tables. For an explicit initialization, run `npm run db:sync` from `backend/` with the intended database environment. Review existing production schema before running it; it is not a replacement for versioned migrations.

## Frontend and Authentication

The frontend reads the public `VITE_API_URL` at build time. It contains only the API URL, never database credentials or JWT signing keys. Authentication uses bearer JWTs in the `Authorization` header; tokens are stored in browser `localStorage`, not cookies. The API issues refresh tokens but currently has no refresh-token endpoint or server-side logout endpoint.

Production CORS permits the configured `FRONTEND_URL`. Local development origins are allowed only when `NODE_ENV=development`.

## Local Development

Create ignored local env files from the templates and set local MySQL credentials in `backend/.env`. The frontend uses Vite's local `/api` and `/health` proxies to the backend on port 5000.

```powershell
npm install
Set-Location backend
npm install
Set-Location ..
npm run dev
```

`npm run dev:mock` starts the API without the database for limited local checks; database-backed authentication and persistence require MySQL.

## Verification

Check the API at `https://<api-service>.onrender.com/health`. The response reports application and database status without returning credentials. A healthy frontend build is produced by `npm run build`.

Known pre-deployment follow-ups: provide and verify the external MySQL connection/TLS configuration; confirm the database schema against Sequelize models; and implement or remove the frontend `calculateSegmentFare` call, whose matching API route is currently absent.

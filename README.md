# Outreach
Building something to make outreach a bit simpler.

## Chrome extension

React + TypeScript, built with Vite. Source lives in `chromeExtension/src/`;
`chromeExtension/public/manifest.json` is copied into the build as-is.

### Run locally

1. Build it:
   ```bash
   cd chromeExtension
   npm install
   npm run build
   ```
2. Open `chrome://extensions` in Chrome and turn on **Developer mode** (top right).
3. Click **Load unpacked** and select the `chromeExtension/dist/` folder.
4. Pin the extension from the puzzle-piece menu, then click its icon to open the popup.

While developing, run `npm run dev` to rebuild on every save, then click the
reload icon on the extension's card in `chrome://extensions` to pick up changes.
`npm run typecheck` runs the TypeScript checker.

## Backend

Node + TypeScript server (Express) with Postgres, using Drizzle for the
database schema and migrations. Code lives in `backend/`.

### Run locally

Needs Docker running.

```bash
cd backend
npm install
cp .env.example .env
npm run db:up   # start Postgres in Docker
npm run dev     # server on http://localhost:3000, restarts on save
```

Migrations run automatically when the server starts. `npm run db:down` stops Postgres
(your data is kept). `npm run db:studio` opens a browser view of the database.

### Endpoints

- `GET /health` checks the server and database connection.

### Changing the database

1. Define tables in `backend/src/db/schema.ts`.
2. Run `npm run db:generate -- --name describe_the_change`. This writes a new SQL file in `backend/drizzle/`.
3. Restart `npm run dev` to apply it. Commit the SQL file; Railway applies it on the next deploy.

### Deployed (Railway)

Railway deploys `main` automatically on every push. It runs `npm run build` then `npm start`
in `backend/`, and the server applies migrations on startup. Environment variables
(`DATABASE_URL`, `PORT`) are set by Railway.

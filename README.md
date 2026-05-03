# Shared Counter App

A minimal real-time counter where all browser tabs and connected clients share a single counter value, synchronized instantly via Electric SQL. Click **+** or **−** to change the counter — every open tab updates in real time with no page refresh needed.

## Quickstart

```bash
cp .env.example .env   # fill in DATABASE_URL, ELECTRIC_SOURCE_ID, ELECTRIC_SECRET
pnpm install
pnpm run migrate       # create the counters table and seed the global row
pnpm dev               # starts Vite on http://localhost:5174
```

# Plan: Shared Counter App

A minimal counter app where all browser tabs (and all connected clients) share a single counter value, synchronized in real-time via Electric SQL.

## User Flows

1. User opens the app and sees the current counter value.
2. User clicks **+** to increment the counter by 1.
3. User clicks **−** to decrement the counter by 1.
4. Any change is immediately reflected in all other open tabs and connected clients without a page refresh.

## Data Model

Single table with one row representing the global counter:

```ts
// src/db/schema.ts (add to existing file)
export const counters = pgTable("counters", {
  id: text("id").primaryKey(),          // fixed value: "global"
  value: integer("value").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

A seed migration (or API-level upsert on first request) ensures the `"global"` row always exists.

## Key Technical Decisions

- **Single shared row**: Use a fixed `id = "global"` row instead of multiple rows. Simple, no ambiguity.
- **Electric SQL sync**: The counter value syncs to every tab via an Electric shape on the `counters` table. No polling needed.
- **TanStack DB collection**: `countersCollection` subscribes to the Electric shape; `useLiveQuery` reads the live value.
- **Optimistic updates**: `collection.update()` applies the new value locally before the server round-trip, so the UI feels instant.
- **Server mutations**: POST routes (`/api/counters/increment`, `/api/counters/decrement`) perform atomic `UPDATE … SET value = value ± 1` in Postgres to avoid lost updates under concurrency.
- **SSR disabled on home route**: The home page uses `useLiveQuery`, so `ssr: false` is set on the route options.

## Implementation Phases

### Phase 1 — Schema & Migration

- Add `counters` table to `src/db/schema.ts`.
- Run `drizzle-kit generate && drizzle-kit migrate`.
- Insert seed row `{ id: "global", value: 0 }` via a migration SQL file or in the POST handler (upsert on conflict do nothing).

### Phase 2 — API Routes

- `src/routes/api/counters.ts` — GET handler: Electric shape proxy forwarding to Electric Cloud (same pattern as other entity shape routes).
- `src/routes/api/counters/increment.ts` — POST handler: `UPDATE counters SET value = value + 1, updated_at = now() WHERE id = 'global'`; upserts the seed row if missing.
- `src/routes/api/counters/decrement.ts` — POST handler: same but `value - 1`.

### Phase 3 — Collection

- `src/db/collections/counters.ts`: create `countersCollection` using `makeElectricCollection` pointing at `/api/counters`.

### Phase 4 — UI

- `src/routes/index.tsx` (or replace existing): `ssr: false`, uses `useLiveQuery(countersCollection, () => ({}))` to get the live counter value.
- Render:
  - Large centered number showing the counter value.
  - **−** button (calls `/api/counters/decrement` then updates collection optimistically).
  - **+** button (calls `/api/counters/increment` then updates collection optimistically).
  - Small status line: "Synced across all tabs in real-time."

### Phase 5 — Build & Verify

- `pnpm run build` must succeed with zero errors.
- `scripts/preflight.mjs` checks pass (SSR safety, useLiveQuery patterns).

### Phase 6 — Tests

- Unit test in `tests/` verifying the Drizzle schema has the `counters` table with expected columns.
- Integration smoke test: POST to increment/decrement routes returns 200 and updated value (using test DB helpers from `tests/helpers/schema-test-utils.ts`).

### Phase 7 — README

- Update `README.md` with a one-paragraph description and `pnpm dev` quickstart.

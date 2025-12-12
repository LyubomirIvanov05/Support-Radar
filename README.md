# support-radar

A simple customer support triage dashboard built with SvelteKit + Tailwind. It ingests 15–20 fake messages, categorises them (via OpenAI), assigns priority, and provides a compact UI to filter, resolve, and view summaries.

## Features

- Dashboard summary (counts by Category and Priority)
- Messages list with filters (Category, Priority, Search, Show resolved)
- Resolve toggle (soft-delete into a Resolved bin)
- AI triage endpoint to assign Category + Priority (bulk request to mitigate rate limits)
- AI reply endpoint to generate a suggested customer response
- Inline “Suggest reply” per message with loading/error states
- Colored tags for quick scanning (high/urgent and bug are red)

## Tech stack

- SvelteKit
- Tailwind CSS
- OpenAI API
- In-memory data (no DB)

## Project structure (high-level)

- `src/lib/types.ts`: Type definitions (`SupportMessage`, `Category`, `Priority`)
- `src/lib/data/messages.ts`: 20 seed messages
- `src/lib/server/db.ts`: In-memory store + helpers (list, upsert triage, toggle resolve)
- `src/lib/components/`
  - `SummaryCards.svelte`
  - `Filters.svelte` (uses `$bindable` for two-way bindings)
  - `MessageRow.svelte` (“Resolve” + “Suggest reply” UI)
- `src/routes/`
  - `+page.svelte`, `+page.server.ts`: Dashboard
  - `messages/+page.svelte`, `+page.server.ts`: Message list + triage action
  - `resolved/+page.svelte`, `+page.server.ts`: Resolved bin
  - `api/triage/+server.ts`: Bulk triage via OpenAI
  - `api/reply/+server.ts`: Suggested reply via OpenAI
  - `api/messages/resolve/+server.ts`: Toggle resolved


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


 ## How to run the project
 Prerequisites:

    Node 18.18+ (or 20+)
    
    An OpenAI API key

  Setup:
    npm install

  Create a .env file in the project root with:
    OPENAI_API_KEY=sk-...

  Development:
    npm run dev
    # visit http://localhost:5173

## What Would I Improve With More Time
  1. Message Ingestion (“Receiver”)

  Add an ingest endpoint/worker for receiving live messages (webhooks, IMAP/SMTP bridge, provider integrations).
  
  Deduplicate, persist, and automatically queue triage.
  
  Show message lifecycle state in UI (“awaiting triage”, “triaged”, etc.).

  2. Reply Approval & Sending (“Sender”)
  
  After generating a suggested reply, allow editing/approval and send via SMTP/SendGrid/Postmark.
  
  Track sent status, timestamps, and conversation history.
  
  3. Persistence & Reliability
  
  Replace in-memory storage with SQLite/Prisma.
  
  Add background jobs, retry/backoff for triage, and a deterministic keyword-rule fallback when AI is unavailable.
  
  4. UX Enhancements
  
  Avoid page reload after triage by merging results client-side (filters already persist after resolve).
  
  Add toasts, empty states, pagination/virtualized lists for larger datasets.
  
  5. Operational Improvements
  
  Structured logging, minimal metrics, visibility into rate limits.
  
  Env-based “mock mode” for demos or offline development.


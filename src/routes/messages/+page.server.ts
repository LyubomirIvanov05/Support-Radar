import { listMessages, upsertMany } from '$lib/server/db';
import type { Category, Priority } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const messages = listMessages();
  return { messages };
};

export const actions: Actions = {
  triage: async ({ fetch }) => {
    const messages = listMessages().filter((m) => !m.category || !m.priority);
    if (messages.length === 0) {
      return { ok: true, count: 0 };
    }
    const res = await fetch('/api/triage', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        messages: messages.map((m) => ({
          id: m.id,
          customerEmail: m.customerEmail,
          body: m.body
        }))
      })
    });
    if (!res.ok) {
      return { ok: false, error: 'triage-failed' };
    }
    const { results } = (await res.json()) as {
      results: Array<{ id: string; category?: Category; priority?: Priority }>;
    };
    upsertMany(results);
    return { ok: true, count: results.length };
  }
};


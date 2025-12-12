import type { RequestHandler } from '@sveltejs/kit';
import { toggleResolved } from '$lib/server/db';

export const POST: RequestHandler = async ({ request }) => {
  const { id, resolved } = (await request.json()) as { id: string; resolved: boolean };
  if (typeof id !== 'string' || typeof resolved !== 'boolean') {
    return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
  }

  const updated = toggleResolved(id, resolved);
  if (!updated) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }
  return new Response(JSON.stringify({ message: updated }), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  });
};


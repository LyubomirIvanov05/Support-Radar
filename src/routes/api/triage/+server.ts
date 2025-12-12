import { env } from '$env/dynamic/private';
import type { RequestHandler } from '@sveltejs/kit';
import OpenAI from 'openai';

export const POST: RequestHandler = async ({ request }) => {
  console.log('POST /api/triage about to parse request body');
  const { messages } = (await request.json()) as {
    messages: Array<{ id: string; customerEmail: string; body: string }>;
  };

  console.log('POST /api/triage messages', messages);

  if (!Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
  }

  if (!env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: 'OpenAI not configured' }), { status: 501 });
  }

  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

  // Single bulk request: classify all messages at once to avoid RPM limits.
  const instruction =
    'Classify each message into a Category and Priority.\n' +
    'Categories: Billing, Bug, Feature, Account, General.\n' +
    'Priorities: low, medium, high, urgent.\n' +
    'Return a JSON object with "results": an array of {id, category, priority} in the same order as input.\n' +
    'Do NOT include markdown, code fences, or any explanatory text — ONLY valid JSON.';

  const inputJson = JSON.stringify(
    {
      items: messages.map((m) => ({
        id: m.id,
        customerEmail: m.customerEmail,
        body: m.body
      }))
    },
    null,
    2
  );

  try {
    const r = await client.responses.create({
      model: 'gpt-4o-mini',
      input: `${instruction}
      Input:${inputJson}
      Respond with ONLY valid JSON: {"results":[...]}.
      
      
      Example response: 
      "results": [
    {
      "id": "m-009",
      "category": "Bug",
      "priority": "high"
    },
    {
      "id": "m-004",
      "category": "Account",
      "priority": "urgent"
    },
    {
      "id": "m-010",
      "category": "Billing",
      "priority": "high"
    },
    {
      "id": "m-001",
      "category": "Billing",
      "priority": "high"
    },
    {
      "id": "m-017",
      "category": "Bug",
      "priority": "medium"
    },
    {
      "id": "m-007",
      "category": "Feature",
      "priority": "low"
    }
      ]`
    });

    console.log('POST /api/triage response', r);

    const text = r.output_text || '{}';
    let results: Array<{ id: string; category?: string; priority?: string }> = [];
    try {
      // Strip common markdown code fences if present
      const noFences = text.replace(/```json|```/g, '').trim();
      let parsed: any;
      try {
        parsed = JSON.parse(noFences);
      } catch {
        // As a fallback, extract the first JSON object substring
        const start = noFences.indexOf('{');
        const end = noFences.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end > start) {
          const candidate = noFences.slice(start, end + 1);
          parsed = JSON.parse(candidate);
        } else {
          throw new Error('No JSON object found in response');
        }
      }
      if (Array.isArray(parsed?.results)) {
        results = parsed.results.map((row: any) => ({
          id: String(row.id),
          category: row.category,
          priority: row.priority
        }));
      }
    } catch {
      // keep results empty; fall through to fallback below
      console.log('POST /api/triage parsing failed', text);
    }

    // Fallback: if parsing failed or empty, return ids with undefined fields
    if (!results.length) {
      results = messages.map((m) => ({ id: m.id, category: undefined, priority: undefined }));
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  } catch (err: any) {
    // On rate limit or error, degrade gracefully by returning stubs so UI continues
    if (err?.status === 429) {
      const results = messages.map((m) => ({ id: m.id, category: undefined, priority: undefined }));
      return new Response(JSON.stringify({ results, error: 'rate_limited' }), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      });
    }
    return new Response(JSON.stringify({ error: 'triage_failed' }), { status: 500 });
  }
};


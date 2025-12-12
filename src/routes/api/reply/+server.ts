import { env } from '$env/dynamic/private';
import type { RequestHandler } from '@sveltejs/kit';
import OpenAI from 'openai';
import type { SupportMessage } from '$lib/types';

export const POST: RequestHandler = async ({ request }) => {
  const { message } = (await request.json()) as { message: SupportMessage };

  console.log('POST /api/reply message', message);

  if (!message || typeof message.body !== 'string') {
    return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
  }

  if (!env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: 'OpenAI not configured' }), { status: 501 });
  }

  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const prompt =
    'Write a concise, friendly customer support reply to the following message.' +
    ' Be empathetic, propose a next step or solution, and keep it under 120 words.' +
    ' Use a clear subject line and sign off as "Support Team".' +
    `\nCustomer: ${message.customerEmail}\nMessage: ${message.body}`;

  const r = await client.responses.create({
    model: 'gpt-4o-mini',
    input: prompt
  });

  console.log('POST /api/reply response', r);

  const reply = (r.output_text || '').trim();
  return new Response(JSON.stringify({ reply }), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  });
};


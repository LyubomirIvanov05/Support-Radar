import type { SupportMessage } from '$lib/types';
import { seedMessages } from '$lib/data/messages';

let messages: SupportMessage[] = [...seedMessages];

export function listMessages(): SupportMessage[] {
  return messages.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listResolved(): SupportMessage[] {
  return listMessages().filter((m) => m.resolved === true);
}

export function listActive(): SupportMessage[] {
  return listMessages().filter((m) => !m.resolved);
}

export function toggleResolved(id: string, resolved: boolean): SupportMessage | undefined {
  const idx = messages.findIndex((m) => m.id === id);
  if (idx === -1) return undefined;
  messages[idx] = { ...messages[idx], resolved };
  return messages[idx];
}

export function upsertMany(
  updates: Array<Pick<SupportMessage, 'id' | 'category' | 'priority'>>
): SupportMessage[] {
  const map = new Map(messages.map((m) => [m.id, m]));
  for (const u of updates) {
    const existing = map.get(u.id);
    if (existing) {
      map.set(u.id, { ...existing, category: u.category, priority: u.priority });
    }
  }
  messages = Array.from(map.values());
  return messages;
}


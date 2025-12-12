import { listMessages } from '$lib/server/db';
import type { Category, Priority } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const messages = listMessages();
  const byCategory: Record<Category, number> = {
    Billing: 0,
    Bug: 0,
    Feature: 0,
    Account: 0,
    General: 0
  };
  const byPriority: Record<Priority, number> = {
    low: 0,
    medium: 0,
    high: 0,
    urgent: 0
  };
  for (const m of messages) {
    if (m.category) byCategory[m.category]++;
    if (m.priority) byPriority[m.priority]++;
  }
  return { total: messages.length, byCategory, byPriority };
};


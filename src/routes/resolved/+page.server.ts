import { listResolved } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return { messages: listResolved() };
};


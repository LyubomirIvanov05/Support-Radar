<script lang="ts">
  import Filters from '$lib/components/Filters.svelte';
  import MessageRow from '$lib/components/MessageRow.svelte';
  import type { Category, Priority, SupportMessage } from '$lib/types';
  import { enhance } from '$app/forms';

  let { data, form } = $props<{ data: { messages: SupportMessage[] }; form?: { ok?: boolean; count?: number } }>();
  let query = $state('');
  let category: Category | undefined = $state(undefined);
  let priority: Priority | undefined = $state(undefined);
  let showResolved = $state(false);
  // Keep a local copy so we can update resolved state without reloading
  let messages = $state<SupportMessage[]>([...data.messages]);
  let triageLoading = $state(false);
  let triageError = $state<string | null>(null);

  $effect(() => {
    if (form?.ok) {
      // After server triage, reload once to refresh categories/priorities
      window.location.reload();
    }
  });

  function matches(m: SupportMessage) {
    if (!showResolved && m.resolved) return false;
    if (category && m.category !== category) return false;
    if (priority && m.priority !== priority) return false;
    const q = query.trim().toLowerCase();
    if (q) {
      const hay = `${m.customerEmail} ${m.body}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }

  function handleToggled(id: string, resolved: boolean) {
    const idx = messages.findIndex((m) => m.id === id);
    if (idx !== -1) {
      messages[idx] = { ...messages[idx], resolved };
      messages = [...messages];
    }
  }

  const filtered = () => messages.filter(matches);

  function enhanceTriage() {
    triageLoading = true;
    triageError = null;
    return async ({ result, update }: { result: any; update: (opts?: any) => Promise<void> }) => {
      try {
        if (result?.type === 'success') {
          // Apply the action result so `form` updates on the page
          await update();
          const data = await result.json();
          if (!data?.ok) {
            triageError = 'Triage failed';
          }
          // $effect above will reload on form.ok
        } else {
          triageError = 'Network error';
        }
      } catch {
        triageError = 'Unexpected error';
      } finally {
        triageLoading = false;
      }
    };
  }
</script>

<div class="mx-auto max-w-6xl space-y-6 p-4">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold">Messages</h1>
		<form
			method="POST"
			use:enhance={enhanceTriage}
			action="?/triage"
			class="flex items-center gap-3"
		>
			<button
				type="submit"
				class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
				disabled={triageLoading}
			>
				{triageLoading ? 'Triaging…' : 'Triage uncategorised'}
			</button>
			{#if triageError}
				<span class="text-sm text-red-600">{triageError}</span>
			{/if}
		</form>
	</div>

	<Filters bind:query bind:category bind:priority bind:showResolved />

	<div class="space-y-3">
		{#each filtered() as m (m.id)}
			<MessageRow message={m} onToggle={(id, resolved) => handleToggled(id, resolved)} />
		{/each}
	</div>
</div>

<script lang="ts">
  import type { Category, Priority } from '$lib/types';
  // Mark props bindable so parent can use bind:query / bind:category / ...
  let {
    query = $bindable(''),
    category = $bindable<Category | undefined>(),
    priority = $bindable<Priority | undefined>(),
    showResolved = $bindable(false)
  } = $props();

  // Use '' sentinel for "Any" in <select>, map to undefined in bound props
  const categoryOptions: ('' | Category)[] = ['', 'Billing', 'Bug', 'Feature', 'Account', 'General'];
  const priorityOptions: ('' | Priority)[] = ['', 'low', 'medium', 'high', 'urgent'];
  let categoryInternal: '' | Category = category ?? '';
  let priorityInternal: '' | Priority = priority ?? '';

  // reflect parent updates -> internal selects
  $effect(() => {
    const next = category ?? '';
    if (next !== categoryInternal) categoryInternal = next;
  });
  $effect(() => {
    const next = priority ?? '';
    if (next !== priorityInternal) priorityInternal = next;
  });
</script>

<div class="flex flex-wrap items-end gap-3">
	<div class="flex-1 min-w-64">
		<label class="block text-sm font-medium text-gray-700">Search</label>
		<input
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
			type="text"
			placeholder="Search emails or message text..."
			bind:value={query}
		/>
	</div>

	<div>
		<label class="block text-sm font-medium text-gray-700">Category</label>
		<select
			class="mt-1 block w-44 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
			bind:value={categoryInternal}
			onchange={() => (category = categoryInternal || undefined)}
		>
			{#each categoryOptions as c}
				<option value={c}>{c || 'Any'}</option>
			{/each}
		</select>
	</div>

	<div>
		<label class="block text-sm font-medium text-gray-700">Priority</label>
		<select
			class="mt-1 block w-44 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
			bind:value={priorityInternal}
			onchange={() => (priority = priorityInternal || undefined)}
		>
			{#each priorityOptions as p}
				<option value={p}>{p ? p : 'Any'}</option>
			{/each}
		</select>
	</div>

	<div class="mb-1 flex items-center gap-2">
		<input
			id="resolved"
			type="checkbox"
			bind:checked={showResolved}
			class="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
		/>
		<label for="resolved" class="text-sm text-gray-700">Show resolved</label>
	</div>
</div>

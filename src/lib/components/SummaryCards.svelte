<script lang="ts">
  import type { Category, Priority } from '$lib/types';
  let { total, byCategory, byPriority } = $props<{
    total: number;
    byCategory: Record<Category, number>;
    byPriority: Record<Priority, number>;
  }>();

  const categoryOrder: Category[] = ['Billing', 'Bug', 'Feature', 'Account', 'General'];
  const priorityOrder: Priority[] = ['low', 'medium', 'high', 'urgent'];
</script>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
	<div class="rounded-lg border bg-white p-4 shadow-sm">
		<div class="text-sm text-gray-500">Total messages</div>
		<div class="mt-2 text-3xl font-semibold">{total}</div>
	</div>

	<div class="rounded-lg border bg-white p-4 shadow-sm">
		<div class="text-sm font-medium text-gray-700">By category</div>
		<ul class="mt-2 space-y-1">
			{#each categoryOrder as c}
				<li class="flex items-center justify-between">
					<span class="text-gray-600">{c}</span>
					<span class="font-medium">{byCategory[c] ?? 0}</span>
				</li>
			{/each}
		</ul>
	</div>

	<div class="rounded-lg border bg-white p-4 shadow-sm">
		<div class="text-sm font-medium text-gray-700">By priority</div>
		<ul class="mt-2 space-y-1">
			{#each priorityOrder as p}
				<li class="flex items-center justify-between">
					<span class="text-gray-600 capitalize">{p}</span>
					<span class="font-medium">{byPriority[p] ?? 0}</span>
				</li>
			{/each}
		</ul>
	</div>
</div>

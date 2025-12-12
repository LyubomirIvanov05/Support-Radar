<script lang="ts">
  import SummaryCards from '$lib/components/SummaryCards.svelte';
  let { data } = $props();
</script>

<div class="mx-auto max-w-6xl space-y-6 p-4">
	<h1 class="text-2xl font-semibold">Dashboard</h1>
	<SummaryCards total={data.total} byCategory={data.byCategory} byPriority={data.byPriority} />
</div>

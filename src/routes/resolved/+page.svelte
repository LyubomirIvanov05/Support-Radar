<script lang="ts">
  import MessageRow from '$lib/components/MessageRow.svelte';
  import type { SupportMessage } from '$lib/types';
  let { data } = $props<{ data: { messages: SupportMessage[] } }>();
</script>

<div class="mx-auto max-w-6xl space-y-6 p-4">
  <h1 class="text-2xl font-semibold">Resolved</h1>
  {#if data.messages.length === 0}
    <p class="text-sm text-gray-600">No resolved messages yet.</p>
  {:else}
    <div class="space-y-3">
      {#each data.messages as m (m.id)}
        <MessageRow message={m} />
      {/each}
    </div>
  {/if}
</div>


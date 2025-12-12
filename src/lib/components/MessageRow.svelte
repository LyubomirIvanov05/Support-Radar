<script lang="ts">
  import type { SupportMessage } from '$lib/types';
  let {
    message,
    onToggle
  }: {
    message: SupportMessage;
    onToggle?: (id: string, resolved: boolean) => void;
  } = $props();

  const CATEGORY_STYLES: Record<string, string> = {
    Bug: 'bg-rose-50 text-rose-700',
    Billing: 'bg-amber-50 text-amber-700',
    Feature: 'bg-indigo-50 text-indigo-700',
    Account: 'bg-teal-50 text-teal-700',
    General: 'bg-gray-100 text-gray-700'
  };

  const PRIORITY_STYLES: Record<string, string> = {
    urgent: 'bg-red-100 text-red-800',
    high: 'bg-red-50 text-red-700',
    medium: 'bg-amber-50 text-amber-700',
    low: 'bg-slate-100 text-slate-700'
  };

  let replying = $state(false);
  let replyText = $state<string | null>(null);
  let replyError = $state<string | null>(null);

  async function onToggleResolved() {
    try {
      await fetch('/api/messages/resolve', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: message.id, resolved: !message.resolved })
      });
      // Update local and inform parent without reloading (keeps filters)
      message.resolved = !message.resolved;
      onToggle?.(message.id, message.resolved);
    } catch {
      // noop
    }
  }

  async function onSuggestReply() {
    replying = true;
    replyError = null;
    try {
      const res = await fetch('/api/reply', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message })
      });
      if (!res.ok) {
        replyError = 'Failed to generate reply';
        replyText = null;
      } else {
        const data = (await res.json()) as { reply?: string; error?: string };
        if (data.error) {
          replyError = data.error;
          replyText = null;
        } else {
          replyText = data.reply ?? '';
        }
      }
    } catch {
      replyError = 'Network error';
      replyText = null;
    } finally {
      replying = false;
    }
  }
</script>

<div class="rounded-md border bg-white p-4">
	<div class="flex items-start justify-between gap-4">
		<div class="min-w-0">
			<div class="text-sm text-gray-500">{message.customerEmail}</div>
			<div class="mt-1 font-medium text-gray-900 line-clamp-2">{message.body}</div>
			<div class="mt-2 text-xs text-gray-500">{new Date(message.createdAt).toLocaleString()}</div>
		</div>
		<div class="flex shrink-0 flex-col items-end gap-2">
			<div class="flex items-center gap-2 text-xs">
				{#if message.category}<span
						class={`rounded px-2 py-0.5 ${CATEGORY_STYLES[message.category] ?? 'bg-gray-100 text-gray-700'}`}
						>{message.category}</span
					>{/if}
				{#if message.priority}<span
						class={`rounded px-2 py-0.5 capitalize ${PRIORITY_STYLES[message.priority] ?? 'bg-slate-100 text-slate-700'}`}
						>{message.priority}</span
					>{/if}
				{#if message.resolved}<span class="rounded bg-emerald-50 px-2 py-0.5 text-emerald-700"
						>Resolved</span
					>{/if}
			</div>
			<button
				class="inline-flex items-center rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
				onclick={onToggleResolved}
			>
				{message.resolved ? 'Unresolve' : 'Resolve'}
			</button>
			<button
				class="inline-flex items-center rounded-md border px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
				disabled={replying}
				onclick={onSuggestReply}
			>
				{replying ? 'Generating…' : 'Suggest reply'}
			</button>
		</div>
	</div>
	{#if replyError || replyText}
		<div class="mt-3 rounded-md border bg-slate-50 p-3 text-sm">
			{#if replyError}
				<div class="text-red-600">{replyError}</div>
			{/if}
			{#if replyText}
				<div class="whitespace-pre-wrap">{replyText}</div>
			{/if}
		</div>
	{/if}
</div>

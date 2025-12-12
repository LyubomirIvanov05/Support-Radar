<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="border-b bg-white">
	<div class="mx-auto flex max-w-6xl items-center justify-between p-4">
		<a href="/" class="text-lg font-semibold">support-radar</a>
		<nav class="flex items-center gap-4 text-sm">
			<a class="hover:text-indigo-600" href="/">Dashboard</a>
			<a class="hover:text-indigo-600" href="/messages">Messages</a>
			<a class="hover:text-indigo-600" href="/resolved">Resolved</a>
		</nav>
	</div>
</header>

<main class="bg-gray-50 min-h-dvh">
	{@render children()}
</main>

<script lang="ts">
	import { browser } from '$app/environment';
	import Fallback from '$lib/components/Fallback.svelte';
	import Overlay from '$lib/components/Overlay.svelte';
	import { syncWithLocation } from '$lib/stage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// three.js only runs in the browser, and only when WebGL is there (see app.html)
	const room =
		browser && !document.documentElement.classList.contains('no-webgl')
			? import('$lib/components/room/Stage.svelte')
			: null;

	$effect(() => syncWithLocation());
</script>

<Fallback projects={data.projects} />

{#if room}
	<div class="room-only">
		{#await room then { default: Stage }}
			<Stage projects={data.projects} />
		{/await}
		<Overlay projects={data.projects} />
	</div>
{/if}

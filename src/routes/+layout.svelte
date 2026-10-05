<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import Nav from '$lib/components/Nav.svelte';
	import { site } from '$lib/config';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	// Three.js only runs in the browser; load it after hydration
	const background = browser ? import('$lib/components/scene/Background.svelte') : null;
</script>

<svelte:head>
	<title>{site.title}</title>
	<meta name="description" content={site.description} />
	<meta name="keywords" content={site.keywords.join(', ')} />
	<meta name="author" content={site.name} />
	<link rel="canonical" href={page.url.origin + page.url.pathname} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={site.title} />
	<meta property="og:description" content={site.description} />
	<meta property="og:url" content={page.url.origin} />
	<meta property="og:image" content="{page.url.origin}/images/foldin.webp" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

{#if background}
	{#await background then { default: Background }}
		<Background />
	{/await}
{/if}

<!-- Fallback glow while/if WebGL isn't there -->
<div
	class="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(ellipse_at_70%_30%,rgb(0_255_102/0.10),transparent_60%)]"
	aria-hidden="true"
></div>
<div class="scanlines" aria-hidden="true"></div>

<Nav />
<main>
	{@render children()}
</main>

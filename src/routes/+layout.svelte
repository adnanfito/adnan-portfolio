<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { site } from '$lib/config';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
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

<main>
	{@render children()}
</main>

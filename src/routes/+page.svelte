<script lang="ts">
	import Contact from '$lib/components/Contact.svelte';
	import Experience from '$lib/components/Experience.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import Terminal from '$lib/components/Terminal.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<section
	id="home"
	class="mx-auto flex min-h-[100dvh] w-full max-w-6xl items-center px-4 pt-24 pb-16 sm:px-6"
>
	<Terminal />
</section>

<Projects projects={data.projects} />

<Experience />

<Contact />

<script lang="ts">
	import type { Project } from '$lib/types';
	import ProjectCard from './ProjectCard.svelte';

	let { projects }: { projects: Project[] } = $props();
</script>

<section id="projects" class="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
	<header class="mb-10">
		<p class="prompt text-sm text-matrix-dim">ls -la ./projects</p>
		<h2 class="glow mt-2 text-3xl font-extrabold text-matrix sm:text-4xl">Projects</h2>
		<p class="mt-2 text-sm text-matrix-dim">
			total {projects.length} — things I've shipped, from backends to full products.
		</p>
	</header>

	{#if projects.length}
		<div class="grid gap-6 md:grid-cols-2">
			{#each projects as project, i (project.id)}
				<ProjectCard {project} index={i} />
			{/each}
		</div>
	{:else}
		<div class="window p-6 text-sm">
			<p class="text-[#ff6b6b]">ls: ./projects: directory is empty or unreachable</p>
			<p class="mt-2 text-matrix-dim">Projects are loaded from Notion — check back in a moment.</p>
		</div>
	{/if}
</section>

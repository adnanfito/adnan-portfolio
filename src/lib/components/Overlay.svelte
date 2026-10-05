<script lang="ts">
	import { navLinks, site, socials } from '$lib/config';
	import { back, go, stage } from '$lib/stage.svelte';
	import type { Project } from '$lib/types';
	import { fade, fly } from 'svelte/transition';
	import { innerHeight, innerWidth } from 'svelte/reactivity/window';
	import CvSheet from './room/CvSheet.svelte';
	import ProjectBrowser from './room/ProjectBrowser.svelte';
	import { framing } from './room/layout';

	let { projects }: { projects: Project[] } = $props();

	const frame = $derived(framing(innerWidth.current ?? 1280, innerHeight.current ?? 800));
	const focused = $derived(stage.view === 'projects' || stage.view === 'experience');

	const hints: Record<string, string> = {
		laptop: 'Open my laptop → projects',
		character: 'Say hi!',
		lamp: 'Toggle the lamp',
		plant: 'Poke the plant',
		Projects: 'Projects',
		Experience: 'Experience — my CV',
		Contact: 'Contact'
	};

	const icons: Record<string, string> = {
		email:
			'M3 6.75A1.75 1.75 0 0 1 4.75 5h14.5A1.75 1.75 0 0 1 21 6.75v10.5A1.75 1.75 0 0 1 19.25 19H4.75A1.75 1.75 0 0 1 3 17.25V6.75Zm1.9.15 7.1 5.33 7.1-5.33a.25.25 0 0 0-.15-.05H5.05a.25.25 0 0 0-.15.05Zm14.6 1.87-7.05 5.29a.75.75 0 0 1-.9 0L4.5 8.77v8.48c0 .14.11.25.25.25h14.5c.14 0 .25-.11.25-.25V8.77Z',
		github:
			'M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z',
		linkedin:
			'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z',
		resume:
			'M6 2.75A1.75 1.75 0 0 0 4.25 4.5v15A1.75 1.75 0 0 0 6 21.25h12a1.75 1.75 0 0 0 1.75-1.75V8.56a1.75 1.75 0 0 0-.51-1.24l-4.06-4.06a1.75 1.75 0 0 0-1.24-.51H6Zm7.25 1.5v3.5c0 .41.34.75.75.75h3.5M8 12.25h8M8 15.75h8M8 8.75h3'
	};

	const external = (href: string) => href.startsWith('http');
	const linkProps = (href: string) =>
		external(href)
			? { target: '_blank', rel: 'noopener' }
			: href.endsWith('.pdf')
				? { download: '' }
				: {};
</script>

{#snippet icon(name: string)}
	<svg viewBox="0 0 24 24" class="size-4" aria-hidden="true">
		{#if name === 'resume'}
			<path
				d={icons[name]}
				fill="none"
				stroke="currentColor"
				stroke-width="1.6"
				stroke-linecap="round"
			/>
		{:else}
			<path d={icons[name]} fill="currentColor" />
		{/if}
	</svg>
{/snippet}

<!-- Loader while three.js boots -->
{#if !stage.loaded}
	<div class="fixed inset-0 z-40 grid place-items-center bg-cream" out:fade={{ duration: 500 }}>
		<div class="flex flex-col items-center gap-3 text-sm font-semibold text-muted">
			<div class="flex gap-1.5">
				{#each [0, 1, 2] as i (i)}
					<span class="loader-dot" style:animation-delay="{i * 0.15}s"></span>
				{/each}
			</div>
			Setting up the room…
		</div>
	</div>
{/if}

<header
	class="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-4 px-4 py-4 sm:px-10 sm:py-6"
>
	<button
		class="pointer-events-auto text-lg font-extrabold tracking-tight"
		onclick={() => go('home')}
	>
		{site.handle.charAt(0).toUpperCase() + site.handle.slice(1)}<span class="text-peach">.</span>
	</button>
	<nav aria-label="Sections" class="pointer-events-auto">
		<ul class="flex items-center gap-0.5 rounded-full bg-paper/60 p-1 backdrop-blur sm:gap-1">
			{#each navLinks as link (link.view)}
				<li class:max-sm:hidden={link.view === 'home'}>
					<a
						href={link.view === 'home' ? '/' : `#${link.view}`}
						aria-current={stage.view === link.view ? 'page' : undefined}
						class="block rounded-full px-3 py-1.5 text-[0.8rem] font-semibold transition sm:px-4 sm:text-sm {stage.view ===
						link.view
							? 'bg-ink text-paper'
							: 'text-ink/60 hover:text-ink'}"
						onclick={(e) => {
							e.preventDefault();
							go(link.view);
						}}>{link.label}</a
					>
				</li>
			{/each}
		</ul>
	</nav>
</header>

<!-- Socials on the right edge, like the reference layout -->
{#if stage.view === 'home'}
	<ul
		class="fixed top-1/2 right-4 z-20 hidden -translate-y-1/2 flex-col gap-2.5 sm:right-8 md:flex"
		transition:fade={{ duration: 200 }}
		aria-label="Links"
	>
		{#each socials.filter((s) => s.label !== 'resume') as s (s.label)}
			<li>
				<a
					href={s.href}
					{...linkProps(s.href)}
					aria-label={s.label}
					title={s.value}
					class="grid size-10 place-items-center rounded-full border border-ink/10 bg-paper/70 text-ink/75 backdrop-blur transition hover:-translate-y-0.5 hover:text-ink"
				>
					{@render icon(s.label)}
				</a>
			</li>
		{/each}
	</ul>
{/if}

<!-- Home intro -->
{#if stage.view === 'home'}
	<section
		class="pointer-events-none fixed inset-x-0 top-20 z-20 px-5 text-center lg:inset-x-auto lg:top-1/2 lg:left-14 lg:max-w-md lg:-translate-y-1/2 lg:px-0 lg:text-left xl:left-20"
		in:fly={{ y: 16, duration: 450, delay: 250 }}
		out:fade={{ duration: 150 }}
	>
		{#if site.available}
			<p
				class="inline-flex items-center gap-2 rounded-full bg-paper/70 px-3 py-1 text-xs font-semibold text-ink/70 backdrop-blur"
			>
				<span class="relative flex size-2">
					<span class="absolute inline-flex size-full animate-ping rounded-full bg-sage opacity-70"
					></span>
					<span class="relative inline-flex size-2 rounded-full bg-sage"></span>
				</span>
				Available for work
			</p>
		{/if}
		<h2 class="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
			Hi, I'm Adnan<span class="text-peach">.</span>
		</h2>
		<p class="mt-2 font-semibold text-ink/70 sm:text-lg">{site.role}</p>
		<p class="mt-4 hidden text-ink/65 lg:block">{site.bio}</p>
		<div class="pointer-events-auto mt-5 hidden gap-2 lg:flex">
			<button class="pill-solid" onclick={() => go('projects')}>Open my laptop</button>
			<button class="pill" onclick={() => go('experience')}>Read my CV</button>
		</div>
	</section>
{/if}

<!-- Contact card -->
{#if stage.view === 'contact'}
	<section
		class="card fixed inset-x-3 bottom-3 z-20 p-6 sm:inset-x-auto sm:right-24 sm:bottom-auto sm:left-auto sm:top-1/2 sm:w-[25rem] sm:-translate-y-1/2 sm:p-8"
		in:fly={{ y: 24, duration: 450, delay: 200 }}
		out:fade={{ duration: 150 }}
		aria-labelledby="contact-title"
	>
		<p class="text-xs font-bold tracking-[0.14em] text-muted uppercase">Contact</p>
		<h2 id="contact-title" class="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
			Let's build something<span class="text-peach">.</span>
		</h2>
		<p class="mt-2 text-sm text-ink/70">
			Have a project, a role, or just want to talk backend &amp; AI? My inbox is open.
		</p>
		<ul class="mt-5 divide-y divide-line border-y border-line">
			{#each socials as s (s.label)}
				<li>
					<a
						href={s.href}
						{...linkProps(s.href)}
						class="group flex items-center gap-3 py-2.5 text-sm transition-colors hover:text-ink"
					>
						<span class="grid size-8 place-items-center rounded-full bg-cream-deep text-ink/70"
							>{@render icon(s.label)}</span
						>
						<span class="min-w-0 flex-1 truncate font-medium text-ink/80">{s.value}</span>
						<span class="text-muted transition-transform group-hover:translate-x-1">→</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>
{/if}

<!-- Bottom bar: CV + hints in the room, back button when zoomed in -->
<div
	class="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2 px-4 pb-5 sm:pb-8"
	class:hidden={stage.view === 'contact'}
>
	{#if focused}
		<div class="pointer-events-auto flex items-center gap-2" in:fade={{ delay: 400 }}>
			<button class="pill" onclick={() => back()}>
				← {stage.project ? 'All projects' : 'Back to the room'}
			</button>
			<kbd
				class="hidden rounded-md border border-ink/15 bg-paper/70 px-1.5 py-0.5 text-[0.7rem] font-semibold text-muted sm:block"
				>Esc</kbd
			>
		</div>
	{:else}
		<p class="h-5 text-xs font-semibold text-ink/55">
			{#if stage.hovered && hints[stage.hovered]}
				<span in:fade={{ duration: 120 }}>{hints[stage.hovered]}</span>
			{:else}
				<span class="max-sm:hidden">Psst — everything in the room is clickable.</span>
				<span class="sm:hidden">Tap the laptop or the hexagons.</span>
			{/if}
		</p>
		<div class="pointer-events-auto flex gap-2">
			<button class="pill-solid lg:hidden" onclick={() => go('projects')}>Projects</button>
			<a href={site.cv} download class="pill">Download CV</a>
		</div>
	{/if}
</div>

<!-- Phones: the laptop screen is too small to browse on, so the browser opens fullscreen -->
{#if stage.view === 'projects' && stage.screenReady && frame.compactScreen}
	<div class="fixed inset-x-0 top-16 bottom-0 z-30 p-2" transition:fade={{ duration: 250 }}>
		<div class="h-full overflow-hidden rounded-2xl shadow-2xl">
			<ProjectBrowser {projects} width={innerWidth.current ?? 360} onclose={() => go('home')} />
		</div>
	</div>
{/if}
{#if stage.view === 'experience' && stage.paperReady && frame.compactPaper}
	<div class="fixed inset-x-0 top-16 bottom-0 z-30 p-2" transition:fade={{ duration: 250 }}>
		<div class="h-full overflow-hidden rounded-2xl shadow-2xl">
			<CvSheet width={innerWidth.current ?? 360} onclose={() => go('home')} />
		</div>
	</div>
{/if}

<style>
	.loader-dot {
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 9999px;
		background: var(--color-peach);
		animation: bounce 0.9s ease-in-out infinite;
	}
	@keyframes bounce {
		50% {
			transform: translateY(-6px);
			opacity: 0.6;
		}
	}
</style>

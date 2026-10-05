<script lang="ts">
	import type { Project } from '$lib/types';

	let { project, index }: { project: Project; index: number } = $props();

	const slug = $derived(
		project.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '')
	);
	const host = $derived(project.link?.replace(/^https?:\/\//, '').replace(/\/$/, '') ?? null);

	let card: HTMLElement;
	let tilt = $state({ x: 0, y: 0 });

	const onMove = (e: PointerEvent) => {
		if (e.pointerType !== 'mouse') return;
		const r = card.getBoundingClientRect();
		tilt = {
			x: ((e.clientY - r.top) / r.height - 0.5) * -6,
			y: ((e.clientX - r.left) / r.width - 0.5) * 8
		};
	};
	const onLeave = () => (tilt = { x: 0, y: 0 });

	// Deterministic glyph noise for projects without a usable image
	const noise = $derived.by(() => {
		const chars = '01アイウエオカキクケコサシスセソ{}<>/=;$#';
		let seed = [...project.id].reduce((a, c) => a + c.charCodeAt(0), 0);
		const rand = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
		return Array.from({ length: 9 }, () =>
			Array.from({ length: 48 }, () => chars[Math.floor(rand() * chars.length)]).join('')
		);
	});
</script>

<article
	bind:this={card}
	onpointermove={onMove}
	onpointerleave={onLeave}
	class="card window group flex flex-col overflow-hidden transition-[transform,box-shadow] duration-300 ease-out hover:shadow-[0_0_60px_-12px_rgb(0_255_102/0.45)]"
	style:transform="perspective(900px) rotateX({tilt.x}deg) rotateY({tilt.y}deg)"
>
	<div class="window-bar justify-between">
		<span class="flex min-w-0 items-center gap-2">
			<span class="text-matrix">●</span>
			<span class="truncate text-matrix-soft">{slug}.ts</span>
		</span>
		<span class="text-matrix-dim/70">{String(index + 1).padStart(2, '0')}</span>
	</div>

	<div class="relative aspect-[16/9] overflow-hidden border-b border-matrix-line bg-void">
		{#if project.image}
			<img
				src={project.image}
				alt="Screenshot of {project.title}"
				loading="lazy"
				decoding="async"
				class="size-full object-cover object-top opacity-80 transition duration-500 [filter:grayscale(1)_sepia(1)_hue-rotate(80deg)_saturate(2.6)_brightness(0.8)] group-hover:scale-[1.03] group-hover:opacity-100 group-hover:[filter:none]"
			/>
		{:else}
			<div
				class="flex size-full flex-col justify-center overflow-hidden px-3 text-[0.7rem] leading-tight text-matrix/25 select-none"
				aria-hidden="true"
			>
				{#each noise as line, i (i)}
					<span class="whitespace-nowrap">{line}</span>
				{/each}
			</div>
			<span
				class="glow absolute inset-0 grid place-items-center text-sm tracking-[0.3em] text-matrix"
				>NO_SIGNAL</span
			>
		{/if}
		<div class="crt pointer-events-none absolute inset-0"></div>
	</div>

	<div
		class="code flex-1 p-4 text-[0.8rem] leading-6 sm:text-sm"
		role="group"
		aria-label="Project details"
	>
		<div class="row">
			<span class="ln">1</span>
			<p><span class="text-keyword">export const</span> project = {'{'}</p>
		</div>
		<div class="row">
			<span class="ln">2</span>
			<p class="ind">
				<span class="text-prop">name</span>: <span class="text-string">"{project.title}"</span>,
			</p>
		</div>
		{#if project.description}
			<div class="row">
				<span class="ln">3</span>
				<p class="ind">
					<span class="text-prop">desc</span>:
					<span class="text-matrix-soft/85">"{project.description}"</span>,
				</p>
			</div>
		{/if}
		<div class="row">
			<span class="ln">{project.description ? 4 : 3}</span>
			<p class="ind">
				<span class="text-prop">stack</span>: [{#each project.technologies as tech, i (tech)}<span
						class="text-string">"{tech}"</span
					>{i < project.technologies.length - 1 ? ', ' : ''}{/each}],
			</p>
		</div>
		<div class="row">
			<span class="ln">{project.description ? 5 : 4}</span>
			<p>{'}'};</p>
		</div>
	</div>

	{#if project.link}
		<a
			href={project.link}
			target="_blank"
			rel="noopener"
			class="flex items-center justify-between gap-3 border-t border-matrix-line px-4 py-3 text-sm text-matrix-dim transition-colors hover:bg-matrix/10 hover:text-matrix"
		>
			<span class="prompt truncate">open {host}</span>
			<span aria-hidden="true" class="transition-transform group-hover:translate-x-1">↗</span>
		</a>
	{/if}
</article>

<style>
	.row {
		display: flex;
	}
	.row p {
		min-width: 0;
		flex: 1;
	}
	/* Wrapped lines hang under the value, like an editor with soft-wrap */
	.ind {
		padding-left: 2ch;
	}
	.ln {
		flex: none;
		width: 1.75rem;
		color: var(--color-matrix-line);
		filter: brightness(2.2);
		user-select: none;
	}
	.crt {
		background:
			repeating-linear-gradient(to bottom, transparent 0 2px, rgb(0 0 0 / 0.25) 3px),
			radial-gradient(ellipse at center, transparent 55%, rgb(0 0 0 / 0.55));
	}
	@media (prefers-reduced-motion: reduce) {
		.card {
			transform: none !important;
		}
	}
</style>

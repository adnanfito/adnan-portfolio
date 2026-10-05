<script lang="ts">
	import { site } from '$lib/config';
	import { go, slugify, stage } from '$lib/stage.svelte';
	import type { Project } from '$lib/types';
	import { fade, fly } from 'svelte/transition';

	type Props = {
		projects: Project[];
		width: number;
		/** Shown in the fullscreen (mobile) variant to leave the browser */
		onclose?: () => void;
	};

	let { projects, width, onclose }: Props = $props();

	const items = $derived(
		projects.map((p, i) => ({ ...p, slug: slugify(p.title), num: String(i + 1).padStart(2, '0') }))
	);
	const index = $derived(items.findIndex((p) => p.slug === stage.project));
	const active = $derived(index >= 0 ? items[index] : null);
	const prev = $derived(index > 0 ? items[index - 1] : null);
	const next = $derived(index >= 0 && index < items.length - 1 ? items[index + 1] : null);
	const featured = $derived(items[0] ?? null);
	const rest = $derived(items.slice(1));

	const host = (link: string | null) =>
		link?.replace(/^https?:\/\//, '').replace(/\/$/, '') ?? null;
	const address = $derived(
		active ? (host(active.link) ?? `adnan.dev/projects/${active.slug}`) : 'adnan.dev/projects'
	);

	const wide = $derived(width >= 760);
	const cols = $derived(width >= 1080 ? 3 : width >= 560 ? 2 : 1);
	const fontSize = $derived(Math.max(12, Math.min(16, width / 70)));

	const tint = (s: string) => {
		const colors = ['#f2a7b5', '#b9a7f0', '#f4b183', '#8fbf9a', '#93a9dd'];
		return colors[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length];
	};

	let scroller = $state<HTMLElement>();
	$effect(() => {
		void stage.project;
		scroller?.scrollTo({ top: 0 });
	});
</script>

{#snippet thumb(p: (typeof items)[number], eager = false)}
	<span class="thumb">
		{#if p.image}
			<img src={p.image} alt="" loading={eager ? 'eager' : 'lazy'} />
		{:else}
			<span class="placeholder" style:--tint={tint(p.slug)}>{p.title.slice(0, 1)}</span>
		{/if}
	</span>
{/snippet}

{#snippet chips(list: string[], max = Infinity)}
	<span class="chips">
		{#each list.slice(0, max) as tech (tech)}<span class="chip-s">{tech}</span>{/each}
		{#if list.length > max}<span class="chip-s more">+{list.length - max}</span>{/if}
	</span>
{/snippet}

<div class="browser light-surface" style:font-size="{fontSize}px">
	<!-- Browser chrome -->
	<div class="bar">
		<div class="lights" aria-hidden="true">
			<span style:background="#ff5f57"></span>
			<span style:background="#febc2e"></span>
			<span style:background="#28c840"></span>
		</div>
		<button
			class="icon-btn"
			aria-label="Back to all projects"
			disabled={!active}
			onclick={() => go('projects')}
		>
			<svg viewBox="0 0 20 20" aria-hidden="true"
				><path
					d="M12.5 4.5 7 10l5.5 5.5"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
				/></svg
			>
		</button>
		<div class="address">
			<svg viewBox="0 0 16 16" class="lock" aria-hidden="true">
				<path
					fill="currentColor"
					d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-.5V4.5A3.5 3.5 0 0 0 8 1Zm2 6H6V4.5a2 2 0 1 1 4 0V7Z"
				/>
			</svg>
			<span class="truncate">{address}</span>
		</div>
		{#if active?.link}
			<a
				class="icon-btn"
				href={active.link}
				target="_blank"
				rel="noopener"
				aria-label="Open in new tab"
			>
				<svg viewBox="0 0 20 20" aria-hidden="true"
					><path
						d="M8 4.5H4.5v11h11V12M11 4.5h4.5V9M15.5 4.5 9 11"
						fill="none"
						stroke="currentColor"
						stroke-width="1.6"
					/></svg
				>
			</a>
		{/if}
		{#if onclose}
			<button class="icon-btn" aria-label="Close browser" onclick={onclose}>
				<svg viewBox="0 0 20 20" aria-hidden="true"
					><path
						d="m5 5 10 10M15 5 5 15"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
					/></svg
				>
			</button>
		{/if}
	</div>

	<div class="page" bind:this={scroller}>
		{#key active?.slug}
			<div in:fly={{ y: 14, duration: 320, delay: 90 }} out:fade={{ duration: 80 }}>
				{#if active}
					<!-- A project "website" -->
					<article class="detail">
						<nav class="crumbs">
							<button onclick={() => go('projects')}>Projects</button>
							<span>/</span>
							<span class="current">{active.title}</span>
							<span class="ml-auto flex gap-[0.4em]">
								<button
									class="round"
									aria-label="Previous project"
									disabled={!prev}
									onclick={() => prev && go('projects', prev.slug)}>←</button
								>
								<button
									class="round"
									aria-label="Next project"
									disabled={!next}
									onclick={() => next && go('projects', next.slug)}>→</button
								>
							</span>
						</nav>

						<header class="detail-head" class:wide>
							<div>
								<p class="eyebrow">Project {active.num}</p>
								<h2 class="title-xl">{active.title}</h2>
							</div>
							<div>
								{#if active.description}<p class="lead">{active.description}</p>{/if}
								{@render chips(active.technologies)}
								<div class="mt-[1.2em] flex flex-wrap gap-[0.6em]">
									{#if active.link}
										<a href={active.link} target="_blank" rel="noopener" class="cta"
											>Visit live site <span aria-hidden="true">↗</span></a
										>
									{/if}
									<button class="ghost" onclick={() => go('projects')}>All projects</button>
								</div>
							</div>
						</header>

						<figure class="device">
							<div class="device-bar" aria-hidden="true">
								<span></span><span></span><span></span>
								<em>{host(active.link) ?? active.slug}</em>
							</div>
							{#if active.image}
								<img src={active.image} alt="Screenshot of {active.title}" />
							{:else}
								<div class="placeholder big" style:--tint={tint(active.slug)}>
									{active.title.slice(0, 1)}
								</div>
							{/if}
						</figure>

						{#if next}
							<button class="next" onclick={() => go('projects', next.slug)}>
								<span>
									<span class="eyebrow">Next project</span>
									<span class="next-title">{next.title}</span>
								</span>
								<span class="arrow" aria-hidden="true">→</span>
							</button>
						{/if}
					</article>
				{:else}
					<!-- The portfolio home page -->
					<section class="home">
						<header class="site-head">
							<span class="logo">adnan<span>.dev</span></span>
							<span class="status"><i></i>{site.available ? 'Open to work' : 'Busy'}</span>
						</header>

						<div class="hero">
							<p class="eyebrow">Selected work · {projects.length}</p>
							<h2 class="title-xl">Things I've built.</h2>
							<p class="lead">
								From backends and AI pipelines to full products. Pick one to open it.
							</p>
						</div>

						{#if featured}
							<button class="featured" class:wide onclick={() => go('projects', featured.slug)}>
								{@render thumb(featured, true)}
								<span class="featured-body">
									<span class="num">{featured.num} — Featured</span>
									<span class="featured-title">{featured.title}</span>
									{#if featured.description}<span class="desc">{featured.description}</span>{/if}
									{@render chips(featured.technologies, 4)}
									<span class="open">Open project <span aria-hidden="true">→</span></span>
								</span>
							</button>

							<ul class="grid" style:grid-template-columns="repeat({cols}, minmax(0, 1fr))">
								{#each rest as p (p.id)}
									<li>
										<button class="card-btn" onclick={() => go('projects', p.slug)}>
											{@render thumb(p)}
											<span class="card-meta">
												<span class="num">{p.num}</span>
												<span class="arrow" aria-hidden="true">↗</span>
											</span>
											<span class="card-title">{p.title}</span>
											{#if p.description}<span class="desc clamp">{p.description}</span>{/if}
											{@render chips(p.technologies, 3)}
										</button>
									</li>
								{/each}
							</ul>
						{:else}
							<p class="empty">Projects load from Notion — check back in a moment.</p>
						{/if}
					</section>
				{/if}
			</div>
		{/key}
	</div>
</div>

<style>
	.browser {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		background: #fbf8f2;
		color: var(--color-ink);
		font-family: var(--font-sans);
		line-height: 1.5;
	}

	/* --- chrome --- */
	.bar {
		display: flex;
		align-items: center;
		gap: 0.6em;
		padding: 0.55em 0.8em;
		background: #eee6d9;
		border-bottom: 1px solid #e2d7c5;
	}
	.lights {
		display: flex;
		gap: 0.45em;
		margin-right: 0.3em;
	}
	.lights span {
		width: 0.75em;
		height: 0.75em;
		border-radius: 9999px;
	}
	.icon-btn {
		display: grid;
		place-items: center;
		width: 1.9em;
		height: 1.9em;
		flex: none;
		border-radius: 0.55em;
		color: rgb(46 42 38 / 0.75);
		transition: background 0.15s;
	}
	.icon-btn svg {
		width: 1.05em;
		height: 1.05em;
	}
	.icon-btn:hover:not(:disabled) {
		background: rgb(46 42 38 / 0.08);
	}
	.icon-btn:disabled {
		opacity: 0.3;
	}
	.address {
		display: flex;
		flex: 1;
		min-width: 0;
		align-items: center;
		justify-content: center;
		gap: 0.45em;
		padding: 0.35em 1em;
		border-radius: 0.6em;
		background: #fffdf9;
		box-shadow: 0 1px 0 rgb(46 42 38 / 0.06);
		font-size: 0.82em;
		color: rgb(46 42 38 / 0.65);
	}
	.lock {
		width: 0.9em;
		height: 0.9em;
		flex: none;
		opacity: 0.55;
	}
	.page {
		flex: 1;
		overflow-y: auto;
		overscroll-behavior: contain;
		scrollbar-width: thin;
	}

	/* --- shared --- */
	.eyebrow {
		display: block;
		font-size: 0.72em;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--color-muted);
	}
	.title-xl {
		margin-top: 0.15em;
		font-size: 2.4em;
		font-weight: 800;
		line-height: 1.05;
		letter-spacing: -0.035em;
	}
	.lead {
		margin-top: 0.5em;
		max-width: 38em;
		color: rgb(46 42 38 / 0.68);
	}
	.desc {
		display: block;
		margin-top: 0.3em;
		font-size: 0.86em;
		color: rgb(46 42 38 / 0.62);
	}
	.clamp {
		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35em;
		margin-top: 0.8em;
	}
	.chip-s {
		padding: 0.15em 0.65em;
		border-radius: 9999px;
		border: 1px solid #e6dccb;
		background: #fff;
		font-size: 0.74em;
		font-weight: 600;
		color: rgb(46 42 38 / 0.7);
	}
	.chip-s.more {
		background: transparent;
	}
	.num {
		font-size: 0.75em;
		font-weight: 700;
		letter-spacing: 0.06em;
		color: var(--color-muted);
		font-variant-numeric: tabular-nums;
	}
	.thumb {
		position: relative;
		display: block;
		aspect-ratio: 16 / 10;
		overflow: hidden;
		border-radius: 0.8em;
		background: #f1eadf;
		box-shadow: inset 0 0 0 1px rgb(46 42 38 / 0.06);
	}
	.thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top;
		transition: transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	.placeholder {
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		background:
			radial-gradient(circle at 30% 25%, rgb(255 255 255 / 0.45), transparent 55%), var(--tint);
		color: #fff;
		font-size: 2.8em;
		font-weight: 800;
	}

	/* --- home --- */
	.home {
		padding: 1.4em 2.2em 2.6em;
	}
	.site-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.logo {
		font-weight: 800;
		letter-spacing: -0.02em;
	}
	.logo span {
		color: var(--color-peach);
	}
	.status {
		display: inline-flex;
		align-items: center;
		gap: 0.45em;
		padding: 0.25em 0.8em;
		border-radius: 9999px;
		background: #fff;
		border: 1px solid #e6dccb;
		font-size: 0.75em;
		font-weight: 600;
		color: rgb(46 42 38 / 0.7);
	}
	.status i {
		width: 0.55em;
		height: 0.55em;
		border-radius: 9999px;
		background: var(--color-sage);
		box-shadow: 0 0 0 0.25em rgb(143 191 154 / 0.25);
	}
	.hero {
		margin: 2.2em 0 1.8em;
	}
	.featured {
		display: grid;
		gap: 1.2em;
		width: 100%;
		padding: 0.8em;
		border-radius: 1.3em;
		background: #fff;
		border: 1px solid #ece3d4;
		text-align: left;
		transition:
			box-shadow 0.25s,
			transform 0.25s;
	}
	.featured.wide {
		grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
		align-items: center;
	}
	.featured-body {
		display: flex;
		flex-direction: column;
		padding: 0.4em 0.8em 0.6em;
	}
	.featured-title {
		margin-top: 0.3em;
		font-size: 1.7em;
		font-weight: 800;
		letter-spacing: -0.025em;
		line-height: 1.1;
	}
	.open {
		margin-top: 1.3em;
		align-self: flex-start;
		padding: 0.55em 1.1em;
		border-radius: 9999px;
		background: var(--color-ink);
		color: var(--color-paper);
		font-size: 0.85em;
		font-weight: 700;
	}
	.grid {
		display: grid;
		gap: 1em;
		margin-top: 1em;
	}
	.card-btn {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		padding: 0.6em 0.6em 1em;
		border-radius: 1.1em;
		background: #fff;
		border: 1px solid #ece3d4;
		text-align: left;
		transition:
			box-shadow 0.25s,
			transform 0.25s;
	}
	.card-btn > :global(*:not(.thumb)) {
		padding-left: 0.35em;
		padding-right: 0.35em;
	}
	.card-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 0.8em;
	}
	.arrow {
		display: grid;
		place-items: center;
		width: 1.8em;
		height: 1.8em;
		border-radius: 9999px;
		background: #f3ece1;
		font-size: 0.85em;
		transition:
			background 0.2s,
			color 0.2s,
			transform 0.2s;
	}
	.card-title {
		margin-top: 0.1em;
		font-size: 1.08em;
		font-weight: 750;
		letter-spacing: -0.01em;
	}
	.featured:hover,
	.card-btn:hover {
		transform: translateY(-3px);
		box-shadow: 0 22px 40px -26px rgb(46 42 38 / 0.5);
	}
	.featured:hover .thumb img,
	.card-btn:hover .thumb img {
		transform: scale(1.04);
	}
	.card-btn:hover .arrow {
		background: var(--color-ink);
		color: var(--color-paper);
		transform: scale(1.05);
	}
	.empty {
		padding: 2em;
		border-radius: 1em;
		background: #fff;
		color: var(--color-muted);
	}

	/* --- project detail --- */
	.detail {
		padding: 1.2em 2.2em 2.6em;
	}
	.crumbs {
		display: flex;
		align-items: center;
		gap: 0.5em;
		font-size: 0.82em;
		color: var(--color-muted);
	}
	.crumbs button:not(.round):hover {
		color: var(--color-ink);
		text-decoration: underline;
	}
	.crumbs .current {
		font-weight: 600;
		color: var(--color-ink);
	}
	.round {
		display: grid;
		place-items: center;
		width: 2.1em;
		height: 2.1em;
		border-radius: 9999px;
		border: 1px solid #e6dccb;
		background: #fff;
		color: var(--color-ink);
	}
	.round:disabled {
		opacity: 0.35;
	}
	.round:hover:not(:disabled) {
		background: var(--color-ink);
		color: var(--color-paper);
	}
	.detail-head {
		display: grid;
		gap: 1em;
		margin: 1.6em 0;
	}
	.detail-head.wide {
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr);
		gap: 2.4em;
		align-items: end;
	}
	.detail-head .lead {
		margin-top: 0;
	}
	.cta {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		padding: 0.6em 1.2em;
		border-radius: 9999px;
		background: var(--color-ink);
		color: var(--color-paper);
		font-size: 0.88em;
		font-weight: 700;
		transition: transform 0.2s;
	}
	.cta:hover {
		transform: translateY(-2px);
	}
	.ghost {
		padding: 0.6em 1.2em;
		border-radius: 9999px;
		border: 1px solid #e0d5c3;
		background: #fff;
		font-size: 0.88em;
		font-weight: 600;
	}
	.device {
		overflow: hidden;
		border-radius: 1em;
		background: #fff;
		border: 1px solid #e6dccb;
		box-shadow: 0 30px 60px -40px rgb(46 42 38 / 0.6);
	}
	.device-bar {
		display: flex;
		align-items: center;
		gap: 0.35em;
		padding: 0.55em 0.8em;
		background: #f4eee4;
		border-bottom: 1px solid #eadfcd;
	}
	.device-bar span {
		width: 0.55em;
		height: 0.55em;
		border-radius: 9999px;
		background: #ddd2c0;
	}
	.device-bar em {
		margin-left: 0.6em;
		font-size: 0.72em;
		font-style: normal;
		color: var(--color-muted);
	}
	.device img {
		display: block;
		width: 100%;
	}
	.placeholder.big {
		aspect-ratio: 16 / 9;
		font-size: 6em;
	}
	.next {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		margin-top: 1.6em;
		padding: 1.1em 1.4em;
		border-radius: 1.1em;
		background: #fff;
		border: 1px solid #ece3d4;
		text-align: left;
	}
	.next > span:first-child {
		display: flex;
		flex-direction: column;
	}
	.next-title {
		font-size: 1.3em;
		font-weight: 800;
		letter-spacing: -0.02em;
	}
	.next:hover .arrow {
		background: var(--color-ink);
		color: var(--color-paper);
		transform: translateX(3px);
	}
</style>

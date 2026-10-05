<script lang="ts">
	import { achievements, education, experiences } from '$lib/config';

	// Stable fake commit hash per entry, purely decorative
	const hash = (s: string) => {
		let h = 0x811c9dc5;
		for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
		return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
	};
</script>

<section id="experience" class="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
	<header class="mb-10">
		<p class="prompt text-sm text-matrix-dim">git log --graph ./career</p>
		<h2 class="glow mt-2 text-3xl font-extrabold text-matrix sm:text-4xl">Experience</h2>
		<p class="mt-2 text-sm text-matrix-dim">
			{experiences.length} commits — newest first.
		</p>
	</header>

	<div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
		<div class="window p-5 sm:p-6">
			<ol>
				{#each experiences as exp, i (exp.role + exp.company)}
					<li class="commit relative pb-8 pl-7 last:pb-0" class:current={exp.current}>
						<span class="node" aria-hidden="true"></span>
						{#if i < experiences.length - 1}
							<span class="edge" aria-hidden="true"></span>
						{/if}

						<p class="flex flex-wrap items-baseline gap-x-2 text-xs">
							<span class="text-string">{hash(exp.role + exp.company + exp.period)}</span>
							{#if exp.current}
								<span class="text-keyword">(HEAD -&gt; <span class="text-matrix">now</span>)</span>
							{/if}
							<span class="text-matrix-dim">{exp.period}</span>
						</p>
						<h3 class="mt-1 text-[0.95rem] font-semibold text-matrix-soft sm:text-base">
							{exp.role} <span class="text-matrix-dim">@</span>
							<span class="text-matrix">{exp.company}</span>
						</h3>
						<ul class="mt-2 space-y-1 text-sm text-matrix-soft/80">
							{#each exp.highlights as h (h)}
								<li class="flex gap-2">
									<span class="text-matrix/50" aria-hidden="true">+</span>
									<span>{h}</span>
								</li>
							{/each}
						</ul>
						<ul class="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies">
							{#each exp.tags as tag (tag)}
								<li
									class="rounded border border-matrix-line px-1.5 py-0.5 text-[0.7rem] text-matrix-dim"
								>
									{tag}
								</li>
							{/each}
						</ul>
					</li>
				{/each}
			</ol>
		</div>

		<aside class="flex flex-col gap-6">
			<div class="window overflow-hidden">
				<div class="window-bar"><span class="text-matrix">●</span> education.md</div>
				<div class="space-y-2 p-5 text-sm">
					<p class="text-prop"># {education.degree}</p>
					<p class="font-semibold text-matrix-soft">{education.school}</p>
					<p class="text-matrix-dim">
						{education.period} · GPA <span class="text-matrix">{education.gpa}</span>
					</p>
					<ul class="space-y-1 pt-2 text-matrix-soft/80">
						{#each education.notes as note (note)}
							<li class="flex gap-2">
								<span class="text-matrix/50" aria-hidden="true">-</span><span>{note}</span>
							</li>
						{/each}
					</ul>
				</div>
			</div>

			<div class="window overflow-hidden">
				<div class="window-bar"><span class="text-matrix">●</span> achievements.log</div>
				<ul class="space-y-3 p-5 text-sm">
					{#each achievements as a (a.title)}
						<li>
							<p class="text-xs text-matrix-dim">[{a.year}] <span class="text-matrix">OK</span></p>
							<p class="font-semibold text-matrix-soft">{a.title}</p>
							<p class="text-matrix-dim">{a.org}</p>
						</li>
					{/each}
				</ul>
			</div>
		</aside>
	</div>
</section>

<style>
	.node {
		position: absolute;
		left: 0;
		top: 0.2rem;
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 9999px;
		border: 2px solid var(--color-matrix-dim);
		background: var(--color-void);
	}
	.current .node {
		border-color: var(--color-matrix);
		background: var(--color-matrix);
		box-shadow: 0 0 10px rgb(0 255 102 / 0.8);
	}
	.edge {
		position: absolute;
		left: calc(0.35rem - 1px);
		top: 1.1rem;
		bottom: 0.1rem;
		width: 2px;
		background: linear-gradient(var(--color-matrix-line), rgb(13 59 31 / 0.4));
	}
</style>

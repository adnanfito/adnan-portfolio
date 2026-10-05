<script lang="ts">
	import { achievements, education, experiences, site, skills, socials } from '$lib/config';

	let { width, onclose }: { width: number; onclose?: () => void } = $props();

	const fontSize = $derived(Math.max(10.5, Math.min(15, width / 38)));
	const email = socials.find((s) => s.label === 'email');
	const linkedin = socials.find((s) => s.label === 'linkedin');
</script>

<div class="sheet light-surface" style:font-size="{fontSize}px">
	<div class="scroll">
		<header>
			<h2>{site.name}</h2>
			<p class="role">{site.role}</p>
			<p class="meta">
				{site.location}
				{#if email}· <a href={email.href}>{email.value}</a>{/if}
				{#if linkedin}· <a href={linkedin.href} target="_blank" rel="noopener">LinkedIn</a>{/if}
			</p>
		</header>

		<section>
			<h3>Experience</h3>
			<ol class="timeline">
				{#each experiences as exp (exp.role + exp.company)}
					<li class:current={exp.current}>
						<div class="flex flex-wrap items-baseline justify-between gap-x-3">
							<p class="font-bold">
								{exp.role} <span class="font-medium text-muted">@ {exp.company}</span>
							</p>
							<p class="period">{exp.period}</p>
						</div>
						<ul class="points">
							{#each exp.highlights as h (h)}
								<li>{h}</li>
							{/each}
						</ul>
					</li>
				{/each}
			</ol>
		</section>

		<section>
			<h3>Education</h3>
			<div class="flex flex-wrap items-baseline justify-between gap-x-3">
				<p class="font-bold">
					{education.degree} <span class="font-medium text-muted">@ {education.school}</span>
				</p>
				<p class="period">{education.period}</p>
			</div>
			<p class="mt-[0.2em]">GPA {education.gpa}</p>
			<ul class="points">
				{#each education.notes as note (note)}
					<li>{note}</li>
				{/each}
			</ul>
		</section>

		<section>
			<h3>Achievements</h3>
			<ul class="space-y-[0.3em]">
				{#each achievements as a (a.title)}
					<li><span class="period">{a.year}</span> · <b>{a.title}</b> — {a.org}</li>
				{/each}
			</ul>
		</section>

		<section>
			<h3>Skills</h3>
			<p class="flex flex-wrap gap-[0.35em]">
				{#each skills as s (s)}<span class="chip text-[0.85em]">{s}</span>{/each}
			</p>
		</section>
	</div>

	<div class="actions">
		{#if onclose}<button class="pill" onclick={onclose}>✕ Close</button>{/if}
		<a class="pill-solid" href={site.cv} download>Download PDF ↓</a>
	</div>
</div>

<style>
	.sheet {
		position: relative;
		width: 100%;
		height: 100%;
		background: var(--color-paper);
		color: var(--color-ink);
		font-family: var(--font-sans);
		line-height: 1.45;
	}
	.scroll {
		height: 100%;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 2.2em 2.2em 5em;
		scrollbar-width: thin;
	}
	header {
		padding-bottom: 1em;
		border-bottom: 2px solid var(--color-ink);
	}
	h2 {
		font-size: 1.9em;
		font-weight: 800;
		line-height: 1.1;
		letter-spacing: -0.02em;
	}
	.role {
		margin-top: 0.25em;
		font-weight: 600;
		color: var(--color-peach);
		filter: brightness(0.85);
	}
	.meta {
		margin-top: 0.3em;
		font-size: 0.85em;
		color: var(--color-muted);
	}
	.meta a:hover {
		text-decoration: underline;
	}
	section {
		margin-top: 1.4em;
	}
	h3 {
		margin-bottom: 0.6em;
		font-size: 0.75em;
		font-weight: 800;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--color-muted);
	}
	.timeline > li {
		position: relative;
		padding-left: 1.1em;
		padding-bottom: 0.9em;
		border-left: 2px solid var(--color-line);
	}
	.timeline > li:last-child {
		padding-bottom: 0;
	}
	.timeline > li::before {
		content: '';
		position: absolute;
		left: calc(-0.35em - 1px);
		top: 0.4em;
		width: 0.7em;
		height: 0.7em;
		border-radius: 9999px;
		background: var(--color-paper);
		border: 2px solid var(--color-muted);
	}
	.timeline > li.current::before {
		background: var(--color-peach);
		border-color: var(--color-peach);
	}
	.period {
		font-size: 0.8em;
		font-weight: 600;
		color: var(--color-muted);
		white-space: nowrap;
	}
	.points {
		margin-top: 0.3em;
		font-size: 0.9em;
		color: rgb(46 42 38 / 0.82);
	}
	.points li {
		position: relative;
		padding-left: 0.9em;
	}
	.points li::before {
		content: '–';
		position: absolute;
		left: 0;
		color: var(--color-muted);
	}
	.actions {
		position: absolute;
		right: 1.2em;
		bottom: 1.2em;
		display: flex;
		gap: 0.5em;
		font-size: 0.9em;
	}
	.actions > :global(*) {
		box-shadow: 0 10px 24px -12px rgb(46 42 38 / 0.6);
	}
</style>

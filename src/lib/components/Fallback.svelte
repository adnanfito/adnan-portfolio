<script lang="ts">
	import { achievements, education, experiences, site, skills, socials } from '$lib/config';
	import type { Project } from '$lib/types';

	let { projects }: { projects: Project[] } = $props();
</script>

<!-- Plain, crawlable version of everything in the 3D room. Shown as the page itself when
     WebGL is unavailable, kept for screen readers and search engines otherwise. -->
<div class="flat-only mx-auto max-w-4xl space-y-20 px-4 pt-28 pb-16 sm:px-6">
	<section id="about">
		<p class="text-sm font-semibold text-muted">Hi, I'm</p>
		<h1 class="mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl">{site.name}</h1>
		<p class="mt-2 text-lg font-semibold text-peach brightness-90">{site.role}</p>
		<p class="mt-4 max-w-2xl text-ink/80">{site.bio}</p>
		<ul class="mt-4 flex flex-wrap gap-1.5" aria-label="Skills">
			{#each skills as s (s)}<li class="chip">{s}</li>{/each}
		</ul>
		<a href={site.cv} download class="pill-solid mt-6">Download CV ↓</a>
	</section>

	<section id="projects-list" aria-labelledby="projects-heading">
		<h2 id="projects-heading" class="text-2xl font-extrabold">Projects</h2>
		{#if projects.length}
			<ul class="mt-6 grid gap-5 sm:grid-cols-2">
				{#each projects as p (p.id)}
					<li class="card overflow-hidden">
						{#if p.image}
							<img
								src={p.image}
								alt="Screenshot of {p.title}"
								loading="lazy"
								class="aspect-[16/10] w-full object-cover object-top"
							/>
						{/if}
						<div class="p-5">
							<h3 class="font-bold">{p.title}</h3>
							{#if p.description}<p class="mt-1 text-sm text-ink/75">{p.description}</p>{/if}
							<p class="mt-3 flex flex-wrap gap-1.5">
								{#each p.technologies as t (t)}<span class="chip">{t}</span>{/each}
							</p>
							{#if p.link}
								<a href={p.link} target="_blank" rel="noopener" class="pill mt-4">Visit ↗</a>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="mt-4 text-muted">Projects load from Notion — check back in a moment.</p>
		{/if}
	</section>

	<section aria-labelledby="experience-heading">
		<h2 id="experience-heading" class="text-2xl font-extrabold">Experience</h2>
		<ol class="mt-6 space-y-6">
			{#each experiences as exp (exp.role + exp.company)}
				<li class="card p-5">
					<p class="text-xs font-semibold text-muted">{exp.period}</p>
					<h3 class="mt-1 font-bold">
						{exp.role} <span class="font-medium text-muted">@ {exp.company}</span>
					</h3>
					<ul class="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/80">
						{#each exp.highlights as h (h)}<li>{h}</li>{/each}
					</ul>
				</li>
			{/each}
		</ol>
		<div class="card mt-6 p-5">
			<h3 class="font-bold">{education.degree} — {education.school}</h3>
			<p class="text-sm text-muted">{education.period} · GPA {education.gpa}</p>
			<ul class="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/80">
				{#each education.notes as n (n)}<li>{n}</li>{/each}
				{#each achievements as a (a.title)}<li>{a.year} · {a.title} — {a.org}</li>{/each}
			</ul>
		</div>
	</section>

	<section aria-labelledby="contact-heading">
		<h2 id="contact-heading" class="text-2xl font-extrabold">Contact</h2>
		<ul class="mt-4 space-y-2">
			{#each socials as s (s.label)}
				<li>
					<a
						href={s.href}
						target={s.href.startsWith('http') ? '_blank' : undefined}
						rel={s.href.startsWith('http') ? 'noopener' : undefined}
						class="font-semibold underline decoration-line underline-offset-4 hover:decoration-ink"
						>{s.label}: {s.value}</a
					>
				</li>
			{/each}
		</ul>
	</section>

	<footer class="text-center text-xs text-muted">
		© {new Date().getFullYear()}
		{site.name}
	</footer>
</div>

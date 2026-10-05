<script lang="ts">
	import { site, skills, socials } from '$lib/config';

	type Step = { cmd: string; kind: 'whoami' | 'about' | 'skills' | 'status' };
	const steps: Step[] = [
		{ cmd: 'whoami', kind: 'whoami' },
		{ cmd: 'cat about.txt', kind: 'about' },
		{ cmd: 'ls ./skills', kind: 'skills' },
		{ cmd: 'status --work', kind: 'status' }
	];

	// SSR renders everything (crawlers + no-JS); the browser replays it as typing
	let ready = $state(false);
	let step = $state(steps.length);
	let typed = $state(Infinity);
	let done = $derived(step >= steps.length);

	const github = socials.find((s) => s.label === 'github')!;
	const linkedin = socials.find((s) => s.label === 'linkedin')!;

	$effect(() => {
		ready = true;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		step = 0;
		typed = 0;
		let cancelled = false;
		const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

		(async () => {
			await wait(450);
			for (let i = 0; i < steps.length && !cancelled; i++) {
				step = i;
				for (let c = 0; c <= steps[i].cmd.length && !cancelled; c++) {
					typed = c;
					await wait(45 + Math.random() * 55);
				}
				typed = Infinity;
				await wait(i === 0 ? 250 : 420);
			}
			if (!cancelled) step = steps.length;
		})();

		return () => (cancelled = true);
	});

	const shows = (i: number) => i < step || (i === step && typed === Infinity);
</script>

<div class="window w-full max-w-2xl overflow-hidden" class:pending={!ready} data-hero-terminal>
	<div class="window-bar">
		<span class="dot bg-[#ff5f56]"></span>
		<span class="dot bg-[#ffbd2e]"></span>
		<span class="dot bg-[#27c93f]"></span>
		<span class="ml-2 truncate">{site.handle}@fito: ~/portfolio — zsh</span>
	</div>

	<div class="min-h-[22rem] space-y-3 p-5 text-sm leading-relaxed sm:p-6 sm:text-[0.95rem]">
		{#each steps as s, i (s.cmd)}
			{#if i <= step}
				<div class="term-line">
					<p class="prompt text-matrix-soft">
						{i === step && typed !== Infinity
							? s.cmd.slice(0, typed)
							: s.cmd}{#if i === step && !done}<span class="cursor"></span>{/if}
					</p>

					{#if shows(i)}
						<div class="mt-1 pl-4">
							{#if s.kind === 'whoami'}
								<h1 class="glow text-2xl font-extrabold text-matrix sm:text-4xl">{site.name}</h1>
								<p class="mt-1 text-matrix-dim">
									{site.role} <span class="text-matrix/50">·</span>
									{site.location}
								</p>
							{:else if s.kind === 'about'}
								<p class="max-w-xl text-matrix-soft/90">{site.bio}</p>
							{:else if s.kind === 'skills'}
								<ul class="flex flex-wrap gap-x-4 gap-y-1">
									{#each skills as skill (skill)}
										<li class="text-keyword">{skill}/</li>
									{/each}
								</ul>
							{:else if s.kind === 'status'}
								<p class="flex flex-wrap items-center gap-x-2">
									<span class="relative flex size-2">
										<span
											class="absolute inline-flex size-full animate-ping rounded-full bg-matrix opacity-75"
										></span>
										<span class="relative inline-flex size-2 rounded-full bg-matrix"></span>
									</span>
									<span class="text-matrix">{site.available ? 'available for work' : 'busy'}</span>
									<span class="text-matrix-dim">— open to freelance &amp; full-time</span>
								</p>
							{/if}
						</div>
					{/if}
				</div>
			{/if}
		{/each}

		{#if done}
			<p class="prompt text-matrix-soft"><span class="cursor"></span></p>
		{/if}
	</div>

	<div class="flex flex-wrap gap-2 border-t border-matrix-line px-5 py-4 sm:px-6">
		<a href="#projects" class="btn-solid">./view-projects</a>
		<a href={site.cv} download class="btn">download cv ↓</a>
		<a href={github.href} target="_blank" rel="noopener" class="btn">github</a>
		<a href={linkedin.href} target="_blank" rel="noopener" class="btn">linkedin</a>
	</div>
</div>

<style>
	/* Hide the SSR'd transcript until hydration so it doesn't flash before typing starts */
	:global(html.js) .pending .term-line {
		visibility: hidden;
	}
</style>

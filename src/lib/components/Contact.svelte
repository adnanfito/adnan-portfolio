<script lang="ts">
	import { site, socials } from '$lib/config';
</script>

<section id="contact" class="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
	<div class="window mx-auto max-w-3xl overflow-hidden">
		<div class="window-bar">
			<span class="dot bg-[#ff5f56]"></span>
			<span class="dot bg-[#ffbd2e]"></span>
			<span class="dot bg-[#27c93f]"></span>
			<span class="ml-2 truncate">~/contact</span>
		</div>

		<div class="p-6 sm:p-10">
			<p class="prompt text-sm text-matrix-dim">./contact --list</p>
			<h2 class="glow mt-3 text-3xl font-extrabold text-matrix sm:text-5xl">
				Let's build something.
			</h2>
			<p class="mt-3 max-w-xl text-sm text-matrix-soft/85">
				Have a project, a role, or just want to talk backend &amp; AI? My inbox is open.
			</p>

			<ul class="mt-8 divide-y divide-matrix-line border-y border-matrix-line">
				{#each socials as s (s.label)}
					<li>
						<a
							href={s.href}
							target={s.href.startsWith('http') ? '_blank' : undefined}
							rel={s.href.startsWith('http') ? 'noopener' : undefined}
							download={s.label === 'resume' ? '' : undefined}
							class="group grid grid-cols-[6.5rem_1fr_auto] items-center gap-3 py-3 text-sm transition-colors hover:bg-matrix/5 sm:grid-cols-[8rem_1fr_auto]"
						>
							<span class="text-prop">{s.label}</span>
							<span class="truncate text-matrix-soft group-hover:text-matrix">{s.value}</span>
							<span
								class="text-matrix-dim transition-transform group-hover:translate-x-1 group-hover:text-matrix"
								aria-hidden="true">→</span
							>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<footer class="mt-16 flex flex-col items-center gap-1 text-center text-xs text-matrix-dim">
		<p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
		<p>built with SvelteKit + Threlte · data via Notion</p>
		<p class="text-matrix/60">[process exited with code 0]</p>
	</footer>
</section>

<script lang="ts">
	import { navLinks, site } from '$lib/config';
</script>

<header
	class="fixed inset-x-0 top-0 z-40 border-b border-matrix-line/60 bg-void/70 backdrop-blur-md"
>
	<nav
		class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 text-xs sm:px-6 sm:text-sm"
	>
		<a href="#home" class="shrink-0 text-matrix-dim hover:text-matrix">
			<span class="text-matrix">{site.handle}<span class="hidden sm:inline">@portfolio</span></span
			><span class="hidden sm:inline">:~</span>$
		</a>
		<ul class="flex items-center sm:gap-3">
			{#each navLinks as link (link.href)}
				<li>
					<a
						href={link.href}
						class="rounded px-1.5 py-1 text-matrix-dim sm:px-2 transition-colors hover:bg-matrix/10 hover:text-matrix"
					>
						<span class="hidden text-matrix/60 sm:inline">./</span>{link.label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</header>

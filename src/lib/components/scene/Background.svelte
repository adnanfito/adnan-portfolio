<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { NoToneMapping } from 'three';
	import Scene from './Scene.svelte';

	let reduced = $state(false);
	let scroll = $state(0);

	$effect(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		reduced = mq.matches;
		const onChange = () => (reduced = mq.matches);
		mq.addEventListener('change', onChange);

		const onScroll = () => {
			scroll = Math.min(window.scrollY / window.innerHeight, 3);
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });

		return () => {
			mq.removeEventListener('change', onChange);
			window.removeEventListener('scroll', onScroll);
		};
	});
</script>

<div class="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
	<Canvas dpr={[1, 1.5]} toneMapping={NoToneMapping} renderMode={reduced ? 'on-demand' : 'always'}>
		<Scene animate={!reduced} {scroll} />
	</Canvas>
</div>

<script lang="ts">
	import { T } from '@threlte/core';
	import { HTML } from '@threlte/extras';
	import type { Snippet } from 'svelte';
	import { Group } from 'three';
	import { PAPER } from './layout';
	import { clay, palette } from './materials';

	type Props = {
		root?: Group;
		/** HTML visible */
		on: boolean;
		px: { w: number; h: number };
		children: Snippet;
	};

	let { root = $bindable(), on, px, children }: Props = $props();

	const distanceFactor = $derived((PAPER.width / px.w) * 400);
	// Fake text lines, seen from afar before the HTML takes over
	const PAD = 0.03;
	const inner = PAPER.width - PAD * 2;
	const lines = Array.from({ length: 12 }, (_, i) => ({
		y: PAPER.height / 2 - 0.045 - i * 0.027,
		w: inner * (i === 0 ? 0.6 : i % 4 === 1 ? 0.35 : 0.7 + ((i * 37) % 7) * 0.04)
	}));
</script>

<T.Group bind:ref={root}>
	<T.Mesh material={clay(palette.paper, 0.95)} castShadow receiveShadow>
		<T.BoxGeometry args={[PAPER.width, PAPER.height, 0.003]} />
	</T.Mesh>
	{#each lines as l, i (i)}
		<!-- Only until the real CV is on top, so they never show through it -->
		<T.Mesh
			visible={!on}
			position={[-PAPER.width / 2 + PAD + l.w / 2, l.y, 0.0017]}
			material={clay(i === 0 ? palette.glasses : '#cfc6b8')}
		>
			<T.PlaneGeometry args={[l.w, i === 0 ? 0.016 : 0.007]} />
		</T.Mesh>
	{/each}

	<HTML transform position={[0, 0, 0.003]} {distanceFactor} pointerEvents={on ? 'auto' : 'none'}>
		<div
			class="paper"
			class:on
			style:width="{px.w}px"
			style:height="{px.h}px"
			inert={!on}
			aria-hidden={!on}
		>
			{@render children()}
		</div>
	</HTML>
</T.Group>

<style>
	.paper {
		overflow: hidden;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.15s ease,
			visibility 0s linear 0.15s;
	}
	.paper.on {
		opacity: 1;
		visibility: visible;
		transition:
			opacity 0.45s ease 0.1s,
			visibility 0s;
	}
</style>

<script lang="ts">
	import { T } from '@threlte/core';
	import { HTML, RoundedBoxGeometry, type IntersectionEvent } from '@threlte/extras';
	import type { Snippet } from 'svelte';
	import { Group } from 'three';
	import { LAPTOP } from './layout';
	import { clay, palette } from './materials';

	type Props = {
		root?: Group;
		lid?: Group;
		/** Screen lit + HTML visible */
		on: boolean;
		/** CSS pixel size of the screen content */
		px: { w: number; h: number };
		screen: Snippet;
		onclick?: (e: IntersectionEvent<MouseEvent>) => void;
		onpointerenter?: (e: IntersectionEvent<PointerEvent>) => void;
		onpointerleave?: (e: IntersectionEvent<PointerEvent>) => void;
	};

	let {
		root = $bindable(),
		lid = $bindable(),
		on,
		px,
		screen,
		onclick,
		onpointerenter,
		onpointerleave
	}: Props = $props();

	const { width: W, depth: D, base: B, lid: L } = LAPTOP;
	const body = clay(palette.laptop, 0.45);
	const keys = clay('#3a3b44', 0.7);
	const bezel = clay(palette.bezel, 0.5);

	const stickers = [
		{ x: -0.13, z: 0.1, r: 0.042, color: palette.rose, shape: 'circle' },
		{ x: 0.0, z: 0.2, r: 0.05, color: palette.lilac, shape: 'hex' },
		{ x: 0.14, z: 0.11, r: 0.036, color: palette.peach, shape: 'circle' },
		{ x: -0.07, z: 0.255, r: 0.03, color: palette.sage, shape: 'circle' },
		{ x: 0.12, z: 0.265, r: 0.04, color: palette.sky, shape: 'pill' }
	] as const;

	// 1 CSS px ↔ world units, so the HTML exactly covers the screen
	const distanceFactor = $derived((LAPTOP.screen.width / px.w) * 400);
</script>

<T.Group bind:ref={root} {onclick} {onpointerenter} {onpointerleave}>
	<!-- Base -->
	<T.Mesh position={[0, B / 2, 0]} material={body} castShadow receiveShadow>
		<RoundedBoxGeometry args={[W, B, D]} radius={0.01} />
	</T.Mesh>
	<T.Mesh position={[0, B + 0.0005, -0.035]} material={keys}>
		<T.BoxGeometry args={[W * 0.84, 0.002, D * 0.46]} />
	</T.Mesh>
	<T.Mesh position={[0, B + 0.0005, 0.115]} material={clay('#c9ccd4', 0.4)}>
		<T.BoxGeometry args={[W * 0.32, 0.002, D * 0.22]} />
	</T.Mesh>

	<!-- Lid, hinged at the back edge of the base -->
	<T.Group position={[0, B + L / 2, -D / 2]} bind:ref={lid}>
		<T.Mesh position={[0, 0, D / 2]} material={body} castShadow receiveShadow>
			<RoundedBoxGeometry args={[W, L, D]} radius={0.007} />
		</T.Mesh>

		<!-- Stickers on the back -->
		{#each stickers as s (s.x)}
			<T.Mesh position={[s.x, L / 2 + 0.0015, s.z]} material={clay(s.color, 0.6)}>
				{#if s.shape === 'pill'}
					<RoundedBoxGeometry args={[s.r * 2.4, 0.003, s.r * 1.1]} radius={0.0015} />
				{:else}
					<T.CylinderGeometry args={[s.r, s.r, 0.003, s.shape === 'hex' ? 6 : 28]} />
				{/if}
			</T.Mesh>
		{/each}

		<!-- Screen side -->
		<T.Mesh position={[0, -L / 2 - 0.0008, D / 2]} rotation.x={Math.PI / 2} material={bezel}>
			<T.PlaneGeometry args={[W - 0.016, D - 0.016]} />
		</T.Mesh>
		<T.Mesh position={[0, -L / 2 - 0.0016, D / 2]} rotation.x={Math.PI / 2}>
			<T.PlaneGeometry args={[LAPTOP.screen.width, LAPTOP.screen.height]} />
			<T.MeshBasicMaterial color={on ? '#f7f7f5' : '#2f3240'} toneMapped={false} />
		</T.Mesh>

		<HTML
			transform
			position={[0, -L / 2 - 0.003, D / 2]}
			rotation.x={Math.PI / 2}
			{distanceFactor}
			pointerEvents={on ? 'auto' : 'none'}
		>
			<div
				class="screen"
				class:on
				style:width="{px.w}px"
				style:height="{px.h}px"
				inert={!on}
				aria-hidden={!on}
			>
				{@render screen()}
			</div>
		</HTML>
	</T.Group>
</T.Group>

<style>
	.screen {
		overflow: hidden;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.15s ease,
			visibility 0s linear 0.15s;
	}
	.screen.on {
		opacity: 1;
		visibility: visible;
		transition:
			opacity 0.5s ease 0.15s,
			visibility 0s;
	}
</style>

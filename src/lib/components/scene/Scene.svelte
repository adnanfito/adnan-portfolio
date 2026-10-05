<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { PerspectiveCamera } from 'three';
	import CodeCore from './CodeCore.svelte';
	import Effects from './Effects.svelte';
	import MatrixRain from './MatrixRain.svelte';

	type Props = { animate: boolean; scroll: number };
	let { animate, scroll }: Props = $props();

	const FOV = 50;
	const CAMERA_Z = 12;

	const { size } = useThrelte();
	const mobile = $derived($size.width < 768);

	// Below 1024px the terminal takes most of the width, so the core moves above/behind it
	const wide = $derived($size.width >= 1024);
	const RING_RADIUS = 2.5; // outermost part of CodeCore, in world units

	// Right edge of the hero terminal in px, measured from the DOM on every resize
	let terminalRight = $state(0);
	$effect(() => {
		void $size.width;
		const el = document.querySelector('[data-hero-terminal]');
		terminalRight = el?.getBoundingClientRect().right ?? $size.width * 0.6;
	});

	// Centre the core in the free space right of the terminal and shrink it to fit
	const core = $derived.by(() => {
		if (!wide) return { position: [0, 2.6, -2] as [number, number, number], scale: 0.8 };
		const halfWidth =
			CAMERA_Z * Math.tan(((FOV / 2) * Math.PI) / 180) * ($size.width / Math.max($size.height, 1));
		const unitsPerPx = (halfWidth * 2) / $size.width;
		const free = Math.max($size.width - terminalRight, 0);
		const centerPx = terminalRight + free / 2;
		const scale = Math.min(1, ((free / 2) * 0.78 * unitsPerPx) / RING_RADIUS);
		return {
			position: [(centerPx - $size.width / 2) * unitsPerPx, 0.2, 0] as [number, number, number],
			scale
		};
	});

	let camera = $state<PerspectiveCamera>();
	const pointer = { x: 0, y: 0 };

	$effect(() => {
		const onMove = (e: PointerEvent) => {
			pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
			pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
		};
		window.addEventListener('pointermove', onMove, { passive: true });
		return () => window.removeEventListener('pointermove', onMove);
	});

	useTask(
		(delta) => {
			if (!camera) return;
			const k = 1 - Math.exp(-delta * 2.5);
			camera.position.x += (pointer.x * 1.4 - camera.position.x) * k;
			camera.position.y += (-pointer.y * 0.9 - scroll * 1.5 - camera.position.y) * k;
			camera.lookAt(0, -scroll * 2, -12);
		},
		{ running: () => animate }
	);
</script>

<T.PerspectiveCamera
	makeDefault
	bind:ref={camera}
	fov={FOV}
	near={0.1}
	far={120}
	position={[0, 0, CAMERA_Z]}
	oncreate={(ref) => ref.lookAt(0, 0, -12)}
/>

<MatrixRain {animate} columns={mobile ? 70 : 150} cameraZ={CAMERA_Z} fov={FOV} />

<CodeCore {animate} {scroll} position={core.position} scale={core.scale} />

{#if !mobile}
	<Effects />
{/if}

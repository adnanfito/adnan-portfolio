<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { go, stage, type View } from '$lib/stage.svelte';
	import type { Project } from '$lib/types';
	import { ACESFilmicToneMapping, PCFShadowMap } from 'three';
	import Scene from './Scene.svelte';

	let { projects }: { projects: Project[] } = $props();

	// Clicking empty space while zoomed in goes back to the room
	let downView: View | null = null;
	const onpointerdown = () => (downView = stage.view);
	const onclick = (e: MouseEvent) => {
		const focused = stage.view === 'projects' || stage.view === 'experience';
		if (!(e.target instanceof HTMLCanvasElement)) return;
		if (focused && downView === stage.view && !stage.hovered) go('home');
	};
</script>

<!-- `isolate` keeps the HTML layers' huge z-indices inside this stacking context -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="fixed inset-0 isolate" {onclick} {onpointerdown}>
	<Canvas shadows={PCFShadowMap} dpr={[1, 1.75]} toneMapping={ACESFilmicToneMapping}>
		<Scene {projects} />
	</Canvas>
</div>

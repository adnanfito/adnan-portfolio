<script lang="ts">
	import { useTask, useThrelte } from '@threlte/core';
	import { interactivity } from '@threlte/extras';
	import { stage } from '$lib/stage.svelte';
	import type { Project } from '$lib/types';
	import Avatar from './Avatar.svelte';
	import CameraRig from './CameraRig.svelte';
	import Furniture from './Furniture.svelte';
	import HexBadges from './HexBadges.svelte';
	import Room from './Room.svelte';

	let { projects }: { projects: Project[] } = $props();

	// Listen on the canvas itself: events from the HTML layers (laptop screen, CV) would otherwise
	// bubble up with offsets relative to those elements and raycast into random objects
	const { renderer } = useThrelte();
	interactivity({ target: renderer.domElement });

	let frames = 0;
	const { stop } = useTask(() => {
		// A couple of frames so shadows and the HTML layers have settled before revealing
		if (++frames > 2) {
			stage.loaded = true;
			stop();
		}
	});
</script>

<CameraRig />
<Room />
<Furniture />
<HexBadges />
<Avatar {projects} />

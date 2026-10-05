<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { HTML, RoundedBoxGeometry, useCursor, type IntersectionEvent } from '@threlte/extras';
	import { go, stage, type View } from '$lib/stage.svelte';
	import { ExtrudeGeometry, Group, Shape } from 'three';
	import { WALL_Z, damp } from './layout';
	import { clay, palette } from './materials';

	const R = 0.27;
	const hex = new Shape();
	for (let i = 0; i <= 6; i++) {
		const a = Math.PI / 2 + (i * Math.PI) / 3;
		const r = R - 0.03;
		if (i === 0) hex.moveTo(Math.cos(a) * r, Math.sin(a) * r);
		else hex.lineTo(Math.cos(a) * r, Math.sin(a) * r);
	}
	const geometry = new ExtrudeGeometry(hex, {
		depth: 0.06,
		bevelEnabled: true,
		bevelThickness: 0.03,
		bevelSize: 0.03,
		bevelSegments: 4
	});

	const icon = clay('#fffaf1', 0.7);
	const gap = R * 1.85;
	const badges: { view: View; label: string; color: string; x: number; y: number }[] = [
		{ view: 'projects', label: 'Projects', color: palette.rose, x: 0, y: gap * 0.87 },
		{ view: 'experience', label: 'Experience', color: palette.lilac, x: -gap / 2, y: 0 },
		{ view: 'contact', label: 'Contact', color: palette.peach, x: gap / 2, y: 0 }
	];

	const cursor = useCursor();
	let hovered = $state<View | null>(null);
	const refs: Record<string, Group | undefined> = $state({});
	const pop: Record<string, number> = {};
	let time = 0;

	useTask((delta) => {
		time += delta;
		badges.forEach((b, i) => {
			const g = refs[b.view];
			if (!g) return;
			const on = hovered === b.view || stage.view === b.view;
			pop[b.view] = damp(pop[b.view] ?? 0, on ? 1 : 0, 10, delta);
			g.position.z = pop[b.view] * 0.08;
			g.scale.setScalar(1 + pop[b.view] * 0.08);
			g.rotation.y = stage.reducedMotion ? 0 : Math.sin(time * 0.8 + i * 2) * 0.06;
		});
	});
</script>

<T.Group position={[-1.3, 1.55, WALL_Z + 0.03]}>
	{#each badges as b (b.view)}
		<T.Group position={[b.x, b.y, 0]}>
			<T.Group
				bind:ref={refs[b.view]}
				onclick={(e: IntersectionEvent<MouseEvent>) => {
					e.stopPropagation();
					go(b.view);
				}}
				onpointerenter={() => {
					hovered = b.view;
					stage.hovered = b.label;
					cursor.onPointerEnter();
				}}
				onpointerleave={() => {
					hovered = null;
					stage.hovered = null;
					cursor.onPointerLeave();
				}}
			>
				<T.Mesh {geometry} material={clay(b.color, 0.7)} castShadow receiveShadow />

				<T.Group position={[0, 0, 0.11]}>
					{#if b.view === 'projects'}
						<!-- Rocket -->
						<T.Group rotation.z={-Math.PI / 4}>
							<T.Mesh material={icon}>
								<T.CapsuleGeometry args={[0.042, 0.1, 6, 16]} />
							</T.Mesh>
							<T.Mesh position={[0, 0.02, 0.04]} material={clay(b.color)}>
								<T.SphereGeometry args={[0.018, 12, 10]} />
							</T.Mesh>
							{#each [-1, 1] as s (s)}
								<T.Mesh position={[s * 0.05, -0.06, 0]} rotation.z={s * -0.5} material={icon}>
									<RoundedBoxGeometry args={[0.04, 0.06, 0.02]} radius={0.008} />
								</T.Mesh>
							{/each}
							<T.Mesh position={[0, -0.1, 0]} material={clay(palette.peach)}>
								<T.ConeGeometry args={[0.025, 0.05, 12]} />
							</T.Mesh>
						</T.Group>
					{:else if b.view === 'experience'}
						<!-- A CV page -->
						<T.Group rotation.z={0.08}>
							<T.Mesh material={icon}>
								<RoundedBoxGeometry args={[0.15, 0.19, 0.02]} radius={0.009} />
							</T.Mesh>
							{#each [0.05, 0.015, -0.02, -0.055] as y, i (y)}
								<T.Mesh position={[i === 0 ? -0.02 : 0, y, 0.012]} material={clay(b.color)}>
									<T.BoxGeometry args={[i === 0 ? 0.06 : 0.1, 0.014, 0.004]} />
								</T.Mesh>
							{/each}
						</T.Group>
					{:else}
						<!-- Speech bubble -->
						<T.Mesh material={icon}>
							<RoundedBoxGeometry args={[0.2, 0.14, 0.03]} radius={0.04} />
						</T.Mesh>
						<T.Mesh position={[-0.05, -0.08, 0]} rotation.z={0.5} material={icon}>
							<T.ConeGeometry args={[0.03, 0.06, 3]} />
						</T.Mesh>
						{#each [-0.05, 0, 0.05] as x (x)}
							<T.Mesh position={[x, 0, 0.018]} material={clay(b.color)}>
								<T.SphereGeometry args={[0.014, 10, 8]} />
							</T.Mesh>
						{/each}
					{/if}
				</T.Group>

				{#if hovered === b.view}
					<HTML position={[0, -R - 0.06, 0.1]} center pointerEvents="none">
						<span
							class="rounded-full bg-ink px-3 py-1 text-xs font-semibold whitespace-nowrap text-paper shadow-lg"
							>{b.label}</span
						>
					</HTML>
				{/if}
			</T.Group>
		</T.Group>
	{/each}
</T.Group>

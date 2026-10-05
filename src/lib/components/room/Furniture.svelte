<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { RoundedBoxGeometry, useCursor } from '@threlte/extras';
	import { stage } from '$lib/stage.svelte';
	import { Group } from 'three';
	import Limb from './Limb.svelte';
	import { damp } from './layout';
	import { clay, palette } from './materials';

	const chair = clay(palette.chair);
	const chairDeep = clay(palette.chairDeep);
	const wood = clay(palette.wood, 0.7);
	const white = clay(palette.white);
	const lamp = clay(palette.lamp, 0.6);

	const cursor = useCursor();
	const hover = (name: string | null) => {
		stage.hovered = name;
		if (name) cursor.onPointerEnter();
		else cursor.onPointerLeave();
	};

	// Plant leaves fan out of the pot; clicking it makes them wobble
	const leaves = Array.from({ length: 11 }, (_, i) => {
		const a = (i / 11) * Math.PI * 2 + (i % 2) * 0.3;
		const tilt = 0.25 + (i % 3) * 0.17;
		return { a, tilt, len: 0.42 + ((i * 7) % 5) * 0.05, deep: i % 2 === 0 };
	});
	let plant = $state<Group>();
	let wobble = 0;
	let wobbleT = 0;

	let lampOn = $state(true);

	useTask((delta) => {
		if (!plant) return;
		wobbleT += delta;
		wobble = damp(wobble, 0, 1.6, delta);
		plant.rotation.z = Math.sin(wobbleT * 14) * wobble * 0.12;
		plant.rotation.x = Math.cos(wobbleT * 11) * wobble * 0.06;
	});

	const books = [
		{ w: 0.42, h: 0.07, d: 0.3, color: palette.rose, rot: 0.08 },
		{ w: 0.38, h: 0.06, d: 0.27, color: palette.lilac, rot: -0.12 },
		{ w: 0.34, h: 0.065, d: 0.25, color: palette.sage, rot: 0.2 }
	];
</script>

<!-- Armchair -->
<T.Group>
	<T.Mesh position={[0, 0.25, -0.03]} material={chairDeep} castShadow receiveShadow>
		<RoundedBoxGeometry args={[1.72, 0.3, 1.04]} radius={0.1} smoothness={6} />
	</T.Mesh>
	<T.Mesh position={[0, 0.43, 0.03]} material={chair} castShadow receiveShadow>
		<RoundedBoxGeometry args={[1.26, 0.15, 0.92]} radius={0.07} smoothness={6} />
	</T.Mesh>
	<T.Mesh position={[0, 0.84, -0.44]} rotation.x={-0.08} material={chair} castShadow receiveShadow>
		<RoundedBoxGeometry args={[1.72, 1.0, 0.3]} radius={0.13} smoothness={6} />
	</T.Mesh>
	<T.Mesh
		position={[0, 0.8, -0.27]}
		rotation.x={-0.13}
		material={chairDeep}
		castShadow
		receiveShadow
	>
		<RoundedBoxGeometry args={[1.18, 0.6, 0.16]} radius={0.075} smoothness={6} />
	</T.Mesh>
	{#each [-1, 1] as side (side)}
		<T.Mesh position={[side * 0.75, 0.49, -0.02]} material={chair} castShadow receiveShadow>
			<RoundedBoxGeometry args={[0.26, 0.6, 1.06]} radius={0.12} smoothness={6} />
		</T.Mesh>
		{#each [-1, 1] as end (end)}
			<T.Mesh position={[side * 0.7, 0.05, end * 0.4]} material={wood} castShadow>
				<T.CylinderGeometry args={[0.035, 0.025, 0.1, 12]} />
			</T.Mesh>
		{/each}
	{/each}
</T.Group>

<!-- Plant on a little stool -->
<T.Group
	position={[-1.6, 0, 0.0]}
	onclick={() => (wobble = 1)}
	onpointerenter={() => hover('plant')}
	onpointerleave={() => hover(null)}
>
	<T.Mesh position={[0, 0.5, 0]} material={wood} castShadow receiveShadow>
		<T.CylinderGeometry args={[0.23, 0.23, 0.045, 32]} />
	</T.Mesh>
	{#each [0, 1, 2] as i (i)}
		{@const a = (i / 3) * Math.PI * 2 + 0.4}
		<Limb
			from={[Math.cos(a) * 0.13, 0.48, Math.sin(a) * 0.13]}
			to={[Math.cos(a) * 0.2, 0, Math.sin(a) * 0.2]}
			radius={0.018}
			material={wood}
		/>
	{/each}
	<T.Mesh position={[0, 0.69, 0]} material={clay(palette.pot)} castShadow receiveShadow>
		<T.CylinderGeometry args={[0.19, 0.14, 0.34, 32]} />
	</T.Mesh>
	<T.Mesh position={[0, 0.86, 0]} rotation.x={Math.PI / 2} material={clay(palette.pot)} castShadow>
		<T.TorusGeometry args={[0.185, 0.025, 10, 32]} />
	</T.Mesh>
	<T.Mesh position={[0, 0.85, 0]} material={clay('#6b4f3a')}>
		<T.CylinderGeometry args={[0.17, 0.17, 0.01, 24]} />
	</T.Mesh>
	<T.Group position={[0, 0.84, 0]} bind:ref={plant}>
		{#each leaves as l, i (i)}
			<T.Group rotation={[0, l.a, l.tilt]}>
				<T.Mesh
					position={[0, l.len / 2, 0]}
					scale={[0.07, l.len / 2, 0.022]}
					material={clay(l.deep ? palette.leafDeep : palette.leaf, 0.7)}
					castShadow
				>
					<T.SphereGeometry args={[1, 16, 12]} />
				</T.Mesh>
			</T.Group>
		{/each}
	</T.Group>
</T.Group>

<!-- Stack of books -->
<T.Group position={[-1.05, 0, 0.82]} rotation.y={0.35}>
	{#each books as b, i (i)}
		{@const y = books.slice(0, i).reduce((s, x) => s + x.h, 0) + b.h / 2}
		<T.Group position={[0, y, 0]} rotation.y={b.rot}>
			<T.Mesh material={clay(b.color)} castShadow receiveShadow>
				<RoundedBoxGeometry args={[b.w, b.h, b.d]} radius={0.012} />
			</T.Mesh>
			<T.Mesh position={[0.012, 0, 0]} material={white}>
				<T.BoxGeometry args={[b.w - 0.01, b.h * 0.72, b.d + 0.004]} />
			</T.Mesh>
		</T.Group>
	{/each}
</T.Group>

<!-- Side table with a mug and a desk lamp -->
<T.Group position={[1.5, 0, 0.0]}>
	<T.Mesh position={[0, 0.6, 0]} material={clay(palette.tableTop, 0.7)} castShadow receiveShadow>
		<T.CylinderGeometry args={[0.38, 0.38, 0.045, 48]} />
	</T.Mesh>
	{#each [0, 1, 2] as i (i)}
		{@const a = (i / 3) * Math.PI * 2 + 0.6}
		<Limb
			from={[Math.cos(a) * 0.22, 0.58, Math.sin(a) * 0.22]}
			to={[Math.cos(a) * 0.32, 0, Math.sin(a) * 0.32]}
			radius={0.016}
			material={white}
		/>
	{/each}

	<T.Group position={[-0.14, 0.623, 0.14]}>
		<T.Mesh position={[0, 0.06, 0]} material={clay(palette.mug)} castShadow>
			<T.CylinderGeometry args={[0.055, 0.05, 0.12, 24]} />
		</T.Mesh>
		<T.Mesh position={[0.06, 0.065, 0]} material={clay(palette.mug)} castShadow>
			<T.TorusGeometry args={[0.03, 0.01, 8, 16]} />
		</T.Mesh>
		<T.Mesh position={[0, 0.115, 0]} material={clay('#8a5a44')}>
			<T.CylinderGeometry args={[0.048, 0.048, 0.005, 20]} />
		</T.Mesh>
	</T.Group>

	<T.Group
		position={[0.1, 0.623, -0.12]}
		onclick={() => (lampOn = !lampOn)}
		onpointerenter={() => hover('lamp')}
		onpointerleave={() => hover(null)}
	>
		<T.Mesh position={[0, 0.015, 0]} material={lamp} castShadow>
			<T.CylinderGeometry args={[0.1, 0.11, 0.03, 32]} />
		</T.Mesh>
		<Limb from={[0, 0.03, 0]} to={[0.05, 0.36, -0.02]} radius={0.016} material={lamp} />
		<T.Mesh position={[0.05, 0.36, -0.02]} material={lamp}>
			<T.SphereGeometry args={[0.028, 12, 10]} />
		</T.Mesh>
		<Limb from={[0.05, 0.36, -0.02]} to={[-0.17, 0.46, 0.05]} radius={0.014} material={lamp} />
		<T.Group position={[-0.17, 0.46, 0.05]} rotation={[0.2, 0, 0.75]}>
			<T.Mesh position={[0, -0.05, 0]} material={lamp} castShadow>
				<T.CylinderGeometry args={[0.04, 0.11, 0.13, 32, 1, true]} />
			</T.Mesh>
			<T.Mesh position={[0, -0.11, 0]}>
				<T.SphereGeometry args={[0.035, 16, 12]} />
				<T.MeshBasicMaterial color={lampOn ? '#fff1c9' : '#d9d2c4'} toneMapped={false} />
			</T.Mesh>
			{#if lampOn}
				<T.PointLight position={[0, -0.16, 0]} intensity={0.9} distance={2.4} color="#ffd59a" />
			{/if}
		</T.Group>
	</T.Group>
</T.Group>

<!-- Backpack leaning on the floor -->
<T.Group position={[1.02, 0, 0.72]} rotation.y={-0.5}>
	<T.Mesh
		position={[0, 0.22, 0]}
		rotation.x={-0.08}
		material={clay(palette.bag)}
		castShadow
		receiveShadow
	>
		<RoundedBoxGeometry args={[0.38, 0.44, 0.22]} radius={0.09} smoothness={5} />
	</T.Mesh>
	<T.Mesh position={[0, 0.15, 0.11]} material={clay(palette.bagDeep)} castShadow>
		<RoundedBoxGeometry args={[0.27, 0.18, 0.08]} radius={0.04} />
	</T.Mesh>
	<T.Mesh position={[0, 0.4, 0.04]} rotation.x={0.25} material={clay(palette.bagDeep)} castShadow>
		<RoundedBoxGeometry args={[0.34, 0.08, 0.2]} radius={0.035} />
	</T.Mesh>
	{#each [-1, 1] as side (side)}
		<T.Mesh position={[side * 0.09, 0.33, 0.135]} material={clay(palette.sky)}>
			<RoundedBoxGeometry args={[0.03, 0.1, 0.012]} radius={0.005} />
		</T.Mesh>
	{/each}
</T.Group>

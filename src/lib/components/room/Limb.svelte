<script lang="ts">
	import { T } from '@threlte/core';
	import { Quaternion, Vector3, type Material } from 'three';

	type Props = {
		from: [number, number, number];
		to: [number, number, number];
		radius: number;
		material: Material;
	};

	let { from, to, radius, material }: Props = $props();

	const UP = new Vector3(0, 1, 0);

	/** A capsule stretched between two points */
	const t = $derived.by(() => {
		const a = new Vector3(...from);
		const b = new Vector3(...to);
		const dir = b.clone().sub(a);
		const length = dir.length();
		return {
			position: a.add(b).multiplyScalar(0.5).toArray(),
			quaternion: new Quaternion().setFromUnitVectors(UP, dir.normalize()).toArray(),
			length
		};
	});
</script>

<T.Mesh position={t.position} quaternion={t.quaternion} {material} castShadow receiveShadow>
	<T.CapsuleGeometry args={[radius, t.length, 6, 16]} />
</T.Mesh>

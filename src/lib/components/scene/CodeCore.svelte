<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Float } from '@threlte/extras';
	import { AdditiveBlending, Group } from 'three';

	type Props = {
		animate: boolean;
		position: [number, number, number];
		scale: number;
		/** 0 → hero in view, 1 → scrolled one viewport down */
		scroll: number;
	};

	let { animate, position, scale, scroll }: Props = $props();

	let outer = $state<Group>();
	let inner = $state<Group>();
	let ring = $state<Group>();

	useTask(
		(delta) => {
			const boost = 1 + scroll * 3;
			if (outer) {
				outer.rotation.y += delta * 0.18 * boost;
				outer.rotation.x += delta * 0.07 * boost;
			}
			if (inner) {
				inner.rotation.y -= delta * 0.5 * boost;
				inner.rotation.z += delta * 0.3;
			}
			if (ring) ring.rotation.z += delta * 0.4;
		},
		{ running: () => animate }
	);

	const green = '#00ff66';
</script>

<T.Group
	position.x={position[0]}
	position.y={position[1] + scroll * 7}
	position.z={position[2]}
	{scale}
>
	<Float floatIntensity={animate ? 1.2 : 0} rotationIntensity={animate ? 0.3 : 0} speed={1.4}>
		<T.Group bind:ref={outer}>
			<T.Mesh>
				<T.IcosahedronGeometry args={[1.7, 1]} />
				<T.MeshBasicMaterial
					color={green}
					wireframe
					transparent
					opacity={0.5}
					blending={AdditiveBlending}
					depthWrite={false}
				/>
			</T.Mesh>
			<T.Points>
				<T.IcosahedronGeometry args={[1.7, 1]} />
				<T.PointsMaterial
					color="#b9ffd2"
					size={0.07}
					transparent
					opacity={0.9}
					blending={AdditiveBlending}
					depthWrite={false}
				/>
			</T.Points>
		</T.Group>

		<T.Group bind:ref={inner}>
			<T.Mesh>
				<T.TorusKnotGeometry args={[0.72, 0.2, 96, 10, 2, 3]} />
				<T.MeshBasicMaterial
					color={green}
					wireframe
					transparent
					opacity={0.16}
					blending={AdditiveBlending}
					depthWrite={false}
				/>
			</T.Mesh>
		</T.Group>

		<T.Group bind:ref={ring} rotation.x={Math.PI / 2.4}>
			<T.Mesh>
				<T.TorusGeometry args={[2.5, 0.008, 4, 160]} />
				<T.MeshBasicMaterial color={green} transparent opacity={0.6} />
			</T.Mesh>
			<T.Mesh position.x={2.5}>
				<T.SphereGeometry args={[0.06, 12, 12]} />
				<T.MeshBasicMaterial color="#d6ffe4" />
			</T.Mesh>
		</T.Group>
	</Float>
</T.Group>

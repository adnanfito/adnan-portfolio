<script lang="ts">
	import { T } from '@threlte/core';
	import { RoundedBoxGeometry, type IntersectionEvent } from '@threlte/extras';
	import { ExtrudeGeometry, Group, Mesh, MeshBasicMaterial, Path, Shape } from 'three';
	import Hair from './Hair.svelte';
	import Limb from './Limb.svelte';
	import { ARM, CHARACTER_POS, SHOULDER } from './layout';
	import { clay, palette } from './materials';

	type Props = {
		head?: Group;
		eyes?: Group;
		neck?: Mesh;
		placket?: Group;
		torso?: Group;
		upperL?: Group;
		foreL?: Group;
		upperR?: Group;
		foreR?: Group;
		onclick?: (e: IntersectionEvent<MouseEvent>) => void;
		onpointerenter?: (e: IntersectionEvent<PointerEvent>) => void;
		onpointerleave?: (e: IntersectionEvent<PointerEvent>) => void;
	};

	let {
		head = $bindable(),
		eyes = $bindable(),
		neck = $bindable(),
		placket = $bindable(),
		torso = $bindable(),
		upperL = $bindable(),
		foreL = $bindable(),
		upperR = $bindable(),
		foreR = $bindable(),
		onclick,
		onpointerenter,
		onpointerleave
	}: Props = $props();

	const skin = clay(palette.skin);
	const skinShade = clay(palette.skinShade);
	const hair = clay(palette.hair, 0.6);
	const shirt = clay(palette.shirt);
	const pants = clay(palette.pants);
	const sock = clay(palette.sock);
	const shoe = clay(palette.shoe);
	const sole = clay(palette.sole);
	const dark = clay(palette.glasses, 0.4);
	const blush = new MeshBasicMaterial({ color: '#f39a9a', transparent: true, opacity: 0.45 });
	const lens = new MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.12 });

	/** Head radius; the skull is an ellipsoid of this sphere */
	const R = 0.27;
	const SKULL: [number, number, number] = [1, 0.95, 0.92];

	// Big square glasses: a rounded rectangle with a rounded rectangular hole
	const roundedRect = <T extends Shape | Path>(target: T, w: number, h: number, r: number) => {
		const x = -w / 2;
		const y = -h / 2;
		target.moveTo(x + r, y);
		target.lineTo(x + w - r, y);
		target.quadraticCurveTo(x + w, y, x + w, y + r);
		target.lineTo(x + w, y + h - r);
		target.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
		target.lineTo(x + r, y + h);
		target.quadraticCurveTo(x, y + h, x, y + h - r);
		target.lineTo(x, y + r);
		target.quadraticCurveTo(x, y, x + r, y);
		return target;
	};
	// Bold black rectangular frames, a little wider than tall
	const LENS = { w: 0.178, h: 0.13, rim: 0.023 };
	const frameShape = roundedRect(new Shape(), LENS.w, LENS.h, 0.026);
	frameShape.holes.push(
		roundedRect(new Path(), LENS.w - LENS.rim * 2, LENS.h - LENS.rim * 2, 0.014)
	);
	const frameGeometry = new ExtrudeGeometry(frameShape, {
		depth: 0.016,
		bevelEnabled: true,
		bevelThickness: 0.004,
		bevelSize: 0.003,
		bevelSegments: 2,
		curveSegments: 6
	});
	frameGeometry.center();

	const sides = [-1, 1] as const;
</script>

{#snippet arm()}
	<T.Mesh position={[0, -0.045, 0]} material={shirt} castShadow>
		<T.CapsuleGeometry args={[0.068, 0.07, 6, 16]} />
	</T.Mesh>
	<T.Mesh position={[0, -ARM.upper / 2, 0]} material={skin} castShadow>
		<T.CapsuleGeometry args={[0.046, ARM.upper - 0.04, 6, 12]} />
	</T.Mesh>
{/snippet}
{#snippet forearm()}
	<T.Mesh position={[0, -ARM.lower / 2, 0]} material={skin} castShadow>
		<T.CapsuleGeometry args={[0.043, ARM.lower - 0.03, 6, 12]} />
	</T.Mesh>
	<T.Mesh position={[0, -ARM.lower, 0]} scale={[1, 1.1, 0.8]} material={skin} castShadow>
		<T.SphereGeometry args={[ARM.hand, 16, 12]} />
	</T.Mesh>
{/snippet}

<T.Group position={CHARACTER_POS.toArray()} {onclick} {onpointerenter} {onpointerleave}>
	<!-- Hips + crossed legs -->
	<T.Mesh position={[0, 0.09, 0]} material={pants} castShadow receiveShadow>
		<RoundedBoxGeometry args={[0.4, 0.17, 0.32]} radius={0.07} />
	</T.Mesh>
	<Limb from={[-0.11, 0.08, 0.04]} to={[-0.33, 0.09, 0.3]} radius={0.078} material={pants} />
	<Limb from={[0.11, 0.08, 0.04]} to={[0.33, 0.1, 0.3]} radius={0.078} material={pants} />
	<Limb from={[-0.33, 0.09, 0.3]} to={[0.15, 0.07, 0.41]} radius={0.07} material={pants} />
	<Limb from={[0.33, 0.12, 0.3]} to={[-0.15, 0.14, 0.43]} radius={0.07} material={pants} />

	<!-- Sneakers poking out at each side -->
	{#each [{ x: 0.24, y: 0.07, z: 0.43, r: 0.25 }, { x: -0.24, y: 0.14, z: 0.45, r: -0.25 }] as f (f.x)}
		<T.Group position={[f.x, f.y, f.z]} rotation.y={Math.sign(f.x) * Math.PI * 0.5 + f.r}>
			<T.Mesh position={[0, 0, -0.02]} material={sock} castShadow>
				<T.CylinderGeometry args={[0.058, 0.06, 0.06, 16]} />
			</T.Mesh>
			<T.Mesh position={[0, -0.01, 0.07]} material={shoe} castShadow>
				<RoundedBoxGeometry args={[0.12, 0.09, 0.19]} radius={0.04} />
			</T.Mesh>
			<T.Mesh position={[0, -0.05, 0.07]} material={sole} castShadow>
				<RoundedBoxGeometry args={[0.125, 0.025, 0.2]} radius={0.012} />
			</T.Mesh>
		</T.Group>
	{/each}

	<!-- Torso (breathes) -->
	<T.Group bind:ref={torso}>
		<T.Mesh position={[0, 0.34, 0]} scale={[1, 1, 0.78]} material={shirt} castShadow receiveShadow>
			<T.CapsuleGeometry args={[0.175, 0.2, 8, 24]} />
		</T.Mesh>
		<T.Mesh position={[0, 0.57, 0]} rotation.x={Math.PI / 2} material={shirt} castShadow>
			<T.TorusGeometry args={[0.065, 0.022, 10, 24]} />
		</T.Mesh>
		<!-- Henley placket with buttons (hidden with the head in the point-of-view shots) -->
		<T.Group bind:ref={placket}>
			<T.Mesh position={[0, 0.49, 0.133]} rotation.x={-0.12} material={shirt}>
				<RoundedBoxGeometry args={[0.04, 0.13, 0.012]} radius={0.005} />
			</T.Mesh>
			{#each [0.535, 0.495, 0.455] as y (y)}
				<T.Mesh position={[0, y, 0.142]} material={clay('#4a4a52', 0.5)}>
					<T.SphereGeometry args={[0.0075, 10, 8]} />
				</T.Mesh>
			{/each}
		</T.Group>
		<T.Mesh position={[0, 0.61, 0]} material={skin} castShadow bind:ref={neck}>
			<T.CylinderGeometry args={[0.055, 0.06, 0.1, 16]} />
		</T.Mesh>

		<!-- Arms: upper groups are rotated by the IK in Avatar.svelte -->
		{#each sides as side (side)}
			<T.Group position={[side * SHOULDER.x, SHOULDER.y, SHOULDER.z]}>
				{#if side < 0}
					<T.Group bind:ref={upperL}>
						{@render arm()}
						<T.Group position={[0, -ARM.upper, 0]} bind:ref={foreL}>{@render forearm()}</T.Group>
					</T.Group>
				{:else}
					<T.Group bind:ref={upperR}>
						{@render arm()}
						<T.Group position={[0, -ARM.upper, 0]} bind:ref={foreR}>{@render forearm()}</T.Group>
					</T.Group>
				{/if}
			</T.Group>
		{/each}

		<!-- Head pivots at the neck -->
		<T.Group position={[0, 0.63, 0]} bind:ref={head}>
			<T.Group position={[0, R, 0]}>
				<T.Mesh scale={SKULL} material={skin} castShadow>
					<T.SphereGeometry args={[R, 48, 32]} />
				</T.Mesh>

				{#each sides as side (side)}
					<!-- Ears -->
					<T.Mesh position={[side * 0.262, -0.02, -0.01]} scale={[0.6, 1, 0.85]} material={skin}>
						<T.SphereGeometry args={[0.056, 16, 12]} />
					</T.Mesh>
					<!-- Blush -->
					<T.Mesh position={[side * 0.158, -0.075, 0.2]} rotation.y={side * 0.62} material={blush}>
						<T.CircleGeometry args={[0.034, 20]} />
					</T.Mesh>
					<!-- Eyebrows -->
					<T.Mesh
						position={[side * 0.1, 0.112, 0.214]}
						rotation={[-0.35, side * 0.4, Math.PI / 2 + side * 0.08]}
						material={hair}
					>
						<T.CapsuleGeometry args={[0.011, 0.055, 4, 8]} />
					</T.Mesh>
				{/each}

				<!-- Eyes (scaled on y to blink) -->
				<T.Group position={[0, 0.002, 0]} bind:ref={eyes}>
					{#each sides as side (side)}
						<T.Mesh position={[side * 0.088, 0, 0.226]} scale={[1, 1.15, 0.5]} material={dark}>
							<T.SphereGeometry args={[0.03, 16, 12]} />
						</T.Mesh>
						<T.Mesh position={[side * 0.088 + 0.01, 0.012, 0.242]}>
							<T.SphereGeometry args={[0.008, 8, 6]} />
							<T.MeshBasicMaterial color="#ffffff" />
						</T.Mesh>
					{/each}
				</T.Group>

				<!-- Nose + smile -->
				<T.Mesh position={[0, -0.055, 0.247]} scale={[1, 0.85, 0.9]} material={skinShade}>
					<T.SphereGeometry args={[0.03, 16, 12]} />
				</T.Mesh>
				<T.Mesh position={[0, -0.112, 0.214]} rotation={[-0.45, 0, Math.PI]} material={dark}>
					<T.TorusGeometry args={[0.034, 0.0075, 8, 20, Math.PI]} />
				</T.Mesh>

				<!-- Big square glasses -->
				<T.Group position={[0, 0.004, 0]}>
					{#each sides as side (side)}
						<T.Group position={[side * 0.098, 0, 0.252]} rotation.y={side * 0.2}>
							<T.Mesh geometry={frameGeometry} material={dark} castShadow />
							<T.Mesh material={lens}>
								<T.PlaneGeometry args={[LENS.w - LENS.rim * 2, LENS.h - LENS.rim * 2]} />
							</T.Mesh>
						</T.Group>
						<Limb
							from={[side * 0.18, 0.03, 0.225]}
							to={[side * 0.262, 0.03, -0.01]}
							radius={0.008}
							material={dark}
						/>
					{/each}
					<T.Mesh position={[0, 0.022, 0.266]} material={dark}>
						<RoundedBoxGeometry args={[0.04, 0.018, 0.016]} radius={0.006} />
					</T.Mesh>
				</T.Group>

				<!-- Textured middle part with curtain bangs -->
				<Hair radius={R} skull={SKULL} />
			</T.Group>
		</T.Group>
	</T.Group>
</T.Group>

<script lang="ts" module>
	import { SphereGeometry, Vector3 } from 'three';

	const smooth = (a: number, b: number, x: number) => {
		const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
		return t * t * (3 - 2 * t);
	};
	const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
	const frac = (x: number) => x - Math.floor(x);

	/** Side parting, as an azimuth from the front (+ is the character's left) */
	const PART = 0.45;
	/** Number of clumps around the head, and how much they slant with the sweep */
	const CLUMPS = 11;
	const SLANT = 1.7;

	/** 0 in the gap between two clumps, 1 at a clump's point; the point leans with the sweep */
	const clump = (u: number) => {
		const t = frac(u);
		return t < 0.7 ? t / 0.7 : (1 - t) / 0.3;
	};

	/** Where the hair ends before the clump points: fringe over the forehead, ears, nape */
	const baseEdge = (az: number) => {
		const side = Math.abs(az);
		const front = 1.12 - 0.14 * Math.exp(-((wrap(az - PART) / 0.35) ** 2));
		const toSide = smooth(0.85, 1.45, side);
		const toBack = smooth(1.9, 2.7, side);
		return front + (1.62 - front) * toSide + (2.05 - 1.62) * toBack;
	};

	/**
	 * Cartoon "swept fringe" hair as one sculpted mass: a sphere pushed out over the scalp by a
	 * thickness field (rounded volume, chunky clumps with grooves between them, a side parting),
	 * ending in pointed clump tips along the hairline and tucked into the head everywhere else.
	 */
	export const buildHair = (radius: number, skull: [number, number, number]) => {
		const g = new SphereGeometry(radius, 240, 160);
		const pos = g.attributes.position;
		const d = new Vector3();
		for (let i = 0; i < pos.count; i++) {
			d.fromBufferAttribute(pos, i).normalize();
			const polar = Math.acos(Math.min(1, Math.max(-1, d.y)));
			const az = Math.atan2(d.x, d.z);
			const base = baseEdge(az);
			const lean = (az / (Math.PI * 2)) * CLUMPS;

			// Pointed tips: the hairline dips further down at each clump's point
			const tipLength = 0.21 - 0.11 * smooth(0.9, 2.4, Math.abs(az));
			const edge = base + tipLength * (clump(lean + SLANT * base) - 0.35);
			const cover = smooth(edge + 0.012, edge - 0.05, polar);

			const frontness = 0.5 + 0.5 * Math.cos(az);
			let thick = 0.07;
			// Big rounded volume, a little more at the front
			thick += 0.27 * Math.exp(-(((polar - 0.5) / 0.62) ** 2)) * (0.6 + 0.4 * frontness);
			// Fluffy over the ears so the silhouette stays round
			thick += 0.07 * Math.exp(-(((polar - 1.25) / 0.3) ** 2)) * smooth(0.6, 1.3, Math.abs(az));
			// The fringe stands off the forehead
			thick += 0.09 * Math.exp(-(((polar - (edge - 0.17)) / 0.17) ** 2)) * frontness;
			// Chunky clumps: ridges that run down into the tips, grooves between them
			const ridge = Math.pow(clump(lean + SLANT * polar), 0.7);
			thick *= 1 - 0.42 * (1 - ridge) * smooth(0.2, 0.65, polar);
			// Side parting
			const fromPart = wrap(az - PART);
			thick *= 1 - 0.55 * Math.exp(-((fromPart / 0.07) ** 2)) * smooth(1.05, 0.35, polar);

			const r = radius * (0.9 + (0.1 + thick) * cover);
			pos.setXYZ(i, d.x * r * skull[0], d.y * r * skull[1], d.z * r * skull[2]);
		}
		g.computeVertexNormals();
		return g;
	};
</script>

<script lang="ts">
	import { T } from '@threlte/core';
	import { MeshStandardMaterial } from 'three';
	import { palette } from './materials';

	let { radius, skull }: { radius: number; skull: [number, number, number] } = $props();

	const geometry = $derived(buildHair(radius * 1.02, skull));
	const material = new MeshStandardMaterial({ color: palette.hair, roughness: 0.45 });
</script>

<T.Mesh {geometry} {material} />

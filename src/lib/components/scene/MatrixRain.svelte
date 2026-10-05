<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import {
		AdditiveBlending,
		Color,
		InstancedBufferAttribute,
		InstancedBufferGeometry,
		MathUtils,
		PlaneGeometry,
		ShaderMaterial
	} from 'three';
	import { ATLAS_COLS, ATLAS_ROWS, createGlyphAtlas } from './glyph-atlas';
	import { rainFragment, rainVertex } from './rain-shader';

	type Props = {
		animate: boolean;
		/** Number of glyph columns */
		columns: number;
		cameraZ: number;
		fov: number;
	};

	let { animate, columns, cameraZ, fov }: Props = $props();

	const CELL = 0.42;
	const NEAR_Z = -2;
	const FAR_Z = -46;

	const { size, invalidate } = useThrelte();
	const atlas = createGlyphAtlas(() => invalidate());

	const material = new ShaderMaterial({
		vertexShader: rainVertex,
		fragmentShader: rainFragment,
		transparent: true,
		depthWrite: false,
		blending: AdditiveBlending,
		uniforms: {
			uTime: { value: 0 },
			uAtlas: { value: atlas.texture },
			uGlyphs: { value: atlas.count },
			uCols: { value: ATLAS_COLS },
			uRows: { value: ATLAS_ROWS },
			uColor: { value: new Color('#00ff66') },
			uHeadColor: { value: new Color('#d6ffe4') },
			uOpacity: { value: 1 },
			uFogNear: { value: 14 },
			uFogFar: { value: 0 }
		}
	});

	$effect(() => {
		material.uniforms.uFogFar.value = cameraZ - FAR_Z + 2;
	});

	// Rebuild only when the aspect ratio meaningfully changes
	const aspectBucket = $derived(Math.round(($size.width / Math.max($size.height, 1)) * 4) / 4);

	const geometry = $derived.by(() => {
		const aspect = Math.max(aspectBucket, 0.4);
		const tanHalf = Math.tan(MathUtils.degToRad(fov / 2));
		const cols: { x: number; z: number; rows: number; top: number }[] = [];
		let total = 0;

		for (let i = 0; i < columns; i++) {
			// Bias towards distant columns for a deep tunnel of code
			const z = MathUtils.lerp(NEAR_Z, FAR_Z, Math.pow(Math.random(), 0.6));
			const halfH = (cameraZ - z) * tanHalf + 2; // margin for camera parallax
			const halfW = halfH * aspect;
			const rows = Math.ceil((halfH * 2) / CELL);
			cols.push({ x: MathUtils.randFloatSpread(halfW * 2), z, rows, top: halfH });
			total += rows;
		}

		const pos = new Float32Array(total * 3);
		const column = new Float32Array(total * 4);
		const cell = new Float32Array(total * 2);
		let n = 0;

		for (const c of cols) {
			const speed = MathUtils.randFloat(5, 16);
			const trail = MathUtils.randFloat(8, 26);
			const cycle = c.rows + trail + MathUtils.randFloat(0, c.rows * 0.8);
			const offset = Math.random() * cycle;
			const seed = Math.random() * 500;
			for (let r = 0; r < c.rows; r++, n++) {
				pos.set([c.x, c.top - r * CELL, c.z], n * 3);
				column.set([speed, offset, trail, cycle], n * 4);
				cell.set([r, seed], n * 2);
			}
		}

		const plane = new PlaneGeometry(CELL * 0.92, CELL * 0.92);
		const g = new InstancedBufferGeometry();
		g.setIndex(plane.index);
		g.setAttribute('position', plane.getAttribute('position'));
		g.setAttribute('uv', plane.getAttribute('uv'));
		g.setAttribute('aPos', new InstancedBufferAttribute(pos, 3));
		g.setAttribute('aColumn', new InstancedBufferAttribute(column, 4));
		g.setAttribute('aCell', new InstancedBufferAttribute(cell, 2));
		g.instanceCount = total;
		return g;
	});

	$effect(() => {
		const g = geometry;
		return () => g.dispose();
	});

	$effect(() => () => {
		material.dispose();
		atlas.texture.dispose();
	});

	// Static frame for reduced motion: pick a moment where columns are mid-fall
	material.uniforms.uTime.value = 7.3;

	useTask(
		(delta) => {
			// Wrap to keep shader hash inputs small on mediump GPUs
			material.uniforms.uTime.value = (material.uniforms.uTime.value + delta) % 2000;
		},
		{ running: () => animate }
	);
</script>

<T.Mesh {geometry} {material} frustumCulled={false} renderOrder={-1} />

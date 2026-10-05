<script lang="ts">
	import { useTask, useThrelte } from '@threlte/core';
	import {
		BlendFunction,
		BloomEffect,
		EffectComposer,
		EffectPass,
		NoiseEffect,
		RenderPass,
		VignetteEffect
	} from 'postprocessing';
	import { HalfFloatType, type Camera, type WebGLRenderer } from 'three';

	const { scene, renderer, camera, size, autoRender, renderStage } = useThrelte();

	const composer = new EffectComposer(renderer as WebGLRenderer, {
		frameBufferType: HalfFloatType
	});

	const setup = (cam: Camera) => {
		composer.removeAllPasses();
		const bloom = new BloomEffect({
			intensity: 1.25,
			luminanceThreshold: 0.18,
			luminanceSmoothing: 0.3,
			mipmapBlur: true,
			radius: 0.7
		});
		const noise = new NoiseEffect({ blendFunction: BlendFunction.OVERLAY });
		noise.blendMode.opacity.value = 0.12;
		const vignette = new VignetteEffect({ offset: 0.3, darkness: 0.75 });
		composer.addPass(new RenderPass(scene, cam));
		composer.addPass(new EffectPass(cam, bloom, noise, vignette));
	};

	$effect(() => setup($camera));
	$effect(() => composer.setSize($size.width, $size.height));

	$effect(() => {
		const before = autoRender.current;
		autoRender.set(false);
		return () => {
			autoRender.set(before);
			composer.dispose();
		};
	});

	useTask((delta) => composer.render(delta), { stage: renderStage, autoInvalidate: false });
</script>

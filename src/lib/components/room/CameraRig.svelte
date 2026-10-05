<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { stage, type View } from '$lib/stage.svelte';
	import { PerspectiveCamera, Vector3 } from 'three';
	import { CHARACTER_POS, POV_VIEWS, framing, rig } from './layout';

	const { size } = useThrelte();
	const frame = $derived(framing($size.width, $size.height));

	let camera = $state<PerspectiveCamera>();
	const pointer = { x: 0, y: 0 };

	$effect(() => {
		const onMove = (e: PointerEvent) => {
			pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
			pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
		};
		window.addEventListener('pointermove', onMove, { passive: true });
		return () => window.removeEventListener('pointermove', onMove);
	});

	const isPov = (v: View) => (POV_VIEWS as readonly View[]).includes(v);

	/** Above and just behind the character's head: POV shots are entered and left from here */
	const ABOVE_HEAD = new Vector3(CHARACTER_POS.x, 2.15, CHARACTER_POS.z - 0.12);
	const HEAD = new Vector3(CHARACTER_POS.x, CHARACTER_POS.y + 0.9, CHARACTER_POS.z);
	/** Eye level, and a point ahead on the lap: where the eyes rest between laptop and CV */
	const EYES = new Vector3(CHARACTER_POS.x, CHARACTER_POS.y + 1.0, CHARACTER_POS.z + 0.02);
	const LAP = new Vector3(CHARACTER_POS.x, CHARACTER_POS.y + 0.4, CHARACTER_POS.z + 0.75);

	// Current flight: a cubic Bézier from where the camera was to the new shot
	const flight = {
		view: null as View | null,
		t: 1,
		duration: 1,
		p0: new Vector3(),
		c1: new Vector3(),
		c2: new Vector3(),
		target0: new Vector3(),
		fov0: 34,
		pov: false,
		povToPov: false
	};
	const pos = new Vector3();
	const target = new Vector3();
	const parallax = new Vector3();
	const tmp = new Vector3();
	let fov = 34;
	let lastReady = false;

	const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
	const bezier = (out: Vector3, p0: Vector3, c1: Vector3, c2: Vector3, p3: Vector3, t: number) => {
		const u = 1 - t;
		return out
			.copy(p0)
			.multiplyScalar(u * u * u)
			.addScaledVector(c1, 3 * u * u * t)
			.addScaledVector(c2, 3 * u * t * t)
			.addScaledVector(p3, t * t * t);
	};

	const startFlight = (view: View) => {
		const end = frame.shots[view];
		const from = flight.view;
		const intoPov = isPov(view);
		const outOfPov = from !== null && isPov(from);
		const povToPov = intoPov && outOfPov;
		const lift = povToPov ? 0.04 : intoPov || outOfPov ? 0.9 : 0.15;

		flight.p0.copy(pos);
		flight.target0.copy(target);
		flight.fov0 = fov;
		flight.t = 0;
		// Into or out of the character's eyes: arc over the head instead of through the scene
		flight.c1.lerpVectors(pos, end.pos, 0.3).add(tmp.set(0, lift, 0));
		flight.c2.lerpVectors(pos, end.pos, 0.7).add(tmp.set(0, lift, 0));
		// From the room, enter (or leave) the eyes from above the head. Between the laptop and
		// the CV the camera just stays at eye level and turns from one to the other.
		if (outOfPov && !povToPov) flight.c1.copy(ABOVE_HEAD);
		if (intoPov && !povToPov) flight.c2.copy(ABOVE_HEAD);
		if (povToPov) {
			flight.c1.copy(EYES);
			flight.c2.copy(EYES);
		}
		flight.povToPov = povToPov;
		flight.duration = povToPov ? 2.1 : intoPov || outOfPov ? 1.9 : 1.2;
		flight.pov = intoPov || outOfPov;
		flight.view = view;
	};

	useTask((delta) => {
		if (!camera) return;
		const dt = Math.min(delta, 1 / 20);
		const view = stage.view;
		const shot = frame.shots[view];

		if (flight.view === null) {
			// First frame: start in place, no fly-in from the origin
			pos.copy(shot.pos);
			target.copy(shot.target);
			fov = shot.fov;
			flight.view = view;
		} else if (flight.view !== view) {
			startFlight(view);
		}

		flight.t = stage.reducedMotion ? 1 : Math.min(1, flight.t + dt / flight.duration);
		const e = ease(flight.t);

		// Subtle pointer parallax, only while resting in the room
		const k = !isPov(view) && flight.t >= 1 ? 1 : 0;
		parallax.lerp(tmp.set(pointer.x * 0.22 * k, -pointer.y * 0.12 * k, 0), 1 - Math.exp(-3 * dt));

		if (flight.t < 1) {
			bezier(pos, flight.p0, flight.c1, flight.c2, shot.pos, e);
			// Look at the destination a little before arriving there
			if (flight.povToPov) bezier(target, flight.target0, LAP, LAP, shot.target, e);
			else target.lerpVectors(flight.target0, shot.target, ease(Math.min(1, flight.t * 1.25)));
			fov = flight.fov0 + (shot.fov - flight.fov0) * e;
		} else {
			pos.copy(shot.pos);
			target.copy(shot.target);
			fov = shot.fov;
		}

		// The camera passes through the head on its way in: keep it hidden around there
		const nearHead = pos.distanceTo(HEAD) < (flight.pov && flight.t < 1 ? 0.85 : 0.42);
		rig.hideHead = nearHead;

		const ready = isPov(view) && flight.t > 0.8;
		if (ready !== lastReady) stage.povReady = lastReady = ready;

		if (camera.fov !== fov) {
			camera.fov = fov;
			camera.updateProjectionMatrix();
		}
		camera.position.copy(pos).add(parallax);
		camera.lookAt(target);
	});
</script>

<T.PerspectiveCamera makeDefault bind:ref={camera} fov={34} near={0.02} far={60} />

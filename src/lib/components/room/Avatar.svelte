<script lang="ts">
	import { useTask, useThrelte } from '@threlte/core';
	import { useCursor } from '@threlte/extras';
	import { go, stage } from '$lib/stage.svelte';
	import type { Project } from '$lib/types';
	import { Group, Mesh, Quaternion, Vector3 } from 'three';
	import Character from './Character.svelte';
	import CvPaper from './CvPaper.svelte';
	import CvSheet from './CvSheet.svelte';
	import Laptop from './Laptop.svelte';
	import ProjectBrowser from './ProjectBrowser.svelte';
	import {
		ARM,
		CHARACTER_POS,
		LAPTOP,
		LAPTOP_POSES,
		PAPER,
		PAPER_POSES,
		SHOULDER,
		damp,
		framing,
		rig
	} from './layout';

	let { projects }: { projects: Project[] } = $props();

	const { size } = useThrelte();
	const frame = $derived(framing($size.width, $size.height));

	let head = $state<Group>();
	let eyes = $state<Group>();
	let neck = $state<Mesh>();
	let placket = $state<Group>();
	let torso = $state<Group>();
	let upperL = $state<Group>();
	let foreL = $state<Group>();
	let upperR = $state<Group>();
	let foreR = $state<Group>();
	let laptop = $state<Group>();
	let lid = $state<Group>();
	let paper = $state<Group>();

	// --- pointer (normalised -1..1) ------------------------------------------------------------
	const pointer = { x: 0, y: 0 };
	$effect(() => {
		const onMove = (e: PointerEvent) => {
			pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
			pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
		};
		window.addEventListener('pointermove', onMove, { passive: true });
		return () => window.removeEventListener('pointermove', onMove);
	});

	// --- hover / click ---------------------------------------------------------------------------
	const cursor = useCursor();
	let laptopHovered = false;
	let waveUntil = 0;
	let time = 0;

	const hover = (name: string | null) => {
		stage.hovered = name;
		if (name) cursor.onPointerEnter();
		else cursor.onPointerLeave();
	};

	// --- animated state --------------------------------------------------------------------------
	const lap = { x: 0, y: 0, z: 0, rotY: 0, lid: 0, lift: 0 };
	Object.assign(lap, {
		x: LAPTOP_POSES.lap.pos[0],
		y: LAPTOP_POSES.lap.pos[1],
		z: LAPTOP_POSES.lap.pos[2],
		rotY: LAPTOP_POSES.lap.rotY,
		lid: LAPTOP_POSES.lap.lid
	});
	const sheet = {
		x: PAPER_POSES.stowed.pos[0],
		y: PAPER_POSES.stowed.pos[1],
		z: PAPER_POSES.stowed.pos[2],
		rotX: PAPER_POSES.stowed.rotX,
		scale: PAPER_POSES.stowed.scale
	};
	const look = { yaw: 0, pitch: 0, roll: 0 };
	const hands = { l: new Vector3(), r: new Vector3(), ready: false };
	let nextBlink = 2;

	// --- two-bone IK for the arms ---------------------------------------------------------------
	const DOWN = new Vector3(0, -1, 0);
	const v = {
		s: new Vector3(),
		t: new Vector3(),
		dir: new Vector3(),
		pole: new Vector3(),
		n: new Vector3(),
		u: new Vector3(),
		f: new Vector3(),
		q: new Quaternion()
	};

	/** Points `upper`/`fore` so the hand lands on `target` (character-local coordinates). */
	const solveArm = (side: -1 | 1, target: Vector3, upper: Group, fore: Group) => {
		const { upper: L1, lower: L2 } = ARM;
		v.t.copy(target).sub(v.s.set(side * SHOULDER.x, SHOULDER.y, SHOULDER.z));
		const d = Math.min(Math.max(v.t.length(), 0.06), L1 + L2 - 0.001);
		v.dir.copy(v.t).normalize();
		// Elbows point out and slightly down/back
		v.pole.set(side, -0.7, -0.35).normalize();
		v.n.copy(v.pole).addScaledVector(v.dir, -v.pole.dot(v.dir)).normalize();
		const a = Math.acos(Math.min(1, Math.max(-1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
		v.u.copy(v.dir).multiplyScalar(Math.cos(a)).addScaledVector(v.n, Math.sin(a));
		upper.quaternion.setFromUnitVectors(DOWN, v.u);
		// Forearm: from the elbow to the (clamped) target, expressed in the upper arm's space
		v.f.copy(v.dir).multiplyScalar(d).addScaledVector(v.u, -L1).normalize();
		v.f.applyQuaternion(v.q.copy(upper.quaternion).invert());
		fore.quaternion.setFromUnitVectors(DOWN, v.f);
	};

	/** Shortest signed angle from `a` to `b` */
	const turn = (a: number, b: number) => {
		const d = (((b - a) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2);
		return d - Math.PI;
	};

	const toLocal = (out: Vector3, obj: Group, x: number, y: number, z: number) =>
		obj.localToWorld(out.set(x, y, z)).sub(CHARACTER_POS);

	const tmpL = new Vector3();
	const tmpR = new Vector3();
	let lastScreen = false;
	let lastPaper = false;

	useTask((delta) => {
		if (!laptop || !lid || !paper || !head || !eyes || !torso) return;
		if (!upperL || !foreL || !upperR || !foreR) return;
		const dt = Math.min(delta, 1 / 20);
		time += dt;
		const fast = stage.reducedMotion ? 1000 : 1;
		const view = stage.view;

		// ---- laptop: opens on the lap for projects, closes and goes onto the armrest for the CV
		const aside = LAPTOP_POSES.aside;
		const goal =
			view === 'projects'
				? LAPTOP_POSES.open
				: view === 'experience'
					? aside
					: view === 'home' && laptopHovered
						? LAPTOP_POSES.peek
						: LAPTOP_POSES.lap;

		// Sequencing: the lid is shut while the laptop moves, and opens once it is back on the lap
		const moving = Math.hypot(lap.x - goal.pos[0], lap.y - goal.pos[1], lap.z - goal.pos[2]);
		let lidGoal = goal.lid;
		let posGoal = goal.pos;
		if (moving > 0.06) lidGoal = 0;
		if (moving > 0.06 && lap.lid > 0.25) posGoal = [lap.x, lap.y, lap.z];

		lap.x = damp(lap.x, posGoal[0], 4 * fast, dt);
		lap.y = damp(lap.y, posGoal[1], 4 * fast, dt);
		lap.z = damp(lap.z, posGoal[2], 4 * fast, dt);
		if (posGoal === goal.pos)
			lap.rotY = damp(lap.rotY, lap.rotY + turn(lap.rotY, goal.rotY), 3.6 * fast, dt);
		lap.lid = damp(lap.lid, lidGoal, (lidGoal > lap.lid ? 3.2 : 6) * fast, dt);
		const liftGoal = 0.1 * Math.min(1, moving / 0.3);
		lap.lift = damp(lap.lift, stage.reducedMotion ? 0 : liftGoal, 6 * fast, dt);

		laptop.position.set(lap.x, lap.y + lap.lift, lap.z);
		laptop.rotation.set(0, lap.rotY, 0);
		lid.rotation.x = -lap.lid;
		laptop.updateMatrixWorld(true);

		const screenReady = view === 'projects' && lap.lid > LAPTOP_POSES.open.lid - 0.2;
		if (screenReady !== lastScreen) stage.screenReady = lastScreen = screenReady;

		// ---- CV paper: comes up to read once the laptop is out of the way
		const showPaper =
			view === 'experience' && Math.hypot(lap.x - aside.pos[0], lap.z - aside.pos[2]) < 0.2;
		const p = showPaper ? PAPER_POSES.held : PAPER_POSES.stowed;
		const pk = showPaper ? 5 : 7;
		sheet.x = damp(sheet.x, p.pos[0], pk * fast, dt);
		sheet.y = damp(sheet.y, p.pos[1], pk * fast, dt);
		sheet.z = damp(sheet.z, p.pos[2], pk * fast, dt);
		sheet.rotX = damp(sheet.rotX, p.rotX, pk * fast, dt);
		sheet.scale = damp(sheet.scale, p.scale, (showPaper ? 6 : 10) * fast, dt);
		paper.position.set(sheet.x, sheet.y, sheet.z);
		paper.rotation.set(sheet.rotX, p.rotY, 0);
		paper.scale.setScalar(Math.max(sheet.scale, 0.001));
		paper.visible = sheet.scale > 0.02;
		paper.updateMatrixWorld(true);

		const paperReady =
			showPaper && Math.abs(sheet.y - PAPER_POSES.held.pos[1]) < 0.02 && sheet.scale > 0.97;
		if (paperReady !== lastPaper) stage.paperReady = lastPaper = paperReady;

		// ---- hands (the laptop and the paper face the character, so their local +x is his left)
		const top = LAPTOP.base + LAPTOP.lid + ARM.hand * 0.7;
		const waving = view === 'contact' || time < waveUntil;
		const holdingPaper = sheet.scale > 0.5;
		const onLap = lap.x < 0.3;
		const tap = (o: number) => Math.max(0, Math.sin(time * 11 + o)) * 0.014;

		if (holdingPaper) {
			toLocal(tmpL, paper, PAPER.width / 2 + 0.012, -0.04, -0.012);
			toLocal(tmpR, paper, -PAPER.width / 2 - 0.012, -0.04, -0.012);
		} else if (onLap && lap.lid > 0.6) {
			// Typing on the keyboard
			toLocal(tmpL, laptop, 0.085, LAPTOP.base + ARM.hand * 0.6 + tap(0), 0.0);
			toLocal(tmpR, laptop, -0.085, LAPTOP.base + ARM.hand * 0.6 + tap(1.7), 0.0);
		} else if (onLap) {
			// Resting on the closed lid, drumming now and then
			const drum = (o: number) => Math.max(0, Math.sin(time * 9 + o)) * 0.012;
			toLocal(tmpL, laptop, 0.12, top + drum(0), 0.1);
			toLocal(tmpR, laptop, -0.12, top + drum(2.1), 0.1);
		} else {
			// Hands on the knees
			tmpL.set(-0.2, 0.2, 0.3);
			tmpR.set(0.2, 0.2, 0.3);
		}
		if (waving) {
			tmpR.set(0.37 + Math.sin(time * 9) * 0.06, 0.88, 0.1);
			if (onLap && !holdingPaper) toLocal(tmpL, laptop, 0, top, 0.08);
		}

		if (!hands.ready) {
			hands.l.copy(tmpL);
			hands.r.copy(tmpR);
			hands.ready = true;
		}
		const hk = 1 - Math.exp(-14 * fast * dt);
		hands.l.lerp(tmpL, hk);
		hands.r.lerp(tmpR, hk);
		solveArm(-1, hands.l, upperL, foreL);
		solveArm(1, hands.r, upperR, foreR);

		// ---- head: follow the cursor in the room, look at the viewer when presenting
		const roomView = view === 'home' || view === 'contact';
		const yawGoal = roomView ? pointer.x * 0.55 : 0;
		// Looking down at the laptop / the paper in the POV views
		const pitchGoal = roomView ? pointer.y * 0.28 : view === 'projects' ? 0.38 : 0.2;
		const rollGoal = view === 'contact' ? 0.12 : Math.sin(time * 0.9) * 0.04;
		look.yaw = damp(look.yaw, yawGoal, 5 * fast, dt);
		look.pitch = damp(look.pitch, pitchGoal, 5 * fast, dt);
		look.roll = damp(look.roll, stage.reducedMotion ? 0 : rollGoal, 3 * fast, dt);
		head.rotation.set(look.pitch, look.yaw, look.roll);

		// ---- the camera flies into the character's eyes: hide the head around there
		head.visible = !rig.hideHead;
		if (neck) neck.visible = !rig.hideHead;
		if (placket) placket.visible = !rig.hideHead;

		// ---- idle: breathing + blinking
		if (!stage.reducedMotion) {
			torso.scale.y = 1 + Math.sin(time * 2.1) * 0.008;
			nextBlink -= dt;
			if (nextBlink < 0) nextBlink = 2.5 + Math.random() * 3;
			const b = nextBlink < 0.14 ? Math.abs(nextBlink - 0.07) / 0.07 : 1;
			eyes.scale.y = Math.max(0.1, b);
		}
	});
</script>

<Character
	bind:head
	bind:eyes
	bind:neck
	bind:placket
	bind:torso
	bind:upperL
	bind:foreL
	bind:upperR
	bind:foreR
	onclick={() => {
		if (stage.view === 'home') waveUntil = time + 2.2;
	}}
	onpointerenter={() => hover('character')}
	onpointerleave={() => hover(null)}
/>

<Laptop
	bind:root={laptop}
	bind:lid
	on={stage.screenReady && stage.povReady && !frame.compactScreen}
	px={frame.screenPx}
	onclick={(e) => {
		e.stopPropagation();
		if (stage.view !== 'projects') go('projects');
	}}
	onpointerenter={(e) => {
		e.stopPropagation();
		laptopHovered = true;
		hover('laptop');
	}}
	onpointerleave={() => {
		laptopHovered = false;
		hover(null);
	}}
>
	{#snippet screen()}
		<ProjectBrowser {projects} width={frame.screenPx.w} />
	{/snippet}
</Laptop>

<CvPaper
	bind:root={paper}
	on={stage.paperReady && stage.povReady && !frame.compactPaper}
	px={frame.paperPx}
>
	<CvSheet width={frame.paperPx.w} />
</CvPaper>

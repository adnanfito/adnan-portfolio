import { Object3D, Vector3 } from 'three';

/** Scene dimensions in world units (~metres). The character sits facing +z. */

export const SEAT_Y = 0.5;
export const WALL_Z = -1.5;

/** Character origin: centre of the seat cushion top */
export const CHARACTER_POS = new Vector3(0, SEAT_Y, -0.08);
/** Shoulder joints relative to the character origin */
export const SHOULDER = { x: 0.205, y: 0.47, z: 0 };
export const ARM = { upper: 0.23, lower: 0.22, hand: 0.055 };

export const LAPTOP = {
	width: 0.52,
	depth: 0.35,
	base: 0.024,
	lid: 0.014,
	screen: { width: 0.47, height: 0.29 }
};

export type LaptopPose = { pos: [number, number, number]; rotY: number; lid: number };

/** Lid angle is measured from closed (0) to flat open (π). */
export const LAPTOP_POSES = {
	/** On the lap, closed, the back of the lid with stickers facing up */
	lap: { pos: [0, 0.71, 0.3], rotY: Math.PI, lid: 0.03 },
	/** Same, peeking open while hovered */
	peek: { pos: [0, 0.71, 0.3], rotY: Math.PI, lid: 0.45 },
	/** Opened up on the lap to work on (screen faces the character) */
	open: { pos: [0, 0.71, 0.3], rotY: Math.PI, lid: 1.98 },
	/** Put away on the right armrest */
	aside: { pos: [0.75, 0.786, 0.0], rotY: -Math.PI / 2, lid: 0 }
} satisfies Record<string, LaptopPose>;

export const PAPER = { width: 0.3, height: 0.42 };

export type PaperPose = {
	pos: [number, number, number];
	rotX: number;
	rotY: number;
	scale: number;
};

export const PAPER_POSES = {
	/** Tucked flat on the seat, invisible */
	stowed: { pos: [-0.46, SEAT_Y + 0.02, 0.1], rotX: Math.PI / 2, rotY: Math.PI, scale: 0.001 },
	/** Held up in front of the chest, facing the character, top tilted away to read it */
	held: { pos: [0, 1.0, 0.33], rotX: 0.45, rotY: Math.PI, scale: 1 }
} satisfies Record<string, PaperPose>;

const root = new Object3D();
const hinge = new Object3D();
const screen = new Object3D();
root.add(hinge);
hinge.add(screen);
hinge.position.set(0, LAPTOP.base + LAPTOP.lid / 2, -LAPTOP.depth / 2);
screen.position.set(0, -LAPTOP.lid / 2 - 0.002, LAPTOP.depth / 2);
screen.rotation.x = Math.PI / 2;

/** World-space centre and facing direction of the laptop screen for a given pose. */
export const laptopScreenFrame = (pose: LaptopPose) => {
	root.position.set(...pose.pos);
	root.rotation.set(0, pose.rotY, 0);
	hinge.rotation.x = -pose.lid;
	root.updateMatrixWorld(true);
	return {
		center: screen.getWorldPosition(new Vector3()),
		normal: screen.getWorldDirection(new Vector3())
	};
};

export const paperFrame = (pose: PaperPose) => {
	root.position.set(...pose.pos);
	root.rotation.set(pose.rotX, pose.rotY, 0);
	hinge.rotation.x = 0;
	root.updateMatrixWorld(true);
	return {
		center: root.getWorldPosition(new Vector3()),
		normal: root.getWorldDirection(new Vector3())
	};
};

/**
 * Camera distance that makes a `worldW × worldH` rectangle fill `margin` of the viewport
 * (never further than `maxDist`), and the CSS pixel size the rectangle then has on screen,
 * so HTML laid on it renders 1:1.
 */
export const fit = (
	viewW: number,
	viewH: number,
	fovDeg: number,
	worldW: number,
	worldH: number,
	margin: number,
	maxDist = Infinity
) => {
	const t = Math.tan((fovDeg * Math.PI) / 360);
	const aspect = viewW / Math.max(viewH, 1);
	const byHeight = aspect > worldW / worldH;
	const ideal = byHeight ? worldH / 2 / (t * margin) : worldW / 2 / (t * aspect * margin);
	const dist = Math.min(ideal, maxDist);
	const pxW = (worldW * viewH) / (2 * dist * t);
	return {
		dist,
		pxW: Math.round(pxW),
		pxH: Math.round((pxW * worldH) / worldW),
		/** The rectangle is cropped because the camera couldn't back off far enough */
		cropped: ideal > maxDist
	};
};

export const fovFor = (width: number, height: number) => (width / height < 1 ? 48 : 34);

/** Exponential damping towards a target, frame-rate independent */
export const damp = (current: number, target: number, lambda: number, delta: number) =>
	current + (target - current) * (1 - Math.exp(-lambda * delta));

export type CameraShot = { pos: Vector3; target: Vector3; fov: number };

/** Written by the camera rig every frame: hide the head while the camera is in or near it */
export const rig = { hideHead: false };

/** Views seen through the character's eyes */
export const POV_VIEWS = ['projects', 'experience'] as const;

/** Camera shots for every view at a given viewport size, plus the HTML sizes they imply. */
export const framing = (width: number, height: number) => {
	const fov = fovFor(width, height);
	const aspect = width / Math.max(height, 1);
	const t = Math.tan((fov * Math.PI) / 360);
	const portrait = aspect < 1;
	const lg = width >= 1024;
	const dir = new Vector3(0, 0.17, 1).normalize();

	/** shiftX/shiftY move the room on screen (fractions of the half viewport; + is right/up) */
	const roomShot = (halfW: number, halfH: number, shiftX: number, shiftY: number): CameraShot => {
		const dist = Math.max(halfH / t, halfW / (t * aspect));
		const visW = dist * t * aspect;
		const visH = dist * t;
		const target = new Vector3(-shiftX * visW, 0.95 - shiftY * visH, 0);
		return { pos: target.clone().addScaledVector(dir, dist), target, fov };
	};

	// Home leaves room for the intro text: left column on desktop, top block on phones
	const home = portrait
		? roomShot(1.05, 1.2, 0, -0.32)
		: roomShot(lg ? 3.1 : 2.6, 1.45, lg ? 0.3 : 0, lg ? 0 : -0.08);
	// Contact leaves room for the card: right column on desktop, bottom sheet on phones
	const contact = portrait
		? roomShot(1.05, 1.2, 0, 0.4)
		: roomShot(lg ? 3 : 2.6, 1.45, lg ? -0.3 : 0, 0);

	// Point-of-view shots: a wider lens so the camera fits between the face and the laptop/paper
	const screen = laptopScreenFrame(LAPTOP_POSES.open);
	const screenFov = 50;
	const sf = fit(width, height, screenFov, LAPTOP.screen.width, LAPTOP.screen.height, 0.82, 0.5);
	const projects: CameraShot = {
		pos: screen.center.clone().addScaledVector(screen.normal, sf.dist),
		target: screen.center,
		fov: screenFov
	};

	const paper = paperFrame(PAPER_POSES.held);
	const paperFov = portrait ? 64 : 60;
	const pf = fit(width, height, paperFov, PAPER.width, PAPER.height, portrait ? 0.88 : 0.82, 0.62);
	const experience: CameraShot = {
		pos: paper.center.clone().addScaledVector(paper.normal, pf.dist),
		target: paper.center,
		fov: paperFov
	};

	return {
		shots: { home, contact, projects, experience },
		screenPx: { w: sf.pxW, h: sf.pxH },
		paperPx: { w: pf.pxW, h: pf.pxH },
		/** The laptop screen is too small to browse on: open the browser fullscreen instead */
		compactScreen: sf.cropped || sf.pxW < 640 || width < 700,
		compactPaper: pf.cropped || pf.pxW < 280
	};
};

import { SphereGeometry } from 'three';

/** Head radius; the skull is this sphere stretched into a slightly tall oval */
export const HEAD_R = 0.27;
export const SKULL: [number, number, number] = [0.9, 1.06, 0.92];

/** The head narrows towards the chin (an egg, not a ball). `y` is on the unit sphere. */
export const chinTaper = (y: number) => 1 - 0.17 * Math.pow(Math.max(0, -y), 1.4);

export const headGeometry = () => {
	const g = new SphereGeometry(HEAD_R, 64, 48);
	const pos = g.attributes.position;
	for (let i = 0; i < pos.count; i++) {
		const t = chinTaper(pos.getY(i) / HEAD_R);
		pos.setXYZ(i, pos.getX(i) * SKULL[0] * t, pos.getY(i) * SKULL[1], pos.getZ(i) * SKULL[2] * t);
	}
	g.computeVertexNormals();
	return g;
};

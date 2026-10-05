import { MeshStandardMaterial, type ColorRepresentation } from 'three';

export const palette = {
	background: '#f7e6d9',
	floor: '#f7e6d9',
	wall: '#f7e6d9',
	skin: '#f3c9a3',
	skinShade: '#e8b48c',
	hair: '#2e2019',
	shirt: '#2a2a2f',
	pants: '#d9cbb4',
	sock: '#fbf7f0',
	shoe: '#efe9df',
	sole: '#d8cfc1',
	glasses: '#1b1b1d',
	chair: '#93a9dd',
	chairDeep: '#8299cf',
	wood: '#c99467',
	laptop: '#d8dbe2',
	bezel: '#26262c',
	paper: '#fffdf8',
	pot: '#e58f6b',
	leaf: '#6fb58a',
	leafDeep: '#5aa277',
	lamp: '#b9a7f0',
	tableTop: '#f4dcb6',
	white: '#fbf8f2',
	mug: '#f2a7b5',
	bag: '#e8d8be',
	bagDeep: '#d9c6a7',
	rose: '#f2a7b5',
	lilac: '#b9a7f0',
	peach: '#f4b183',
	sage: '#8fbf9a',
	sky: '#93a9dd'
} as const;

const cache = new Map<string, MeshStandardMaterial>();

/** Matte "clay" material, shared per colour so the scene stays cheap */
export const clay = (color: ColorRepresentation, roughness = 0.85) => {
	const key = `${color}-${roughness}`;
	let m = cache.get(key);
	if (!m) {
		m = new MeshStandardMaterial({ color, roughness, metalness: 0 });
		cache.set(key, m);
	}
	return m;
};

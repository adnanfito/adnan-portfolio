import { CanvasTexture, LinearFilter, NoColorSpace } from 'three';

const KATAKANA = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
const CODE = '0123456789{}<>/=;$#*+-:[]()';

export const ATLAS_COLS = 8;
export const ATLAS_ROWS = 9;

/**
 * Draws Matrix-style glyphs (mirrored half-width katakana + code symbols)
 * into a grid texture. White on black, sampled from the red channel.
 */
export function createGlyphAtlas(onRedraw?: () => void, cell = 64) {
	const glyphs = (KATAKANA + CODE).slice(0, ATLAS_COLS * ATLAS_ROWS);
	const canvas = document.createElement('canvas');
	canvas.width = ATLAS_COLS * cell;
	canvas.height = ATLAS_ROWS * cell;
	const ctx = canvas.getContext('2d')!;
	const texture = new CanvasTexture(canvas);

	const draw = () => {
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = '#fff';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.font = `600 ${cell * 0.72}px "JetBrains Mono", "MS Gothic", monospace`;

		[...glyphs].forEach((g, i) => {
			const x = (i % ATLAS_COLS) * cell + cell / 2;
			const y = Math.floor(i / ATLAS_COLS) * cell + cell / 2;
			ctx.save();
			ctx.translate(x, y);
			if (i < KATAKANA.length) ctx.scale(-1, 1); // mirrored, like the film
			ctx.fillText(g, 0, 0);
			ctx.restore();
		});
		texture.needsUpdate = true;
	};
	draw();

	texture.colorSpace = NoColorSpace;
	texture.minFilter = LinearFilter;
	texture.magFilter = LinearFilter;
	texture.generateMipmaps = false;
	// Redraw once web fonts are in; the first pass may have used a fallback
	document.fonts?.ready.then(() => {
		draw();
		onRedraw?.();
	});
	return { texture, count: [...glyphs].length };
}

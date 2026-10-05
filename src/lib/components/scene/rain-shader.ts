export const rainVertex = /* glsl */ `
attribute vec3 aPos;
attribute vec4 aColumn; // speed, offset, trail, cycle
attribute vec2 aCell;   // row, seed

uniform float uTime;
uniform float uGlyphs;
uniform float uFogNear;
uniform float uFogFar;

varying vec2 vUv;
varying float vBright;
varying float vHead;
varying float vGlyph;
varying float vFog;

float hash(float n) { return fract(sin(n) * 43758.5453123); }

void main() {
	vUv = uv;
	float speed = aColumn.x;
	float offset = aColumn.y;
	float trail = aColumn.z;
	float cycle = aColumn.w;
	float row = aCell.x;
	float seed = aCell.y;

	// Row index of the falling head; rows behind it fade out along the trail
	float head = mod(uTime * speed + offset, cycle);
	float d = head - row;
	float lit = (d >= 0.0 && d < trail) ? pow(1.0 - d / trail, 1.6) : 0.0;
	vHead = (d >= 0.0 && d < 1.0) ? 1.0 : 0.0;
	// A few faint resting glyphs so columns never vanish completely
	vBright = max(lit, 0.05 * step(0.7, hash(seed * 7.13 + row)));

	float rate = mix(0.4, 2.5, hash(seed + row * 1.7));
	float tick = vHead > 0.5 ? floor(uTime * 16.0) : floor(uTime * rate + hash(row + seed) * 10.0);
	vGlyph = floor(hash(seed * 3.1 + row * 12.7 + mod(tick, 512.0) * 1.13) * uGlyphs);

	vec4 mv = modelViewMatrix * vec4(position + aPos, 1.0);
	vFog = 1.0 - smoothstep(uFogNear, uFogFar, -mv.z);
	gl_Position = projectionMatrix * mv;
}
`;

export const rainFragment = /* glsl */ `
uniform sampler2D uAtlas;
uniform float uCols;
uniform float uRows;
uniform vec3 uColor;
uniform vec3 uHeadColor;
uniform float uOpacity;

varying vec2 vUv;
varying float vBright;
varying float vHead;
varying float vGlyph;
varying float vFog;

void main() {
	float col = mod(vGlyph, uCols);
	float row = floor(vGlyph / uCols);
	vec2 uv = vec2((col + vUv.x) / uCols, 1.0 - (row + 1.0 - vUv.y) / uRows);
	float g = texture2D(uAtlas, uv).r;
	float a = g * vBright * vFog * uOpacity;
	if (a < 0.004) discard;
	vec3 c = mix(uColor, uHeadColor, vHead) * (1.0 + vHead * 1.5);
	gl_FragColor = vec4(c * a, 1.0);
	#include <colorspace_fragment>
}
`;

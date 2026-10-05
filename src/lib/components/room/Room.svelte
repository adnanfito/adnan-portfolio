<script lang="ts">
	import { T } from '@threlte/core';
	import { WALL_Z } from './layout';
	import { clay, palette } from './materials';
</script>

<T.Color attach="background" args={[palette.background]} />

<T.HemisphereLight args={['#fffaf2', '#e3cdbb', 1.6]} />
<T.DirectionalLight
	position={[-2.6, 5.5, 4.2]}
	intensity={2.1}
	color="#fff6ea"
	castShadow
	shadow.mapSize={[2048, 2048]}
	shadow.camera.left={-4}
	shadow.camera.right={4}
	shadow.camera.top={4}
	shadow.camera.bottom={-3}
	shadow.camera.near={0.5}
	shadow.camera.far={16}
	shadow.bias={-0.0004}
	shadow.normalBias={0.02}
/>
<T.DirectionalLight position={[3.5, 2.5, 3]} intensity={0.55} color="#f4ecff" />

<!-- Seamless pastel backdrop (unlit, so it matches the page exactly) with shadow catchers on top -->
<T.Mesh rotation.x={-Math.PI / 2}>
	<T.PlaneGeometry args={[60, 60]} />
	<T.MeshBasicMaterial color={palette.background} toneMapped={false} />
</T.Mesh>
<T.Mesh rotation.x={-Math.PI / 2} position.y={0.001} receiveShadow>
	<T.PlaneGeometry args={[60, 60]} />
	<T.ShadowMaterial color="#7a5642" opacity={0.2} />
</T.Mesh>
<T.Mesh position={[0, 5, WALL_Z]}>
	<T.PlaneGeometry args={[60, 10]} />
	<T.MeshBasicMaterial color={palette.background} toneMapped={false} />
</T.Mesh>
<T.Mesh position={[0, 5, WALL_Z + 0.001]} receiveShadow>
	<T.PlaneGeometry args={[60, 10]} />
	<T.ShadowMaterial color="#7a5642" opacity={0.14} />
</T.Mesh>
<T.Mesh position={[0, 0.006, 0.15]} receiveShadow material={clay('#f0d3be', 1)}>
	<T.CylinderGeometry args={[1.45, 1.45, 0.012, 64]} />
</T.Mesh>
<T.Mesh position={[0, 0.0135, 0.15]} rotation.x={-Math.PI / 2} receiveShadow>
	<T.RingGeometry args={[1.25, 1.31, 64]} />
	<T.MeshStandardMaterial color="#e6c2a8" roughness={1} />
</T.Mesh>

<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls, useGltf } from '@threlte/extras';
	import { onMount } from 'svelte';
	import * as THREE from 'three';

	// Import shader files
	import vertexShader from '$lib/shaders/vertex.vert?raw';
	import fragmentShader from '$lib/shaders/fragment.frag?raw';
	const gltf = useGltf('/porsche_911.glb');
	const floorGltf = useGltf('/road.glb');

	// Create shader material and animation
	let shaderMaterial: THREE.ShaderMaterial | null = null;
	let windMaterial: THREE.PointsMaterial | null = null;
	let windGeometry: THREE.BufferGeometry | null = null;
	let windParticles: THREE.Points | null = null;
	let camera: THREE.PerspectiveCamera | undefined;
	let animationId: number;
	let startTime = Date.now();
	const carPosition = new THREE.Vector3(0, -1.01, 0);

	// Store initial positions and velocities for animation
	let initialPositions: Float32Array;
	let particleVelocities: Float32Array;

	onMount(() => {
		// Create car shader material
		shaderMaterial = new THREE.ShaderMaterial({
			vertexShader,
			fragmentShader,
			uniforms: {
				uTime: { value: 0 },
				uCameraPosition: { value: new THREE.Vector3() },
				uBorderColor: { value: new THREE.Color(0.0, 1.0, 0.2) }, // Green color
				uBorderWidth: { value: 2.0 }
			}
		});

		// Create simple wind particle system with Points material
		const particleCount = 2000;
		const positions = new Float32Array(particleCount * 3);

		// Store initial positions and create velocities
		initialPositions = new Float32Array(particleCount * 3);
		particleVelocities = new Float32Array(particleCount * 3);

		// Initialize particles in a grid around the car
		for (let i = 0; i < particleCount; i++) {
			const i3 = i * 3;

			// Spread particles in front and around the car
			const x = (Math.random() - 0.5) * 8; // x
			const y = (Math.random() - 0.5) * 4; // y
			const z = 4 + Math.random() * 4; // z (in front of car)

			positions[i3] = x;
			positions[i3 + 1] = y;
			positions[i3 + 2] = z;

			// Store initial positions
			initialPositions[i3] = x;
			initialPositions[i3 + 1] = y;
			initialPositions[i3 + 2] = z;

			// Set velocities (generally moving backwards)
			particleVelocities[i3] = (Math.random() - 0.5) * 0.2; // x velocity
			particleVelocities[i3 + 1] = (Math.random() - 0.5) * 0.1; // y velocity
			particleVelocities[i3 + 2] = -0.5 - Math.random() * 1.0; // z velocity (backward)
		}

		windGeometry = new THREE.BufferGeometry();
		windGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

		windMaterial = new THREE.PointsMaterial({
			color: 0xff3333, // Red color
			size: 0.1,
			transparent: true,
			opacity: 0.6,
			blending: THREE.AdditiveBlending
		});

		windParticles = new THREE.Points(windGeometry, windMaterial);

		// Start animation loop
		const animate = () => {
			if (shaderMaterial && camera) {
				const elapsedTime = (Date.now() - startTime) / 1000;
				shaderMaterial.uniforms.uTime.value = elapsedTime;
				// Update camera position for Fresnel calculation
				shaderMaterial.uniforms.uCameraPosition.value.copy(camera.position);
			}

			// Animate wind particles
			if (windGeometry && windParticles) {
				const positions = windGeometry.attributes.position.array as Float32Array;
				const particleCount = positions.length / 3;

				for (let i = 0; i < particleCount; i++) {
					const i3 = i * 3;

					// Update positions based on velocity
					positions[i3] += particleVelocities[i3] * 0.016; // x
					positions[i3 + 1] += particleVelocities[i3 + 1] * 0.016; // y
					positions[i3 + 2] += particleVelocities[i3 + 2] * 0.016; // z

					// Reset particles that have gone too far back
					if (positions[i3 + 2] < -6) {
						positions[i3] = initialPositions[i3];
						positions[i3 + 1] = initialPositions[i3 + 1];
						positions[i3 + 2] = initialPositions[i3 + 2];
					}

					// Add some aerodynamic deflection near the car
					const distanceFromCar = Math.sqrt(
						(positions[i3] - carPosition.x) ** 2 +
							(positions[i3 + 1] - carPosition.y) ** 2 +
							(positions[i3 + 2] - carPosition.z) ** 2
					);

					if (distanceFromCar < 2.0) {
						// Push particles up and sideways around the car
						const deflectionStrength = (2.0 - distanceFromCar) * 0.01;
						positions[i3] += Math.sign(positions[i3] - carPosition.x) * deflectionStrength;
						positions[i3 + 1] += deflectionStrength * 0.5;
					}
				}

				windGeometry.attributes.position.needsUpdate = true;
			}

			animationId = requestAnimationFrame(animate);
		};
		animate();

		return () => {
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
	});

	// Apply shader to car model when both are loaded
	$: if ($gltf && shaderMaterial) {
		$gltf.scene.traverse((child: THREE.Object3D) => {
			if ((child as THREE.Mesh).isMesh && shaderMaterial) {
				(child as THREE.Mesh).material = shaderMaterial;
			}
		});
	}
</script>

<!-- Camera -->
<T.PerspectiveCamera makeDefault position={[0, 0, 5]} bind:ref={camera}>
	<OrbitControls enableDamping dampingFactor={0.05} minDistance={1} maxDistance={20} />
</T.PerspectiveCamera>

<!-- Add lighting for better visibility -->
<T.AmbientLight intensity={0.4} />
<T.DirectionalLight position={[5, 5, 5]} intensity={1} />
<T.DirectionalLight position={[-5, -5, -5]} intensity={0.5} />

<!-- Add a grey background -->
<T.Mesh>
	<T.SphereGeometry args={[50, 32, 32]} />
	<T.MeshBasicMaterial color="#4a4a4a" side={2} />
</T.Mesh>

<!-- Load and display your 3D model -->
{#await $gltf}
	<!-- Loading placeholder -->
	<T.Mesh>
		<T.BoxGeometry args={[0.5, 0.5, 0.5]} />
		<T.MeshBasicMaterial color="gray" />
	</T.Mesh>
{:then loadedGltf}
	<!-- Your Porsche 911 with Shader -->
	{#if loadedGltf}
		<T is={loadedGltf.scene} scale={[100, 100, 100]} position={[0, -1.01, 0]} />
	{/if}

	<!-- Wind Particles -->
	{#if windParticles}
		<T is={windParticles} />
	{/if}

	<!-- Road Floor -->
	{#await $floorGltf then loadedFloor}
		{#if loadedFloor}
			<T is={loadedFloor.scene} position={[0, -1, 0]} />
		{/if}
	{/await}
{:catch}
	<!-- Error fallback -->
	<T.Mesh>
		<T.BoxGeometry args={[0.5, 0.5, 0.5]} />
		<T.MeshBasicMaterial color="red" />
	</T.Mesh>
{/await}

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		height: 100%;
		width: 100%;
		overflow: hidden;
	}

	:global(canvas) {
		display: block;
		width: 100vw !important;
		height: 100vh !important;
	}
</style>

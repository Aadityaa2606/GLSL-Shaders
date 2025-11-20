<script lang="ts">
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

	interface ExtendedMesh extends THREE.Mesh {
		originalPositions?: Float32Array;
		rotationSpeed?: number;
		orbitAngle?: number;
		orbitRadius?: number;
		orbitSpeed?: number;
	}

	let container: HTMLDivElement;
	let scene: THREE.Scene,
		camera: THREE.PerspectiveCamera,
		renderer: THREE.WebGLRenderer,
		controls: OrbitControls;
	let particles: THREE.Points;
	let particleSystem: ExtendedMesh[] = [];
	let morphingSphere: ExtendedMesh;
	let time = 0;

	function initCanvas(element: HTMLDivElement) {
		container = element;
		init();
		animate();

		return {
			destroy() {
				renderer?.dispose();
				window.removeEventListener('resize', onWindowResize);
			}
		};
	}

	function init() {
		// Scene
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x000000);
		scene.fog = new THREE.FogExp2(0x000000, 0.001);

		// Camera
		camera = new THREE.PerspectiveCamera(
			75,
			container.clientWidth / container.clientHeight,
			0.1,
			1000
		);
		camera.position.z = 30;
		camera.position.y = 10;

		// Renderer
		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(container.clientWidth, container.clientHeight);
		container.appendChild(renderer.domElement);

		// Handle window resize
		window.addEventListener('resize', onWindowResize);

		// Controls
		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;
		controls.autoRotate = true;
		controls.autoRotateSpeed = 0.5;

		// Create Particle Galaxy
		createGalaxy();

		// Create Morphing Central Sphere
		createMorphingSphere();

		// Create Orbiting Objects
		createOrbitingObjects();

		// Lighting
		const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
		scene.add(ambientLight);

		const pointLight1 = new THREE.PointLight(0xff0040, 2, 50);
		pointLight1.position.set(10, 10, 10);
		scene.add(pointLight1);

		const pointLight2 = new THREE.PointLight(0x0040ff, 2, 50);
		pointLight2.position.set(-10, -10, -10);
		scene.add(pointLight2);

		const pointLight3 = new THREE.PointLight(0x40ff00, 2, 50);
		pointLight3.position.set(0, 15, 0);
		scene.add(pointLight3);
	}

	function createGalaxy() {
		const galaxyGeometry = new THREE.BufferGeometry();
		const particleCount = 15000;

		const positions = new Float32Array(particleCount * 3);
		const colors = new Float32Array(particleCount * 3);
		const sizes = new Float32Array(particleCount);

		for (let i = 0; i < particleCount; i++) {
			const i3 = i * 3;

			// Spiral galaxy shape
			const radius = Math.random() * 50;
			const spinAngle = radius * 0.3;
			const branchAngle = ((i % 3) / 3) * Math.PI * 2;

			const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3;
			const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3;
			const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3;

			positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
			positions[i3 + 1] = randomY;
			positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

			// Color based on distance from center
			const colorIntensity = Math.random();
			colors[i3] = 1.0;
			colors[i3 + 1] = colorIntensity * 0.6 + 0.4;
			colors[i3 + 2] = colorIntensity;

			sizes[i] = Math.random() * 4 + 1;
		}

		galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
		galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
		galaxyGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

		const galaxyMaterial = new THREE.PointsMaterial({
			size: 0.5,
			sizeAttenuation: true,
			vertexColors: true,
			blending: THREE.AdditiveBlending,
			transparent: true,
			opacity: 0.8,
			depthWrite: false
		});

		particles = new THREE.Points(galaxyGeometry, galaxyMaterial);
		scene.add(particles);
	}

	function createMorphingSphere() {
		const geometry = new THREE.IcosahedronGeometry(3, 4);
		const material = new THREE.MeshPhongMaterial({
			color: 0x00ffff,
			emissive: 0x0088ff,
			wireframe: false,
			flatShading: true,
			shininess: 100
		});

		morphingSphere = new THREE.Mesh(geometry, material) as ExtendedMesh;
		scene.add(morphingSphere);

		// Store original positions for morphing
		const positionAttribute = geometry.getAttribute('position');
		const originalPositions = positionAttribute.array.slice();
		morphingSphere.originalPositions = originalPositions as Float32Array;
	}

	function createOrbitingObjects() {
		// Create glowing rings around the central sphere
		for (let i = 0; i < 3; i++) {
			const ringGeometry = new THREE.TorusGeometry(5 + i * 2, 0.1, 16, 100);
			const ringMaterial = new THREE.MeshPhongMaterial({
				color: i === 0 ? 0xff0040 : i === 1 ? 0x00ff40 : 0x4000ff,
				emissive: i === 0 ? 0xff0040 : i === 1 ? 0x00ff40 : 0x4000ff,
				emissiveIntensity: 0.5,
				transparent: true,
				opacity: 0.6
			});
			const ring = new THREE.Mesh(ringGeometry, ringMaterial) as ExtendedMesh;
			ring.rotation.x = Math.PI / 2 + (i * Math.PI) / 6;
			ring.rotation.y = (i * Math.PI) / 4;
			ring.rotationSpeed = 0.001 * (i + 1);
			particleSystem.push(ring);
			scene.add(ring);
		}

		// Create orbiting cubes
		for (let i = 0; i < 8; i++) {
			const size = Math.random() * 0.5 + 0.3;
			const cubeGeometry = new THREE.BoxGeometry(size, size, size);
			const cubeMaterial = new THREE.MeshPhongMaterial({
				color: Math.random() * 0xffffff,
				emissive: Math.random() * 0x444444,
				shininess: 100
			});
			const cube = new THREE.Mesh(cubeGeometry, cubeMaterial) as ExtendedMesh;

			const angle = (i / 8) * Math.PI * 2;
			const radius = 12;
			cube.position.x = Math.cos(angle) * radius;
			cube.position.z = Math.sin(angle) * radius;
			cube.position.y = (Math.random() - 0.5) * 4;

			cube.orbitAngle = angle;
			cube.orbitRadius = radius;
			cube.orbitSpeed = 0.01 + Math.random() * 0.01;
			particleSystem.push(cube);
			scene.add(cube);
		}
	}

	function onWindowResize() {
		camera.aspect = container.clientWidth / container.clientHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(container.clientWidth, container.clientHeight);
	}

	function animate() {
		requestAnimationFrame(animate);
		time += 0.01;

		// Rotate particle galaxy
		if (particles) {
			particles.rotation.y += 0.0005;
			particles.rotation.x = Math.sin(time * 0.1) * 0.1;
		}

		// Morph the central sphere
		if (morphingSphere) {
			morphingSphere.rotation.x += 0.003;
			morphingSphere.rotation.y += 0.005;

			const geometry = morphingSphere.geometry;
			const positionAttribute = geometry.getAttribute('position');
			const originalPositions = morphingSphere.originalPositions;

			if (originalPositions) {
				for (let i = 0; i < positionAttribute.count; i++) {
					const x = originalPositions[i * 3];
					const y = originalPositions[i * 3 + 1];
					const z = originalPositions[i * 3 + 2];

					const wave =
						Math.sin(time + x * 0.5) * 0.3 +
						Math.cos(time * 1.3 + y * 0.5) * 0.3 +
						Math.sin(time * 0.7 + z * 0.5) * 0.3;

					positionAttribute.setXYZ(
						i,
						x * (1 + wave * 0.1),
						y * (1 + wave * 0.1),
						z * (1 + wave * 0.1)
					);
				}

				positionAttribute.needsUpdate = true;
				geometry.computeVertexNormals();
			}

			// Pulse emissive intensity
			const material = morphingSphere.material as THREE.MeshPhongMaterial;
			material.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.3;
		}

		// Animate orbiting objects
		particleSystem.forEach((obj, index) => {
			if (obj.rotationSpeed) {
				obj.rotation.x += obj.rotationSpeed;
				obj.rotation.z += obj.rotationSpeed * 0.5;
			}

			if (obj.orbitSpeed && obj.orbitAngle !== undefined && obj.orbitRadius) {
				obj.orbitAngle += obj.orbitSpeed;
				const radius = obj.orbitRadius;
				obj.position.x = Math.cos(obj.orbitAngle) * radius;
				obj.position.z = Math.sin(obj.orbitAngle) * radius;
				obj.position.y += Math.sin(time + index) * 0.02;

				obj.rotation.x += 0.01;
				obj.rotation.y += 0.02;
			}
		});

		controls.update();
		renderer.render(scene, camera);
	}
</script>

<div use:initCanvas class="scene-container"></div>

<style>
	.scene-container {
		width: 100%;
		height: 100vh;
	}
</style>

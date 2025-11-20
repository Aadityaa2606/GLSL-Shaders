<script lang="ts">
	import { onMount } from 'svelte';
	import vertexShaderSource from '$lib/shaders/iso_waves.vert?raw';
	import fragmentShaderSource from '$lib/shaders/iso_waves.frag?raw';

	let canvasRef: HTMLCanvasElement;
	let blobSize = $state(1.0);
	let animationId: number;
	let program: WebGLProgram | null = null;

	// Shader compilation helper
	function createShader(
		gl: WebGLRenderingContext,
		type: number,
		source: string
	): WebGLShader | null {
		const shader = gl.createShader(type);
		if (!shader) return null;

		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}

		return shader;
	}

	// Program creation helper
	function createProgram(
		gl: WebGLRenderingContext,
		vertexShader: WebGLShader,
		fragmentShader: WebGLShader
	): WebGLProgram | null {
		const program = gl.createProgram();
		if (!program) return null;

		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error('Program linking error:', gl.getProgramInfoLog(program));
			gl.deleteProgram(program);
			return null;
		}

		return program;
	}

	onMount(() => {
		const canvas = canvasRef;
		if (!canvas) return;

		const gl = canvas.getContext('webgl');
		if (!gl) {
			console.error('WebGL not supported');
			return;
		}

		// Create shaders
		const vertexShaderObj = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
		const fragmentShaderObj = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

		if (!vertexShaderObj || !fragmentShaderObj) return;

		// Create program
		const programObj = createProgram(gl, vertexShaderObj, fragmentShaderObj);
		if (!programObj) return;
		program = programObj;

		gl.useProgram(program);

		// Create a full-screen quad
		const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

		// Get attribute location
		const positionLocation = gl.getAttribLocation(program, 'position');
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

		// Get uniform locations
		const uResolution = gl.getUniformLocation(program, 'uResolution');
		const uTime = gl.getUniformLocation(program, 'uTime');
		const uMouse = gl.getUniformLocation(program, 'uMouse');
		const uBlobSize = gl.getUniformLocation(program, 'uBlobSize');

		let mouseX = canvas.width / 2;
		let mouseY = canvas.height / 2;

		const handleMouseMove = (e: MouseEvent) => {
			const rect = canvas.getBoundingClientRect();
			mouseX = e.clientX - rect.left;
			mouseY = canvas.height - (e.clientY - rect.top);
		};

		canvas.addEventListener('mousemove', handleMouseMove);

		// Set viewport
		gl.viewport(0, 0, canvas.width, canvas.height);

		// Animation loop
		let startTime = performance.now();

		const render = () => {
			if (!gl || !program) return;

			const currentTime = (performance.now() - startTime) / 1000;

			canvas.width = canvas.clientWidth * devicePixelRatio;
			canvas.height = canvas.clientHeight * devicePixelRatio;
			gl.viewport(0, 0, canvas.width, canvas.height);
			gl.uniform2f(uResolution, canvas.width, canvas.height);
			gl.uniform1f(uTime, currentTime);
			gl.uniform2f(uMouse, mouseX, mouseY);
			gl.uniform1f(uBlobSize, blobSize);

			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

			animationId = requestAnimationFrame(render);
		};

		render();

		return () => {
			canvas.removeEventListener('mousemove', handleMouseMove);
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
	});
</script>

<div class="canvas-container">
	<canvas bind:this={canvasRef} width={1200} height={800} class="shader-canvas"></canvas>
</div>

<style>
	.canvas-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background: #1a1a1a;
	}

	.shader-canvas {
		border: 2px solid #333;
		border-radius: 8px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
	}
</style>

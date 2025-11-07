<script lang="ts">
	import { onMount } from 'svelte';
	import vertexShader from '$lib/shaders/gradient2d_2.vert?raw';
	import fragmentShader from '$lib/shaders/gradient2d_2.frag?raw';

	let canvas: HTMLCanvasElement;
	let gl: WebGLRenderingContext | null = null;
	let program: WebGLProgram | null = null;
	let animationId: number;
	let startTime: number = Date.now();
	let timeLocation: WebGLUniformLocation | null = null;

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

	function initWebGL() {
		const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
		if (!context) {
			console.error('WebGL not supported');
			return;
		}
		gl = context as WebGLRenderingContext;

		// Create shaders
		const vertexShaderObj = createShader(gl, gl.VERTEX_SHADER, vertexShader);
		const fragmentShaderObj = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);

		if (!vertexShaderObj || !fragmentShaderObj) return;

		// Create program
		const programObj = createProgram(gl, vertexShaderObj, fragmentShaderObj);
		if (!programObj) return;
		program = programObj;

		// Create a full-screen quad
		const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

		// Get attribute location
		const positionLocation = gl.getAttribLocation(program, 'position');
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

		// Get uniform locations
		const resolutionLocation = gl.getUniformLocation(program, 'uResolution');
		timeLocation = gl.getUniformLocation(program, 'uTime');

		gl.useProgram(program);
		gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

		// Set viewport
		gl.viewport(0, 0, canvas.width, canvas.height);

		// Start rendering
		render();
	}

	function render() {
		if (!gl || !program) return;

		// Calculate time in seconds
		const currentTime = (Date.now() - startTime) / 1000.0;

		// Clear canvas to black
		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);

		// Use our shader program
		gl.useProgram(program);

		// Update time uniform
		if (timeLocation) {
			gl.uniform1f(timeLocation, currentTime);
		}

		// Draw the rectangle (2 triangles = 4 vertices)
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

		// Keep rendering for smooth display
		animationId = requestAnimationFrame(render);
	}

	onMount(() => {
		initWebGL();

		return () => {
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
	});
</script>

<div class="canvas-container">
	<canvas bind:this={canvas} width={800} height={600} class="shader-canvas"></canvas>
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

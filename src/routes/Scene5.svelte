<script lang="ts">
	import { onMount } from 'svelte';
	import vertexShader from '$lib/shaders/scene5.vert?raw';
	import fragmentShader from '$lib/shaders/scene5.frag?raw';

	let canvas: HTMLCanvasElement;
	let gl: WebGLRenderingContext | null = null;
	let program: WebGLProgram | null = null;
	let animationId: number;
	let startTime: number = Date.now();
	let timeLocation: WebGLUniformLocation | null = null;
	let mouseLocation: WebGLUniformLocation | null = null;
	let mouseX: number = 0;
	let mouseY: number = 0;

	function resizeCanvas() {
		if (canvas) {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			if (gl && program) {
				const resolutionLocation = gl.getUniformLocation(program, 'uResolution');
				gl.useProgram(program);
				gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
				gl.viewport(0, 0, canvas.width, canvas.height);
			}
		}
	}

	function handleMouseMove(event: MouseEvent) {
		// Normalize mouse coordinates to 0-1 range
		mouseX = event.clientX;
		mouseY = window.innerHeight - event.clientY;
	}

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
		mouseLocation = gl.getUniformLocation(program, 'uMouse');

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

		// Update mouse uniform
		if (mouseLocation) {
			gl.uniform2f(mouseLocation, mouseX, mouseY);
		}

		// Draw the rectangle (2 triangles = 4 vertices)
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

		// Keep rendering for smooth display
		animationId = requestAnimationFrame(render);
	}

	onMount(() => {
		resizeCanvas();
		initWebGL();

		window.addEventListener('resize', resizeCanvas);
		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
			window.removeEventListener('resize', resizeCanvas);
			window.removeEventListener('mousemove', handleMouseMove);
		};
	});
</script>

<canvas bind:this={canvas} class="shader-canvas"></canvas>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
	}

	.shader-canvas {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		display: block;
	}
</style>

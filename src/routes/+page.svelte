<script lang="ts">
	const examples = [
		{
			id: 'scene1',
			title: '3D Car with Shader & Wind Particles',
			description:
				'A Porsche 911 model with custom Fresnel shader effects and animated wind particle system using Three.js and Threlte.',
			route: '/scene1',
			tags: ['3D', 'Shaders', 'Particles', 'Three.js']
		},
		{
			id: 'scene2',
			title: 'Animated ISO Shader',
			description:
				'A WebGL shader creating smooth and trippy patterns using custom vertex and fragment shaders.',
			route: '/scene2',
			tags: ['WebGL', 'Gradients', '2D']
		},
		{
			id: 'scene3',
			title: 'Dynamic Gradient Effect',
			description:
				'Another variation of animated gradient effects with different color patterns and transitions.',
			route: '/scene3',
			tags: ['WebGL', 'Gradients', '2D']
		},
		{
			id: 'scene4',
			title: 'Recreate Lando Norris Background Pattern',
			description:
				'Mouse-interactive wave patterns with customizable blob size, creating mesmerizing fluid-like motion.',
			route: '/scene4',
			tags: ['Interactive', 'WebGL', 'Waves']
		},
		{
			id: 'scene5',
			title: 'Fractal Particle Kaleidoscope',
			description:
				'Multi-layered glowing circles with fractal iterations, procedural color palettes, pulsing animations, and interactive mouse tracking creating a mesmerizing cosmic effect.',
			route: '/scene5',
			tags: ['Interactive', 'Fractal', 'WebGL', 'Particles']
		},
		{
			id: 'scene6',
			title: 'Particle Galaxy with Morphing Sphere',
			description:
				'A stunning 3D visualization featuring 15,000+ particles forming a spiral galaxy, a morphing central sphere with vertex displacement, orbiting objects, and dynamic multi-colored lighting.',
			route: '/scene6',
			tags: ['3D', 'Three.js', 'Particles', 'Galaxy']
		}
	];
</script>

<div class="showcase-container">
	<header class="header">
		<h1>Shader & Three.js Showcase</h1>
		<p class="subtitle">Explore interactive WebGL experiments and 3D visualizations</p>
	</header>

	<div class="gallery">
		{#each examples as example}
			<a href={example.route} class="card">
				<div class="card-content">
					<h2 class="card-title">{example.title}</h2>
					<p class="card-description">{example.description}</p>
					<div class="tags">
						{#each example.tags as tag}
							<span class="tag">{tag}</span>
						{/each}
					</div>
				</div>
				<div class="card-footer">
					<span class="view-text">View Example →</span>
				</div>
			</a>
		{/each}
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	}

	.showcase-container {
		min-height: 100vh;
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
		padding: 2rem;
	}

	.header {
		text-align: center;
		color: white;
		margin-bottom: 3rem;
		padding: 2rem 0;
	}

	.header h1 {
		font-size: 3rem;
		margin: 0;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.subtitle {
		font-size: 1.2rem;
		color: #a8b2d1;
		margin-top: 0.5rem;
	}

	.gallery {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 2rem;
		max-width: 1400px;
		margin: 0 auto;
	}

	.card {
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 16px;
		padding: 2rem;
		transition: all 0.3s ease;
		cursor: pointer;
		text-decoration: none;
		color: white;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		min-height: 250px;
	}

	.card:hover {
		transform: translateY(-8px);
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(102, 126, 234, 0.5);
		box-shadow: 0 12px 40px rgba(102, 126, 234, 0.3);
	}

	.card-content {
		flex: 1;
	}

	.card-title {
		font-size: 1.5rem;
		margin: 0 0 1rem 0;
		color: #e2e8f0;
	}

	.card-description {
		font-size: 1rem;
		line-height: 1.6;
		color: #cbd5e0;
		margin-bottom: 1.5rem;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.tag {
		background: rgba(102, 126, 234, 0.2);
		color: #a5b4fc;
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.875rem;
		border: 1px solid rgba(102, 126, 234, 0.3);
	}

	.card-footer {
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		padding-top: 1rem;
		margin-top: 1rem;
	}

	.view-text {
		color: #667eea;
		font-weight: 600;
		transition: transform 0.3s ease;
		display: inline-block;
	}

	.card:hover .view-text {
		transform: translateX(4px);
	}

	@media (max-width: 768px) {
		.gallery {
			grid-template-columns: 1fr;
		}

		.header h1 {
			font-size: 2rem;
		}

		.showcase-container {
			padding: 1rem;
		}
	}
</style>

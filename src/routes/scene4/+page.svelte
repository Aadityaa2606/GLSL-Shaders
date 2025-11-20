<script lang="ts">
	import Scene4 from '$lib/components/scenes/Scene4.svelte';
</script>

<div class="scene-wrapper">
	<nav class="nav-bar">
		<a href="/" data-sveltekit-preload-data="hover" class="back-button">← Back to Gallery</a>
		<h2 class="scene-title">Interactive Iso Waves</h2>
	</nav>
	<Scene4 />
</div>

<style>
	.scene-wrapper {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		position: fixed;
		top: 0;
		left: 0;
	}

	.nav-bar {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		gap: 2rem;
		padding: 1.5rem 2rem;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent);
	}

	.back-button {
		color: white;
		text-decoration: none;
		font-weight: 600;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		transition: all 0.3s ease;
	}

	.back-button:hover {
		background: rgba(255, 255, 255, 0.2);
		transform: translateX(-4px);
	}

	.scene-title {
		color: white;
		margin: 0;
		font-size: 1.25rem;
		opacity: 0.9;
	}
</style>

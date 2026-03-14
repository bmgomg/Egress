<script>
	import { ss } from './state.svelte';

	const hidden = $derived(!ss.doorPage);

	const onClose = () => {
		delete ss.doorPage;
	};
</script>

<div class="door-page {hidden ? 'hidden' : ''}">
	<div onpointerdown={onClose}>DOOR OPTIONS</div>
</div>

<style>
	.door-page {
		grid-area: 1/1;
		display: grid;
		width: 100%;
		transition: opacity 0.2s;
		user-select: none;
		z-index: 1;
	}

	.hidden {
		opacity: 0;
		pointer-events: none;
	}
</style>

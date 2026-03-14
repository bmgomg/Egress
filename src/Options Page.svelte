<script>
	import { ss } from './state.svelte';

	const hidden = $derived(!ss.opsPage);

	const onClose = () => {
		delete ss.opsPage;
		ss.home = true;
	};
</script>

<div class="ops_page {hidden ? 'hidden' : ''}">
	<div onpointerdown={onClose}>OPTIONS</div>
</div>

<style>
	.ops_page {
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

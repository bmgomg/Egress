<script>
	import Block from '$lib/images/Block.webp';
	import Bubble from '$lib/images/Bubble.webp';
	import { CELL_MARGIN, CELL_SIZE } from './const';
	import { ss } from './state.svelte';

	const { cell } = $props();
	const { row, col, weight, newRow, newCol } = $derived(cell);
	const space = $derived(weight === 0);

	const off = $derived.by(() => {
		if (!newRow && !newCol) {
			return { x: 0, y: 0 };
		}

		const sz = CELL_SIZE + CELL_MARGIN * 2;
		const x = ((newCol || col) - col) * sz;
		const y = ((newRow || row) - row) * sz;

		return { x, y };
	});

	const dur = $derived.by(() => {
		const d = Math.floor(Math.abs((newRow || row) - row));
		return d * 0.2;
	});

	const style = $derived(
		`grid-area: ${row}/${col}; width: ${CELL_SIZE}px; margin: ${CELL_MARGIN}px; translate: ${off.x}px ${off.y}px; transition-duration: ${dur}s;`
	);
</script>

<div id="cell-{cell.id}" class="cell {weight >= 0 ? '' : 'bubble'} {newCol || newRow ? '' : 'instant'}" {style}>
	{#if !space}
		<span class="content {ss.spin ? '' : 'instant'}" style="rotate: {ss.spin * -90}deg;">
			<img src={weight < 0 ? Bubble : Block} alt="" width="100%" />
		</span>
	{/if}
	<span class="id">{cell.id}</span>
</div>

<style>
	.cell {
		display: grid;
		aspect-ratio: 1;
		box-sizing: border-box;
		place-content: center;
		transition: translate 0.3s linear;
		z-index: 1;
	}

	.bubble {
		border-radius: 50%;
	}

	.content {
		grid-area: 1/1;
		display: grid;
		transition: rotate 0.5s linear;
		filter: drop-shadow(0px 3px 3px #00000080);
	}

	.instant {
		transition: none;
	}

	img {
		grid-area: 1/1;
	}

	.id {
		display: none;
		grid-area: 1/1;
		place-self: center;
		font-size: 28px;
		font-family: Roboto;
		color: black;
		z-index: 1;
	}
</style>

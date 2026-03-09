<script>
	import { fade } from 'svelte/transition';
	import Box from './Box.svelte';
	import Cell from './Cell.svelte';
	import { CELL_COUNT, CELL_MARGIN, CELL_SIZE, SIZE } from './const';
	import { indexOf, isSolved, makePuzzle, persist } from './shared.svelte';
	import { _sound } from './sound.svelte';
	import { ss } from './state.svelte';
	import { post } from './utils';

	let _this = $state(null);
	let inner = $state(null);

	$effect(() => {
		const onInnerTransitionEnd = (e) => {
			if (e.propertyName === 'transform') {
				if (ss.swirl) {
					delete ss.swirl;
					ss.ticks = 0;
					makePuzzle();
				}

				return;
			}
		};

		const handleSpace = () => {
			post(() => {
				let sounded;
				const plop = (chime) => {
					if (!sounded) {
						_sound.play(chime);
						sounded = true;
					}
				};
				for (let i = 0; i < CELL_COUNT; i++) {
					const cell = ss.cells[i];
					if (cell.newRow && cell.newRow !== cell.row) {
						cell.row = cell.newRow;
						plop(cell.row === SIZE && cell.weight ? 'drop' : 'plop');
					}
					delete cell.newRow;
				}
				if (isSolved()) {
					post(() => _sound.play('won'), 150);
					persist();
				}
				delete ss.delay;
			}, 350);
		};

		const moveDoor = () => {
			const cw = ss.spin === 1;

			if (ss.door.side === 'top') {
				ss.door.side = cw ? 'right' : 'left';

				if (!cw) {
					ss.door.index = SIZE - 1 - ss.door.index;
				}
			} else if (ss.door.side === 'right') {
				ss.door.side = cw ? 'bottom' : 'top';

				if (cw) {
					ss.door.index = SIZE - 1 - ss.door.index;
				}
			} else if (ss.door.side === 'bottom') {
				ss.door.side = cw ? 'left' : 'right';

				if (!cw) {
					ss.door.index = SIZE - 1 - ss.door.index;
				}
			} else if (ss.door.side === 'left') {
				ss.door.side = cw ? 'top' : 'bottom';

				if (cw) {
					ss.door.index = SIZE - 1 - ss.door.index;
				}
			}
		};

		const handleSpin = () => {
			_sound.play('cluck');

			const newRowCol = (row, col, cw) => (cw ? { row: col, col: SIZE + 1 - row } : { row: SIZE + 1 - col, col: row });

			const cw = ss.spin > 0;
			const cells = Array(CELL_COUNT);

			for (let i = 0; i < CELL_COUNT; i++) {
				const cell = { ...ss.cells[i] };
				const { row, col } = newRowCol(cell.row, cell.col, cw);

				cell.row = row;
				cell.col = col;

				const ix = indexOf(row, col);
				cells[ix] = cell;
			}

			moveDoor();

			ss.spin = 0;
			ss.cells = cells;

			ss.delay = true;
			post(handleSpace);
		};

		const onTransitionEnd = (e) => {
			if (e.propertyName === 'rotate') {
				if (ss.spin) {
					handleSpin();
				}

				return;
			}
		};

		_this?.addEventListener('transitionend', onTransitionEnd);
		inner?.addEventListener('transitionend', onInnerTransitionEnd);

		return () => {
			_this?.removeEventListener('transitionend', onTransitionEnd);
			inner?.removeEventListener('transitionend', onInnerTransitionEnd);
		};
	});

	const rotate = $derived(`${ss.spin * 90}deg`);
	const duration = $derived(ss.spin ? 0.5 : 0);
</script>

{#if ss.cells && (ss.practice || !ss.levelPrompt)}
	{@const sz = (CELL_SIZE + CELL_MARGIN * 2) * SIZE + CELL_MARGIN * 4}
	{@const th = 10}
	<div bind:this={_this} class="board" style="rotate: {rotate}; transition-duration: {duration}s; width: {sz + th * 2}px;" in:fade>
		<div class="box"><Box {sz} {th} /></div>
		<div bind:this={inner} class="inner {ss.swirl ? 'swirl' : ''}">
			<div class="cells">
				{#each ss.cells as cell, i (cell.id)}
					<Cell bind:cell={ss.cells[i]} />
				{/each}
			</div>
		</div>
	</div>
{:else}
	<div style="grid-area: 3/1; height: {(CELL_SIZE + CELL_MARGIN * 2) * SIZE}px;"></div>
{/if}

<style>
	.board {
		place-self: center;
		display: grid;
		transition: rotate 0.5s linear;
		z-index: 1;
	}

	.inner {
		grid-area: 1/1;
		display: grid;
		aspect-ratio: 1;
		transition: transform 0.5s linear;
	}

	.swirl {
		/* transform: rotateZ(360deg) scale(0); */
		transform: rotateY(90deg);
	}

	.cells {
		grid-area: 1/1;
		place-self: center;
		display: grid;
		place-content: center;
	}

	.box {
		grid-area: 1/1;
		display: grid;
	}
</style>

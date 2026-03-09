<script>
	import { fade } from 'svelte/transition';
	import Cell from './Cell.svelte';
	import { CELL_COUNT, CELL_MARGIN, CELL_SIZE, SIZE } from './const';
	import { calcPoints, indexOf, isSolved, makePuzzle, onTaskCompleted, persist, spaceCell, stopTimer } from './shared.svelte';
	import { _sound } from './sound.svelte';
	import { ss } from './state.svelte';
	import { post } from './utils';
	import Box from './Box.svelte';

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
			const cells = [...ss.cells];
			const space = spaceCell(cells);
			const { row: srow, col: scol } = space;
			const stack = cells.filter((cell) => cell.col === scol);
			const brow = stack.find((cell) => cell.weight > 0)?.row;

			if (brow + 1 && brow < srow) {
				space.newRow = brow;

				for (let row = brow; row < srow; row++) {
					const cell = cells.find((c) => c.row === row && c.col === scol);
					cell.newRow = cell.row + 1;
				}
			} else if (srow < SIZE) {
				const base = brow + 1 ? brow : SIZE + 1;
				space.newRow = base - 1;

				for (let row = srow + 1; row < base; row++) {
					const cell = cells.find((c) => c.row === row && c.col === scol);
					cell.newRow = cell.row - 1;
				}
			}

			ss.cells = cells;

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
					post(() => _sound.play('won', { rate: 2 }), 150);

					if (ss.timer && !ss.practice) {
						onTaskCompleted();
						ss.points += calcPoints();

						persist();
					}

					stopTimer();

					if (!ss.practice) {
						post(() => (ss.swirl = true), 1000);
					}
				}

				delete ss.delay;
			}, 350);
		};

		const handleFlip = () => {
			const cells = Array(CELL_COUNT);

			for (let i = 0; i < CELL_COUNT; i++) {
				const cell = { ...ss.cells[i] };
				const row = SIZE - cell.row + 1;
				cell.row = row;

				const ix = indexOf(cell.row, cell.col);
				cells[ix] = cell;
			}

			ss.flip = -1;
			ss.cells = cells;
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

			ss.spin = 0;
			ss.cells = cells;

			ss.delay = true;
			post(handleSpace);
		};

		const onTransitionEnd = (e) => {
			if (e.propertyName === 'rotate') {
				if (ss.spin) {
					handleSpin();
				} else if (ss.flip > 0) {
					handleFlip();
				} else if (ss.flip < 0) {
					_sound.play('cluck');
					delete ss.flip;
					handleSpace();
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

	const rotate = $derived(`${ss.flip > 0 ? 'x 90deg' : `${ss.spin * 90}deg`}`);
	const duration = $derived(ss.timer ? (ss.spin ? 0.5 : ss.flip ? 0.25 : 0) : 0);
</script>

{#if ss.cells && (ss.practice || !ss.levelPrompt)}
	{@const sz = (CELL_SIZE + CELL_MARGIN * 2) * SIZE + CELL_MARGIN * 4}
	{@const th = 10}
	<div bind:this={_this} class="board" style="rotate: {rotate}; transition-duration: {duration}s;" in:fade>
		<div bind:this={inner} class="inner {ss.swirl ? 'swirl' : ''}" style='width: {sz + th * 2}px;'>
		<Box sz={sz} th={th}/>
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
</style>

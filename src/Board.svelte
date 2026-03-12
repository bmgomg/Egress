<script>
	import { fade } from 'svelte/transition';
	import Box from './Box.svelte';
	import Cell from './Cell.svelte';
	import { CELL_COUNT, CELL_MARGIN, CELL_SIZE, SIZE, COLUMN_TRANSITIONS } from './const';
	import { _log, findCell, indexOf, makePuzzle, persist } from './shared.svelte';
	import { BOT, LEFT, RIGHT, TOP } from './solver';
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
					makePuzzle();
				}

				return;
			}
		};

		const moveDoor = () => {
			const cw = ss.spin === 1;

			if (ss.door.wall === TOP) {
				ss.door.wall = cw ? RIGHT : LEFT;

				if (!cw) {
					ss.door.corner = 1 - ss.door.corner;
				}
			} else if (ss.door.wall === RIGHT) {
				ss.door.wall = cw ? BOT : TOP;

				if (cw) {
					ss.door.corner = 1 - ss.door.corner;
				}
			} else if (ss.door.wall === BOT) {
				ss.door.wall = cw ? LEFT : RIGHT;

				if (!cw) {
					ss.door.corner = 1 - ss.door.corner;
				}
			} else if (ss.door.wall === LEFT) {
				ss.door.wall = cw ? TOP : BOT;

				if (cw) {
					ss.door.corner = 1 - ss.door.corner;
				}
			}
		};

		const applyGravity = () => {
			const newCells = [...ss.cells];

			for (let c = 0; c < SIZE; c++) {
				const colKey = newCells
					.filter((cob) => cob.col === c + 1)
					.sort((a, b) => a.row - b.row)
					.map((cob) => (cob.weight > 0 ? '🟨' : cob.weight < 0 ? '🔵' : '❌'))
					.join('');

				let exit;
				const inExitCol = (ss.door.corner === 0 && c === 0) || (ss.door.corner === 1 && c === SIZE - 1);

				if (ss.door.wall === TOP && inExitCol) {
					exit = 0;
				} else if (ss.door.wall === BOT && inExitCol) {
					exit = 2;
				} else {
					exit = 1;
				}

				const offs = COLUMN_TRANSITIONS[colKey][exit];

				for (let r = 0; r < SIZE; r++) {
					const off = offs[r];

					if (off === 0) {
						continue;
					}

					const cell = findCell(newCells, r + 1, c + 1);
					cell.newRow = cell.row + off;

					if (cell.newRow === 0) {
						cell.newRow = -0.5;
					} else if (cell.newRow === SIZE + 1) {
						cell.newRow += 0.5;
					}
				}
			}

			ss.cells = newCells;
			post(onGravityEnd, 350);
		};

		const onGravityEnd = () => {
			let sounded;

			const plop = (chime) => {
				if (!sounded) {
					_sound.play(chime);
					sounded = true;
				}
			};

			const cells = [...ss.cells];

			for (let i = 0; i < CELL_COUNT; i++) {
				const cell = cells[i];

				if (cell.newRow < 0 || cell.newRow > SIZE) {
					cell.weight = 0;
				} else if (cell.newRow && cell.newRow !== cell.row) {
					cell.row = cell.newRow;
					plop(cell.row === SIZE && cell.weight ? 'drop' : 'plop');
				}

				delete cell.newRow;
			}

			ss.cells = cells;

			delete ss.delay;
			persist();
		};

		const handleSpin = () => {
			_sound.play('cluck');

			const newRowCol = (row, col, cw) => (cw ? { row: col, col: SIZE + 1 - row } : { row: SIZE + 1 - col, col: row });

			const cw = ss.spin > 0;
			const cells = Array(CELL_COUNT);

			_log(ss.cells);

			for (let i = 0; i < CELL_COUNT; i++) {
				const cell = { ...ss.cells[i] };
				const { row, col } = newRowCol(cell.row, cell.col, cw);

				cell.row = row;
				cell.col = col;

				const ix = indexOf(row, col);
				cells[ix] = cell;
			}

			ss.moves++;
			ss.cells = cells;

			moveDoor();
			ss.spin = 0;

			if ((ss.door.wall === LEFT || ss.door.wall === RIGHT) && ss.door.corner === 1) {
				post(() => {
					ss.door.drop = true;

					post(() => {
						delete ss.door.drop;
						ss.door.corner = 0;
					}, 350);
				});
			}

			post(applyGravity);
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
		overflow: hidden;
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

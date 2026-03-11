<script>
	import { fade } from 'svelte/transition';
	import Box from './Box.svelte';
	import Cell from './Cell.svelte';
	import { CELL_COUNT, CELL_MARGIN, CELL_SIZE, SIZE } from './const';
	import { findCell, indexOf, makePuzzle, persist } from './shared.svelte';
	import { applyPhysics, BLOCK, BOT, BUBBLE, EMPTY, LEFT, RIGHT, TOP } from './solver';
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

		const handleExit = (cells, wall) => {
			const col = ss.door.corner ? 3 : 1;
			const cob1 = findCell(cells, 1, col);
			const cob2 = findCell(cells, 2, col);
			const cob3 = findCell(cells, 3, col);

			if (wall === TOP) {
				if (cob2.weight < 0 && cob3.weight < 0) {
					if (cob1.weight) {
						cob1.newRow = cob1.row - 3.5;
					}

					if (cob2.weight) {
						cob2.newRow = cob2.row - 3.5;
					}

					cob3.newRow = cob3.row - 3.5;
				} else if (cob1.weight <= 0 && cob2.weight < 0) {
					if (cob1.weight) {
						cob1.newRow = cob1.row - 2.5;
					}

					cob2.newRow = cob2.row - 2.5;
				} else if (cob1.weight < 0) {
					cob1.newRow = cob1.row - 1.5;
				}

				return;
			}

			// side === bottom

			// if (cob1.weight > 0 && (cob2.weight >= 0 || cob3.weight >= 0)) {
			// 	if (cob3.weight) {
			// 		cob3.newRow = cob3.row + 3.5;
			// 	}

			// 	if (cob2.weight) {
			// 		cob2.newRow = cob2.row + 3.5;
			// 	}

			// 	cob1.newRow = cob1.row + 3.5;
			// }
		};

		const handleSpace = () => {
			const cells = [...ss.cells];

			if (ss.door.wall === TOP) {
				handleExit(cells, TOP);
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

					if (cell.newRow <= 0) {
						cell.weight = 0;
					} else if (cell.newRow && cell.newRow !== cell.row) {
						cell.row = cell.newRow;
						plop(cell.row === SIZE && cell.weight ? 'drop' : 'plop');
					}

					delete cell.newRow;
				}

				delete ss.delay;
				persist();
			}, 350);
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

			ss.moves++;
			ss.spin = 0;
			ss.cells = cells;

			// create a matrix (grid) from the cells
			const g = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));

			for (const cell of cells) {
				g[cell.row - 1][cell.col - 1] = cell.weight > 0 ? BLOCK : cell.weight < 0 ? BUBBLE : EMPTY;
			}

			const ng = applyPhysics(g, ss.door, SIZE);
			const flat = ng.flat();

			post(() => {
				for (let i = 0; i < CELL_COUNT; i++) {
					const cell = ss.cells[i];
					const ob = flat[i];
					cell.weight = ob === BLOCK ? 1 : ob === EMPTY ? 0 : -1;
				}
			}, 500);

			// ss.delay = true;
			// post(handleSpace);
		};

		const settleColumn = (col, topExit, botExit) => {
			let c = [...col];
			const N = c.length;
			let ch = true;

			while (ch) {
				ch = false;

				for (let r = 0; r < N; r++) {
					if (c[r] !== BLOCK) {
						continue;
					}

					let nB = 0;

					for (let i = r + 1; i < N && c[i] === BUBBLE; i++) {
						nB++;
					}

					if (nB >= 2) {
						if (r > 0 && c[r - 1] === EMPTY) {
							c[r - 1] = BLOCK;
							c[r] = BUBBLE;
							c[r + nB] = EMPTY;
							ch = true;
							break;
						} else if (r === 0 && topExit) {
							c[r] = EMPTY;
							ch = true;
							break;
						}
					} else if (nB === 1) {
						if (r + 2 < N && c[r + 2] === EMPTY) {
							c[r + 2] = BUBBLE;
							c[r + 1] = BLOCK;
							c[r] = EMPTY;
							ch = true;
							break;
						} else if (r + 1 === N - 1 && botExit) {
							c[r + 1] = EMPTY;
							c[r] = EMPTY;
							ch = true;
							break;
						}
					}
				}

				if (ch) {
					continue;
				}

				for (let r = 1; r < N; r++) {
					if (c[r] === BUBBLE && c[r - 1] === EMPTY) {
						c[r - 1] = BUBBLE;
						c[r] = EMPTY;
						ch = true;
						break;
					}
				}

				if (ch) {
					continue;
				}

				if (topExit && c[0] === BUBBLE) {
					c[0] = EMPTY;
					ch = true;
					continue;
				}

				for (let r = N - 2; r >= 0; r--) {
					if (c[r] === BLOCK && c[r + 1] === EMPTY) {
						c[r + 1] = BLOCK;
						c[r] = EMPTY;
						ch = true;
						break;
					}
				}

				if (ch) {
					continue;
				}

				if (botExit && c[N - 1] === BLOCK) {
					c[N - 1] = EMPTY;
					ch = true;
					continue;
				}
			}

			return c;
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

<script>
	import { fade } from 'svelte/transition';
	import Box from './Box.svelte';
	import Cell from './Cell.svelte';
	import { CELL_MARGIN, CELL_SIZE, COLUMN_TRANSITIONS, BOT, LEFT, NO_SLIDE, RIGHT, SLIDE_DOWN, TOP } from './const';
	import {
		findCell,
		indexOf,
		isSolvable,
		isSolved,
		makePuzzle,
		persist,
		playSolution,
		setToInitial,
		slideOp,
		starRating
	} from './shared.svelte';
	import { _sound } from './sound.svelte';
	import { _stats, ss } from './state.svelte';
	import { post } from './utils';
	import { SvelteSet } from 'svelte/reactivity';

	let _this = $state(null);
	let inner = $state(null);
	let dance = $state();

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

	const slideDoor = () => {
		const slide = slideOp();

		if (slide === NO_SLIDE || ss.door.wall === TOP || ss.door.wall === BOT) {
			return;
		}

		const corner = slide === SLIDE_DOWN ? 0 : 1;

		if (ss.door.corner === corner) {
			return;
		}

		post(() => {
			ss.door.drop = slide === SLIDE_DOWN ? 1 : -1;
			post(() => _sound.play('drop'), 400);

			post(() => {
				delete ss.door.drop;
				ss.door.corner = corner;
			}, 350);
		});
	};

	const applyGravity = () => {
		const newCells = [...ss.cells];

		let maxOff = 0;
		const uniqOffs = new SvelteSet();

		for (let c = 0; c < ss.size; c++) {
			const colKey = newCells
				.filter((cob) => cob.col === c + 1)
				.sort((a, b) => a.row - b.row)
				.map((cob) => (cob.weight > 0 ? '🟨' : cob.weight < 0 ? '🔵' : '❌'))
				.join('');

			let exit;
			const inExitCol = (ss.door.corner === 0 && c === 0) || (ss.door.corner === 1 && c === ss.size - 1);

			if (ss.door.wall === TOP && inExitCol) {
				exit = 0;
			} else if (ss.door.wall === BOT && inExitCol) {
				exit = 2;
			} else {
				exit = 1;
			}

			const offs = COLUMN_TRANSITIONS[colKey][exit];

			for (let r = 0; r < ss.size; r++) {
				const off = offs[r];

				if (off === 0) {
					continue;
				}

				const cell = findCell(newCells, r + 1, c + 1);
				cell.newRow = cell.row + off;

				const d = Math.abs(off);

				if (d > maxOff) {
					maxOff = d;
				}

				if (cell.newRow === 0) {
					cell.newRow -= 0.5;
				} else if (cell.newRow === ss.size + 1) {
					cell.newRow += 0.5;
				} else if (cell.weight) {
					uniqOffs.add(off);
				}
			}
		}

		ss.cells = newCells;

		if (ss.cells.some((c) => c.newRow < 1 || c.newRow > ss.size)) {
			_sound.play('link2', { rate: 0.9 });
		}

		for (const off of uniqOffs) {
			post(() => _sound.play(off < 0 ?'plop' : 'drop', { rate: off < 0 ? 2 : 4 }), Math.abs(off) * 150);
		}

		post(onGravityEnd, maxOff * 200 + 50);
	};

	const onGravityEnd = () => {
		const cells = [...ss.cells];
		const count = ss.size * ss.size;

		for (let i = 0; i < count; i++) {
			const cell = cells[i];

			if (cell.newRow < 0 || cell.newRow > ss.size) {
				cell.weight = 0;
			} else if (cell.newRow && cell.newRow !== cell.row) {
				cell.row = cell.newRow;
			}

			delete cell.newRow;
		}

		ss.cells = cells;

		if (isSolved()) {
			_sound.play('won');
			dance = true;

			if (!ss.over) {
				ss.over = 'won';
				_stats.plays++;
				_stats.wins++;
				_stats.total += starRating();
			}
		} else if (!isSolvable()) {
			ss.deadend = true;
		}

		delete ss.noui;
		persist();
	};

	const handleSpin = () => {
		_sound.play('cluck');

		const newRowCol = (row, col, cw) => (cw ? { row: col, col: ss.size + 1 - row } : { row: ss.size + 1 - col, col: row });

		const cw = ss.spin > 0;
		const count = ss.size * ss.size;
		const cells = Array(count);

		for (let i = 0; i < count; i++) {
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
		slideDoor();

		post(applyGravity);
	};

	$effect(() => {
		const onInnerTransitionEnd = (e) => {
			if (e.propertyName === 'transform') {
				if (ss.flip === 'reset') {
					delete ss.flip;
					setToInitial();
					persist();
				} else if (ss.flip === 'surrender') {
					delete ss.flip;
					setToInitial();
					post(playSolution, 1000);
				} else if (ss.flip) {
					delete ss.flip;
					makePuzzle();
				}

				return;
			}
		};

		const onTransitionEnd = (e) => {
			if (e.propertyName === 'rotate') {
				if (ss.spin) {
					handleSpin();
				} else if (dance) {
					dance = false;
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

	const rotate = $derived(`${dance ? 360 : ss.spin * 90}deg`);
	const duration = $derived(dance ? 1 : ss.spin ? 0.5 : 0);
	const tfn = $derived(ss.spin ? 'linear' : 'ease-in-out');
	const sz = $derived((CELL_SIZE + CELL_MARGIN * 2) * ss.size + CELL_MARGIN * 4);

	const th = 10;
	const style = $derived(
		`rotate: ${rotate}; transition-duration: ${duration}s; width: ${sz + th * 2}px; transition-timing-function: ${tfn};`
	);
</script>

{#if ss.cells && (ss.practice || !ss.levelPrompt)}
	{@const sz = (CELL_SIZE + CELL_MARGIN * 2) * ss.size + CELL_MARGIN * 4}
	<div bind:this={_this} class="board" {style} in:fade>
		<div class="box {ss.flip ? 'swirl' : ''}"><Box {sz} {th} /></div>
		<div bind:this={inner} class="inner {ss.flip ? 'swirl' : ''}">
			<div class="cells">
				{#each ss.cells as cell, i (cell.id)}
					<Cell bind:cell={ss.cells[i]} />
				{/each}
			</div>
		</div>
	</div>
{:else}
	<div style="grid-area: 3/1; height: {(CELL_SIZE + CELL_MARGIN * 2) * ss.size}px;"></div>
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

	.cells {
		grid-area: 1/1;
		place-self: center;
		display: grid;
		place-content: center;
	}

	.box {
		grid-area: 1/1;
		display: grid;
		transition: transform 0.5s linear;
	}

	.swirl {
		transform: rotateZ(360deg) scale(0);
	}
</style>

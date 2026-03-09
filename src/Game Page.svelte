<script>
	import { ss } from './state.svelte';
	import Toolbar from './Toolbar.svelte';
	import Board from './Board.svelte';
	import Controls from './Controls.svelte';
	import Scoreboard from './Scoreboard.svelte';
	import Stats from './Stats.svelte';
	// import Prompt from './Prompt.svelte';
	// import GameOver from './Game Over.svelte';

	const hidden = $derived(ss.home);
</script>

<div class="game-page {hidden ? 'hidden' : ''}">
	<Stats />
	<Scoreboard />
	<Board />
	<Controls />
	<!-- <Prompt/> -->
	<div class="divider"></div>
	<Toolbar />
</div>

<style>
	.game-page {
		grid-area: 1/1;
		display: grid;
		gap: 20px;
		width: 100%;
		transition: opacity 0.2s;
		box-sizing: border-box;
		padding: 20px 0;
		user-select: none;
	}

	.hidden {
		opacity: 0;
		pointer-events: none;
	}

	.divider {
		place-self: center;
		width: 350px;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--gold-dim), transparent);
	}
</style>

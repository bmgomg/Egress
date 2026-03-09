<script>
	import { ss } from './state.svelte';
	import Toolbar from './Toolbar.svelte';
	// import Board from './Board.svelte';
	import Controls from './Controls.svelte';
	import Scoreboard from './Scoreboard.svelte';
	import { secsRemained } from './shared.svelte';
	import Stats from './Stats.svelte';
	import Timer from './Timer.svelte';
	// import Prompt from './Prompt.svelte';
	// import GameOver from './Game Over.svelte';

	const hidden = $derived(ss.home);
</script>

<div class="game-page {hidden ? 'hidden' : ''}">
	<Stats />
	<Scoreboard />
	<!-- <Board /> -->
	<Controls />
	<Timer secs={secsRemained()} />
	<!-- <Prompt/> -->
	<Toolbar />
</div>

<style>
	.game-page {
		grid-area: 1/1;
		display: grid;
		grid: 0.3fr 1fr auto 0.3fr 1fr auto / auto;
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
</style>

<script>
	import { ss } from './state.svelte';
	import Toolbar from './Toolbar.svelte';
	import Board from './Board.svelte';
	import Controls from './Controls.svelte';
	import Scoreboard from './Scoreboard.svelte';
	import Stats from './Stats.svelte';
	import OverPanel from './Over Panel.svelte';
	import DoorTip from './Door Tip.svelte';
	import { fade } from 'svelte/transition';
</script>

<div class="game-page" in:fade>
	{#if !ss.home}
		<Stats />
		<div class="divider"></div>
		<Scoreboard />
		<Board />
		<Controls />
		<OverPanel />
		<DoorTip />
		<div class="divider" style='grid-area: 6/1;'></div>
		<Toolbar />
	{/if}
</div>

<style>
	.game-page {
		grid-area: 1/1;
		display: grid;
		grid: auto auto auto auto 82px auto auto / auto;
		gap: 17px;
		width: 100%;
		transition: opacity 1s;
		box-sizing: border-box;
		padding: 20px 0;
		user-select: none;
	}

	.divider {
		place-self: center;
		width: 300px;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--gold-dim), transparent);
	}
</style>

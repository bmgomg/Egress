<script>
	import NumberFlow from '@number-flow/svelte';
	import { _stats } from './state.svelte';

	const ave = $derived(_stats.wins ? (_stats.total / _stats.plays).toFixed(1) : 0);
</script>

<div class="stats">
	<span class="label">Played</span>
	<div class="value"><NumberFlow value={_stats.plays} /></div>
	<span></span>
	<span class="label">Solved</span>
	<div class="value"><NumberFlow value={_stats.wins} /></div>
	<span></span>
	<span class="label">Ave. Rating</span>
	{#if _stats.wins}
		<div class="value"><NumberFlow value={ave} /></div>
	{:else}
		<div class="bullet">•</div>
	{/if}
	<span></span>
</div>

<style>
	.stats {
		place-content: center;
		display: grid;
		grid-auto-flow: column;
		align-items: baseline;
		gap: 10px;
		cursor: initial;
	}

	.label {
		color: var(--text-dim);
	}

	.value {
		color: var(--gold-lit);
	}
</style>

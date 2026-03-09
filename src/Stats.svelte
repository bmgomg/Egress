<script>
	import NumberFlow from '@number-flow/svelte';
	import { _stats } from './state.svelte';

	const ave = $derived(_stats.plays ? (_stats.total / _stats.plays).toFixed(1) : 0);
</script>

<div class="stats">
	<span class="label">Plays</span>
	<div class="value"><NumberFlow value={_stats.plays} /></div>
	<span></span>
	<span class="label">Ave</span>
	{#if _stats.plays}
		<div class="value"><NumberFlow value={ave} prefix={ave < 1 ? '' : '+'} /></div>
	{:else}
		<div class="bullet">•</div>
	{/if}
	<span></span>
	<span class="label">Best</span>
	{#if _stats.plays}
		<div class="value"><NumberFlow value={_stats.best} prefix={_stats.best < 1 ? '' : '+'} /></div>
	{:else}
		<div>•</div>
	{/if}
</div>

<style>
	.stats {
		grid-area: 1/1;
		place-content: end center;
		/* font-size: 24px; */
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
		color: var(--gold);
	}
</style>

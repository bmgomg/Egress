<script>
	import NumberFlow from '@number-flow/svelte';
	import Rating from './Rating.svelte';
	import { starRating } from './shared.svelte';
	import { ss } from './state.svelte';

	const par = $derived(ss.solution?.length);
</script>

{#if !ss.practice}
	<div class="scoreboard">
		{#snippet item(value, label)}
			<div class="counter">
				<span class="label">{label}</span>
				{#if label === 'Rating'}
					<Rating />
				{:else}
					<div class="flow"><NumberFlow value={value || 0} format={{ useGrouping: false }} /></div>
				{/if}
			</div>
		{/snippet}
		{@render item(par, 'Par')}
		{@render item(ss.moves, 'Moves')}
		{@render item(starRating(), 'Rating')}
	</div>
{/if}

<style>
	.scoreboard {
		grid-area: 3/1;
		place-self: center;
		display: grid;
		grid-auto-flow: column;
		gap: 40px;
	}

	.counter {
		display: grid;
		justify-items: center;
	}

	.flow {
		font-size: 36px;
		font-family: Florentina;
	}

	.label {
		font-size: 16px;
		color: var(--text-dim);
	}
</style>

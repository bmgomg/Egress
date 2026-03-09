<script>
	import NumberFlow from '@number-flow/svelte';
	import { ss } from './state.svelte';
</script>

{#if !ss.practice}
	<div class="scoreboard">
		{#snippet item(value, label)}
			<div class="counter">
				<span class="label">{label}</span>
				{#if label === 'Rating'}
					{@const d = value || 0}
					{@const stars = !ss.over ? '☆☆☆☆☆' : d < 1 ? '★★★★★' : d < 2 ? '★★★★☆' : d < 3 ? '★★★☆☆' : d < 4 ? '★★☆☆☆' : '★☆☆☆☆'}
					<div class="rating {ss.over ? '' : 'no-rating'}">{stars}</div>
				{:else}
					<div class="flow"><NumberFlow value={value || 0} format={{ useGrouping: false }} /></div>
				{/if}
			</div>
		{/snippet}
		{@render item(ss.par, 'Par')}
		{@render item(ss.moves, 'Moves')}
		{@render item(ss.moves - ss.par, 'Rating')}
	</div>
{/if}

<style>
	.scoreboard {
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

	.rating {
		font-size: 28px;
		letter-spacing: 0.15em;
		margin-top: -9px;
		color: var(--gold-lt);
		text-shadow: 0 0 20px #e8cc8080;
	}

	.no-rating {
		color: var(--text-dim);
		text-shadow: none;
	}
</style>

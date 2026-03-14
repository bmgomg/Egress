<script>
	import { starRating } from './shared.svelte';

	const r = $derived(starRating());
</script>

<div class="rating">
	{#each [1, 2, 3, 4, 5] as i (i)}
		{@const dim = r === 0 || i > r}
		<span class={dim ? 'dim' : 'bright'} in>{dim ? '☆' : '★'}</span>
	{/each}
</div>

<style>
	.rating {
		font-size: 28px;
		letter-spacing: 0.15em;
		margin-top: -9px;
		display: grid;
		grid-auto-flow: column;
	}

	.dim {
		color: var(--text-dim);
	}

	.bright {
		color: var(--gold-lt);
		text-shadow: 0 0 20px #e8cc8080;
	}
</style>

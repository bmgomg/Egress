<script>
	import { persist } from './shared.svelte';
	import { _sound } from './sound.svelte';

	const onClick = (i) => {
		_sound.music = i;
		_sound.playMusic();

		persist(true);
	};
</script>

<div class="selector">
	<div class="label">Music</div>
	<div class="values">
		{#each [0, 1, 2, 3] as i (i)}
			<div class="value {i === _sound.music ? 'selected' : ''}" onpointerdown={() => onClick(i)}>{i}</div>
		{/each}
	</div>
</div>

<style>
	.selector {
		display: grid;
		place-items: center;
		gap: 3px;
	}

	.values {
		display: grid;
		grid-auto-flow: column;
		/* gap: 10px; */
	}

	.value {
		font-family: Florentina;
		font-size: 18px;
		opacity: 0.5;
		cursor: pointer;
		width: 1.2em;
		display: grid;
		place-content: center;
	}

	.selected {
		pointer-events: none;
		opacity: 1;
	}
</style>

<script>
	import { fade } from 'svelte/transition';
	import { isSolved } from './shared.svelte';
	import { ss } from './state.svelte';
	import TextButton from './Text Button.svelte';
	import { _sound } from './sound.svelte';

	const onReplay = () => {
		_sound.play('plop');

		ss.replay = true;
		ss.moves = 0;
		ss.flip = 'reset';
	};

	const onPlayNew = () => {
		_sound.play('plop');
		ss.flip = true;
	};
</script>

<div class="buttons">
	{#if isSolved()}
		<div in:fade><TextButton id="tb-replay" framed text={['Replay?']} onClick={onReplay} /></div>
		<div in:fade><TextButton id="tb-new" framed text={['Play new?']} onClick={onPlayNew} /></div>
	{/if}
</div>

<style>
	.buttons {
		grid-area: 5/1;
		place-self: center;
		display: grid;
		grid-auto-flow: column;
		gap: 30px;
		font-size: 20px;
	}
</style>

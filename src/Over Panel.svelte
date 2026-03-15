<script>
	import { fade } from 'svelte/transition';
	import { isSolved, woosh } from './shared.svelte';
	import { _sound } from './sound.svelte';
	import { ss } from './state.svelte';
	import TextButton from './Text Button.svelte';

	const onReplay = () => {
		_sound.play('tap');
		woosh();

		ss.replay = true;
		ss.moves = 0;
		ss.flip = 'reset';
	};

	const onPlayNew = () => {
		_sound.play('tap');
		ss.flip = true;
	};
</script>

<div class="buttons">
	{#if isSolved()}
		<div in:fade><TextButton id="tb-replay" framed style="width: 120px;" text={['Replay']} onClick={onReplay} /></div>
		<div in:fade><TextButton id="tb-new" framed style="width: 145px;" text={['Play new']} onClick={onPlayNew} /></div>
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

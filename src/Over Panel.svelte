<script>
	import { fade } from 'svelte/transition';
	import { isSolved, whoosh } from './shared.svelte';
	import { ss } from './state.svelte';
	import TextButton from './Text Button.svelte';
	import { _sound } from './sound.svelte';

	const onReplay = () => {
		_sound.play('tap');
		whoosh();

		ss.replay = true;
		ss.moves = 0;
		ss.flip = 'reset';
	};

	const onPlayNew = () => {
		_sound.play('tap');
		ss.flip = true;
	};
</script>

{#if isSolved()}
	<div class="buttons" in:fade>
		<div in:fade><TextButton id="tb-replay" framed style="padding-right: 1.25em;" text={['Replay']} onClick={onReplay} /></div>
		<div in:fade><TextButton id="tb-new" framed style="padding-right: 1.25em;" text={['Play new']} onClick={onPlayNew} /></div>
	</div>
{/if}

<style>
	.buttons {
		grid-area: 5/1;
		place-self: center;
		display: grid;
		grid-auto-flow: column;
		gap: 30px;
		font-size: 20px;
		z-index: 1;
	}
</style>

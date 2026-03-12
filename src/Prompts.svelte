<script>
	import { fade } from 'svelte/transition';
	import { isSolved } from './shared.svelte';
	import TextButton from './Text Button.svelte';
</script>

<div class="prompts">
	{#if isSolved()}
		<div in:fade><TextButton id="tb-replay" framed text={['Replay?']} onClick={() => {}} /></div>
		<div in:fade><TextButton id="tb-new" framed text={['Play new?']} onClick={() => {}} /></div>
	{/if}
</div>

<style>
	.prompts {
		grid-area: 5/1;
		place-self: center;
		display: grid;
		grid-auto-flow: column;
		gap: 30px;
		font-size: 20px;
	}
</style>

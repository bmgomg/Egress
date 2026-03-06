<script>
	import { fade } from 'svelte/transition';
	import { MODE_CHALLENGE, MODE_PRACITCE } from './const';
	import { onMode } from './shared.svelte';
	import { ss } from './state.svelte';
	import TextButton from './Text Button.svelte';
	import Down from '$lib/images/Down.webp';

	const ul = '<ul style="margin: 10px 0 0 0;">';
	const li = '<li style="margin: 10px 0 0 -20px;">';
	const hi = '<span style="color: var(--gold);">';

	// ${li}A block is heavier than ${hi}any</span> number of bubbles.</li>

	const CONTENT = `
	    <span>Solve the puzzle by ${hi}rotating</span> the grid. You may also ${hi}flip</span> it.</span>
        ${ul}
        ${li}One cell is ${hi}vacant</span>.</li>
        ${li}Every other cell contains either a ${hi}block</span> (heavier than air) or a ${hi}bubble</span> (lighter than air).</li>
        ${li}The puzzle is complete when the ${hi}vacant</span> cell reaches the ${hi}center</span> of the grid.</li>
        </ul>`;
</script>

{#if ss.home}
	<div class="home" in:fade={{ duration: 200 }}>
		<div class="title">THIS SIDE UP</div>
		<img class="down" src={Down} alt="" width={100} />
		<div class="content" tabindex="-1">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html CONTENT}
		</div>
		<div class="buttons">
			{#each [MODE_PRACITCE, MODE_CHALLENGE] as mode (mode)}
				<TextButton id={'tb-mode-' + mode} text={[mode]} onClick={() => onMode(mode)} />
			{/each}
		</div>
	</div>
{/if}

<style>
	.home {
		place-self: center;
		grid-area: 1/1;
		display: grid;
		justify-items: center;
		user-select: none;
		font-size: 18px;
	}

	.title {
		font-size: 64px;
		font-family: Stencil;
		filter: drop-shadow(0 1px 2px black);
	}

	.down {
		margin-top: 35px;
	}

	.content {
		display: grid;
		align-content: start;
		width: 360px;
		margin: 40px 0 50px;
		font-weight: bold;
		color: var(--blue);
		filter: drop-shadow(0 1px 1px black);
	}

	.buttons {
		display: grid;
		grid-auto-flow: column;
		gap: 32px;
		font-family: Stencil;
		font-size: 32px;
	}
</style>

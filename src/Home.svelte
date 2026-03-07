<script>
	import { fade } from 'svelte/transition';
	import { MODE_CHALLENGE, MODE_PRACITCE } from './const';
	// import { onMode } from './shared.svelte';
	import { ss } from './state.svelte';
	import TextButton from './Text Button.svelte';

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
		<div class="title">Egress</div>
		<div class="tagline">A box full of blocks and bubbles. One door. Rotate to empty it.</div>
		<div class="content" tabindex="-1">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html CONTENT}
		</div>
		<div class="buttons">
			{#each [MODE_PRACITCE, MODE_CHALLENGE] as mode (mode)}
				<TextButton id={'tb-mode-' + mode} text={[mode]} onClick={() => {}} />
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
		font-family: 'Cinzel Decorative', serif;
		font-size: clamp(42px, 12vw, 64px);
		font-weight: 700;
		color: var(--gold);
		letter-spacing: 0.12em;
		text-shadow:
			0 0 40px rgba(200, 168, 74, 0.5),
			0 0 80px rgba(200, 168, 74, 0.2);
		line-height: 1;
		margin-bottom: 10px;
	}

	.tagline {
		font-size: 16px;
		font-style: italic;
		color: var(--text-dim);
		letter-spacing: 0.08em;
		margin-bottom: 48px;
		text-align: center;
		max-width: 280px;
		line-height: 1.5;
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
		font-family: Cinzel;
		font-size: 32px;
	}
</style>

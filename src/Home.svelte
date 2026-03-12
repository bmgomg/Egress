<script>
	import { fade } from 'svelte/transition';
	import { onHomePlay } from './shared.svelte';
	import { ss } from './state.svelte';
	import TextButton from './Text Button.svelte';

	const ul = '<ul style="margin: 0;">';
	const li = '<li style="margin: 10px 0 0 -20px;">';
	const hi = '<span style="color: var(--text);">';

	const CONTENT = `
        ${ul}
        ${li}${hi}Blocks</span> are ${hi}heavier</span> than air. ${hi}Bubbles</span> are ${hi}lighter</span> than air.</li>
        ${li}The ${hi}door</span> must be on the ${hi}top or bottom</span> wall for pieces to escape.</li>
        ${li}A block on top of ${hi}one bubble</span> drags it ${hi}down</span>—they fall together.</li>
        ${li}A block on top of ${hi}two bubbles</span> gets lifted ${hi}up</span>—they rise together.</li>
        </ul>
		<span style='margin-top: 30px;'>Clear the box in as few rotations as possible.</span>
		`;
</script>

{#if ss.home}
	<div class="home" in:fade={{ duration: 200 }}>
		<div class="title-ornament">A puzzle of</div>
		<div class="title-ornament">gravity &amp; escape</div>
		<div class="title">Egress</div>
		<div class="tagline">A box full of blocks and bubbles. One door. Rotate to empty it.</div>
		<div class="divider"></div>
		<div class="content" tabindex="-1">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html CONTENT}
		</div>
		<div class="divider"></div>
		<div class="buttons">
			<TextButton id='tb-size-2' framed text={['Easy']} onClick={() => onHomePlay(2)} />
			<TextButton id='tb-size-3' framed text={['Not So Easy']} onClick={() => onHomePlay(3)} />
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

	.title-ornament {
		font-size: 13px;
		letter-spacing: 0.6em;
		color: var(--gold-dim);
		text-transform: uppercase;
	}

	.title {
		font-family: CD;
		font-size: clamp(42px, 12vw, 64px);
		font-weight: 700;
		color: var(--gold);
		letter-spacing: 0.12em;
		text-shadow:
			0 0 40px #c8a84a80,
			0 0 80px #c8a84a33;
		line-height: 1;
		margin: 30px 0 10px;
	}

	.tagline {
		font-size: 16.5px;
		font-family: EBG;
		font-style: italic;
		color: var(--text-dim);
		letter-spacing: 0.08em;
		text-align: center;
		max-width: 280px;
		line-height: 1.5;
	}

	.content {
		display: grid;
		align-content: start;
		width: 360px;
		font-size: 19.5px;
		color: var(--text-dim);
		font-family: EBG;
		font-style: italic;
	}

	.buttons {
		display: grid;
		grid-auto-flow: column;
		gap: 30px;
		font-size: 20px;
	}

	.divider {
		width: 200px;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--gold-dim), transparent);
		margin: 40px 0;
	}
</style>

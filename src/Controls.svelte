<script>
	import CCW from '$lib/images/CCW.webp';
	import CW from '$lib/images/CW.webp';
	import Reset from '$lib/images/Restart.webp';
	import { fade } from 'svelte/transition';
	import { calcPoints, isAnimated, isInitial, isSolved, onSetToInitial, startTimer } from './shared.svelte';
	import { _sound } from './sound.svelte';
	import { ss } from './state.svelte';
	import ToolButton from './Tool Button.svelte';

	const onSpin = (cw) => {
		_sound.play('click');
		ss.spin = cw ? 1 : -1;

		if (!ss.timer) {
			startTimer();
		}
	};

	const onReset = () => {
		onSetToInitial();

		if (!ss.timer) {
			startTimer();
		}
	};

	const solved = $derived(isSolved());
	const canRotate = $derived(!isAnimated() && (ss.practice ? !ss.surrender && !ss.delay : !solved && !ss.fail && ss.timer));
	const canReset = $derived(!isInitial() && canRotate);
</script>

{#if ss.practice || !ss.levelPrompt}
	<div class="controls {ss.over ? 'hidden' : ''}">
		<div class="control" in:fade>
			<ToolButton id="tb-ccw" src={CCW} disabled={!canRotate} opaque={true} showDisabled={solved} onClick={() => onSpin(false)} />
			<span>turn</span>
		</div>
		<div class="control" in:fade>
			<ToolButton id="tb-reset" src={Reset} disabled={!canReset} opaque={true} onClick={onReset} />
			<span>reset</span>
		</div>
		<div class="control" in:fade>
			<ToolButton id="tb-cw" src={CW} disabled={!canRotate} opaque={true} showDisabled={solved} onClick={() => onSpin(true)} />
			<span>turn</span>
		</div>
	</div>
{/if}

<style>
	.controls {
		grid-area: 4/1;
		height: 64px;
		place-self: center;
		display: grid;
		grid-auto-flow: column;
		gap: 25px;
	}

	.hidden {
		opacity: 0;
	}

	.control {
		display: grid;
		justify-items: center;
		font-size: 16px;
		/* font-family: EBG; */
		color: var(--text-dim);
	}
</style>

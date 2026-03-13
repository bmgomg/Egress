<script>
	import CCW from '$lib/images/CCW.webp';
	import CW from '$lib/images/CW.webp';
	import Reset from '$lib/images/Restart.webp';
	import { isAnimated, isInitial, isSolved } from './shared.svelte';
	import { _sound } from './sound.svelte';
	import { ss } from './state.svelte';
	import ToolButton from './Tool Button.svelte';
	import { post } from './utils';

	const onSpin = (cw) => {
		_sound.play('click');
		ss.spin = cw ? 1 : -1;
		ss.noui = true;
	};

	const onReset = () => {
		_sound.play('click');

		ss.moves = 0;
		ss.flip = 'reset';

		post(() => _sound.play('link1', { rate: 0.8 }), 200);
	};

	const solved = $derived(isSolved());
	const canRotate = $derived(!isAnimated() && !solved);
	const canReset = $derived(!isInitial() && canRotate);
</script>

<div class="controls {isSolved() || ss.surrender ? 'hidden' : ''}">
	<div class="control">
		<ToolButton id="tb-ccw" src={CCW} disabled={!canRotate} opaque={true} showDisabled={solved} onClick={() => onSpin(false)} />
		<span>turn</span>
	</div>
	<div class="control {ss.deadend && canReset ? 'pulse' : ''}">
		<ToolButton id="tb-reset" src={Reset} disabled={!canReset} opaque={true} onClick={onReset} />
		<span>reset</span>
	</div>
	<div class="control">
		<ToolButton id="tb-cw" src={CW} disabled={!canRotate} opaque={true} showDisabled={solved} onClick={() => onSpin(true)} />
		<span>turn</span>
	</div>
</div>

<style>
	.controls {
		grid-area: 5/1;
		place-self: center;
		display: grid;
		grid-auto-flow: column;
		gap: 40px;
		transition: opacity 0.3s;
	}

	.hidden {
		opacity: 0;
	}

	.control {
		display: grid;
		justify-items: center;
		font-size: 16px;
		color: var(--text-dim);
	}

	.pulse {
		animation: pulse 0.25s alternate infinite ease-in-out;
	}

	@keyframes pulse {
		from {
			transform: scale(1);
		}
		to {
			transform: scale(0.85);
		}
	}
</style>

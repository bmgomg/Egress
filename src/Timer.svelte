<script>
	import NumberFlow, { NumberFlowGroup } from '@number-flow/svelte';
	import { fade } from 'svelte/transition';
	import { _prompt, ss } from './state.svelte';

	const { secs } = $props();
	const trend = $derived(!ss.practice ? -1 : 1);

	const time = $derived.by(() => {
		const ds = (secs - Math.floor(secs)) * 10;
		const s = Math.floor(secs % 60);
		const m = Math.floor((secs / 60) % 60);
		const h = Math.floor(secs / (60 * 60));
		return { h, m, s, ds };
	});
</script>

{#if !ss.practice && !ss.levelPrompt && !ss.over && (!_prompt.id || _prompt.opacity === 0)}
	<div class="timer" in:fade>
		<NumberFlowGroup>
			<div
				style="font-variant-numeric: tabular-nums; --number-flow-char-height: 0.85em;"
				class="~text-3xl/4xl flex items-baseline font-semibold group"
			>
				{#if time.h}
					<NumberFlow {trend} value={time.h} />
				{/if}
				<NumberFlow prefix={time.h ? ':' : ''} {trend} value={time.m} digits={{ 1: { max: 5 } }} />
				<NumberFlow prefix=":" {trend} value={time.s} digits={{ 1: { max: 5 } }} format={{ minimumIntegerDigits: 2 }} />
			</div>
		</NumberFlowGroup>
	</div>
{/if}

<style>
	.timer {
		grid-area: 5/1;
		display: grid;
		place-self: center;
		font-family: Florentina;
		font-size: 48px;
	}

	.group {
		display: grid;
		grid-auto-flow: column;
	}
</style>

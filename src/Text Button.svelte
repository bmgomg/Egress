<script>
	import { ss } from './state.svelte';
	import { post } from './utils';

	const { id, text, framed, style, disabled, onClick } = $props();

	let scale = $state(1);
	let timer = $state(false);

	const classes = $derived(['button-base no-highlight button ' + (framed ? 'framed' : 'text-only'), { disabled }]);
	const _style = $derived(`${style}; transform: scale(${scale})`);

	$effect(() => {
		const onTransitionEnd = (e) => {
			if (e.target.id !== id) {
				return;
			}

			if (e.propertyName !== 'transform') {
				return;
			}

			if (scale < 1) {
				scale = 1;
			} else {
				post(onClick);
			}
		};

		window.addEventListener('transitionend', onTransitionEnd);
		return () => window.removeEventListener('transitionend', onTransitionEnd);
	});

	const onPointerDown = (e) => {
		if (e.ctrlKey && e.shiftKey && e.altKey) {
			ss.debug = !ss.debug;
			return;
		}

		if (timer) {
			return;
		}

		scale = 0.7;

		timer = post(() => (timer = null), 500);
	};
</script>

<div {id} class={classes} onpointerdown={onPointerDown} style={_style}>
	{#each text as line, i (i)}
		<div>{line}</div>
	{/each}
</div>

<style>
	.button {
		place-self: center;
		display: grid;
		place-items: center;
		transition:
			transform 0.1s,
			color 0.3s;
		cursor: pointer;
		box-sizing: border-box;
	}

	.text-only:hover {
		filter: sepia(1);
	}

	.framed {
		border: 1px solid var(--gold-dim);
		padding: 0.25em 1.25em;
	}

	.framed:hover {
		background: #c8a84a0f;
		border-color: var(--gold);
		box-shadow: 0 0 20px #c8a84a26;
	}

	.framed::before,
	.framed::after {
		content: '';
		position: absolute;
		width: 0.3em;
		height: 0.3em;
		border-color: var(--gold);
		border-style: solid;
		transition: all 0.2s;
	}

	.framed::before {
		left: 0;
		top: 0;
		translate: -1px -1px;
		border-width: 1px 0 0 1px;
	}

	.framed::after {
		right: 0;
		bottom: 0;
		translate: 1px 1px;
		border-width: 0 1px 1px 0;
	}

	.disabled {
		cursor: initial;
		pointer-events: none;
		color: #ffffff50;
	}

	.button:focus {
		outline: none !important;
	}
</style>

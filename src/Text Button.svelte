<script>
	import { ss } from './state.svelte';
	import { post } from './utils';

	const { id, text, selected, style, disabled, onClick } = $props();

	let scale = $state(1);
	let timer = $state(false);

	const classes = $derived(['button-base no-highlight button' + (selected ? ' selected' : ''), { disabled }]);
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
		border-radius: 50%;
		transition: transform 0.1s, color 0.3s;
		cursor: pointer;
	}

	.button:hover {
		filter: contrast(2) brightness(2);
	}

	.disabled {
		cursor: initial;
		pointer-events: none;
		color: #ffffff50;
	}

	.button:focus {
		outline: none !important;
	}

	.selected {
		text-decoration: underline;
	}
</style>

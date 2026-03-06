<script>
	import { post } from './utils';

	const { id, src, width = 50, disabled, showDisabled = true, opaque = false, onClick } = $props();

	let scale = $state(1);
	let timer3 = $state(false);

	const classes = $derived(
		`button-base no-highlight button ${opaque ? 'opaque' : ''} ${disabled ? 'disabled' : ''} ${disabled && showDisabled ? 'gray' : ''}`
	);
	const style = $derived(`width: ${width}px; height: ${width}px; transform: scale(${scale})`);

	$effect(() => {
		const onTransitionEnd = (e) => {
			if (e.target.id !== id) {
				return;
			}

			if (e.propertyName === 'opacity' || e.propertyName === 'background-color' || e.propertyName === 'filter') {
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

	const onPointerDown = () => {
		if (timer3) {
			return;
		}

		scale = 0.7;

		timer3 = post(() => (timer3 = null), 500);
	};
</script>

<div {id} class={classes} onpointerdown={onPointerDown} {style}>
	{#if true}
		{@const style = 'user-drag: none;'}
		<img class="img" {style} {src} alt="" {width} />
	{/if}
</div>

<style>
	.button {
		place-self: center;
		display: grid;
		place-items: center;
		border-radius: 25%;
		transition: transform 0.1s;
		opacity: 0.7;
	}

	.opaque {
		opacity: 1;
	}

	.button:hover {
		opacity: 1;
	}

	.disabled {
		pointer-events: none;
	}

	.gray {
		filter: opacity(0.4);
	}

	.button:focus {
		outline: none !important;
	}

	.img {
		grid-area: 1/1;
		-webkit-user-drag: none; /* For WebKit browsers (Chrome, Safari) */
	}
</style>

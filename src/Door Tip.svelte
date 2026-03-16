<script>
	import X from '$lib/images/X.webp';
	import { persist, showTip } from './shared.svelte';
	import { ss } from './state.svelte';

	const red = $derived(ss.tip === 'red');
	const blue = $derived(ss.tip === 'blue');
	const hidden = $derived(!showTip())
	const tranistion = $derived(hidden ? 'none' : 'opacity 1s');

	const onClose = () => {
		if (red) {
			ss.seenRed = true;
		} else if (blue) {
			ss.seenBlue = true;
		}

		persist(true);
		delete ss.tip;
	};
</script>

<div class="door-tip {red ? 'red-border' : 'blue-border'} {hidden ? 'hidden' : ''}" style="transition: {tranistion};">
	<div class="door-tip-title {red ? 'red-text' : 'blue-text'}">{red ? 'Red' : 'Blue'} Door</div>
	<div class="door-tip-desc">Slides {red ? 'down' : 'up'}, gap stays at the {red ? 'top' : 'bottom'}</div>
	<img class="x button-base no-highlight" src={X} alt="" width={16} onpointerdown={onClose} />
</div>

<style>
	.door-tip {
		grid-area: 5/1;
		place-self: center;
		display: grid;
		width: 310px;
		box-sizing: border-box;
		background: #50d09012;
		border: 1px solid var(--lead-lt);
		color: var(--text);
		padding: 16px 20px;
		text-align: left;
	}

	.hidden {
		opacity: 0;
	}

	.red-border {
		border-color: #a15f48b3;
	}

	.blue-border {
		border-color: #6087e0b3;
	}

	.red-text {
		color: #a15f48;
	}

	.blue-text {
		color: #779ff0;
	}

	.door-tip-title {
		grid-area: 1/1;
		font-family: Cinzel;
		font-size: 16px;
		letter-spacing: 0.1em;
		margin-bottom: 4px;
	}

	.door-tip-desc {
		font-family: EBG;
		font-size: 18px;
		font-style: italic;
		color: var(--text);
		opacity: 0.55;
	}

	.x {
		grid-area: 1/1;
		place-self: start end;
		opacity: 0.7;
	}

	.x:hover {
		opacity: 1;
	}
</style>

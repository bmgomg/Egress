<script>
	import { OP_EASY } from './const';
	import { onChallenge } from './shared.svelte';
	import { _sound } from './sound.svelte';
	import { ss } from './state.svelte';

	const onClick = (e) => {
		if (!_sound.musicPlayed) {
			_sound.playMusic();
		}

		if (e.ctrlKey) {
			delete ss.splash;
			onChallenge(OP_EASY);
		}
	};
</script>

<div class="splash no-highlight" onpointerdown={onClick}>
	<div class="title-ornament">A PUZZLE OF</div>
	<div class="title-ornament">GRAVITY AND ESCAPE</div>
	<div class="title">Egress</div>
	<div class="byline">by Beautiful Mind Games</div>
</div>

<style>
	.splash {
		position: absolute;
		z-index: 300;
		width: 100dvw;
		height: 100dvh;
		display: grid;
		place-content: center;
	}

	.title {
		font-family: CD;
		font-weight: 700;
		font-size: 15vw;
		color: var(--gold);
		letter-spacing: 0.06em;
		line-height: 1;
		text-align: center;
		margin-top: 3vw;
		position: relative;
		z-index: 1;
		opacity: 0;
		transform: scale(0.5);
		animation: emerge 5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
		text-shadow:
			0 0 40px #c8a84a80,
			0 0 80px #c8a84a33;
	}

	.title-ornament {
		font-size: 2.5vw;
		letter-spacing: 0.6em;
		color: var(--gold-dim);
		text-align: center;
		margin-bottom: 2vw;
		position: relative;
		z-index: 1;
		opacity: 0;
		transform: scale(0.5);
		animation: emerge 5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
	}

	.byline {
		font-family: EBG;
		font-style: italic;
		font-size: 4vw;
		color: #c0b090a6;
		letter-spacing: 0.06em;
		text-align: center;
		margin-top: 2vw;
		position: relative;
		z-index: 1;
		opacity: 0;
		transform: scale(0.5);
		animation: emerge 5s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
	}

	@keyframes emerge {
		0% {
			opacity: 0;
			transform: scale(0.5);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>

<script>
	import { fade } from 'svelte/transition';
</script>

<div class="splash">
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
		color: #c8a84a;
		letter-spacing: 0.06em;
		line-height: 1;
		text-align: center;
		position: relative;
		z-index: 1;
		opacity: 0;
		transform: scale(0.5);
		animation: emerge 5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
		text-shadow:
			0 0 40px #c8a84a80,
			0 0 80px #c8a84a33;
	}

	.byline {
		font-family: EBG;
		font-style: italic;
		font-size: 4vw;
		color: rgba(192, 176, 144, 0.65);
		letter-spacing: 0.06em;
		text-align: center;
		margin-top: clamp(8px, 2vw, 18px);
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

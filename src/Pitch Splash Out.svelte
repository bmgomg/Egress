<script>
</script>

<div class="splash">
	<div class="title">Egress</div>
	<div class="byline">by Beautiful Mind Games</div>
	<div class="tagline">Think outside the box — then empty it.</div>
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

	.tagline {
		font-family: EBG;
		font-style: italic;
		font-size: 4.6vw;
		color: #c0b09080;
		letter-spacing: 0.04em;
		text-align: center;
		margin-top: 8vw;
		position: relative;
		z-index: 1;
		opacity: 0;
		animation: fadein 1.8s ease forwards;
		animation-delay: 2.6s;
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

	@keyframes fadein {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>

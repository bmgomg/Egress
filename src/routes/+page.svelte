<script>
    import Frame from '$lib/images/Frame.webp';
	import GamePage from '../Game Page.svelte';
	import Home from '../Home.svelte';
	import Splash from '../Splash.svelte';
	import { ss } from '../state.svelte';
	import { clientRect, post } from '../utils';

	let scale = $state(1);

	$effect(() => {
		const disable = (e) => {
			e.preventDefault();
		};

		const onResize = () => {
			let scx = 1;
			let scy = 1;

			const r = clientRect('.app');

			if (r.width < 450) {
				scx = r.width / 450;
			}

			if (r.height < 788) {
				scy = r.height / 788;
			}

			scale = Math.min(scx, scy);
		};

		onResize();

		window.addEventListener('contextmenu', disable);
		window.addEventListener('dblclick', disable);
		window.addEventListener('resize', onResize);

		return () => {
			window.removeEventListener('contextmenu', disable);
			window.removeEventListener('dblclick', disable);
			window.removeEventListener('resize', onResize);
		};
	});

	let splash = $state(true);
	post(() => (splash = false), 2000);
</script>

<div class="app">
	{#if splash}
		<Splash />
	{:else}
		<div class="content bg" style="scale: {scale};">
			<img class="frame" src={Frame} alt="" />
			<GamePage />
			<Home />
			{#if ss.home}
				<div class="disclaimer no-highlight">
					<span>MUSIC BY ERIC MATYAS  •  WWW.SOUNDIMAGE.ORG</span>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.app {
		height: 100dvh;
		display: grid;
		place-content: center;
		box-sizing: border-box;
	}

	.content {
		grid-area: 1/1;
		place-self: center;
		display: grid;
		touch-action: none;
		width: 450px;
		height: 788px;
		box-sizing: border-box;
        background: var(--background);
        background-image: radial-gradient(transparent, black 150%);
	}

    .bg {
        background: #135c99;
        background-image: radial-gradient(transparent, black 150%), url('$lib/images/Texture.webp');
        background-size: 407px 750px;
  }

    .frame {
        grid-area: 1/1;
        touch-action: none;
    }

	.disclaimer {
		display: none;
		grid-area: 1/1;
		place-self: center;
		font-size: 10px;
		transform: translateY(368px);
		justify-items: center;
		gap: 3px;
		opacity: 0.8;
	}
</style>

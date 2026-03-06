<script>
	import favicon from '$lib/images/favicon.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style>
	:global {
		body {
			margin: 0;
			padding: 0;
			height: 100dvh;
			width: 100%;
            --white: #ffffff;
            --gold: #ffe4aa;
			--water: #2c3a49;
            --blue: #9dc1de;
			--red: #ff3c31;
			/* --background: #2f5f85; */
			--background: #4c538d;
			background: var(--background);
            --ow: #d0d0d0;
			color: var(--ow);
			background-image: url('$lib/images/Texture.webp');
			background-size: 407px 750px;
			place-content: center;
			font-family: Poppins;
		}

		.button-base {
			box-sizing: border-box;
			display: grid;
			place-content: center;
			transition: transform 0.1s;
			cursor: pointer;
		}

		.button-base:focus {
			outline: none !important;
		}

		.no-highlight {
			-webkit-tap-highlight-color: transparent;
			-webkit-touch-callout: none;
			-webkit-user-select: none;
			-khtml-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			user-select: none;
		}

		@font-face {
			font-family: Stencil;
			src: url('$lib/fonts/Warband Stencil Textured.otf');
		}

		@font-face {
			font-family: Poppins;
			src: url('$lib/fonts/Poppins.ttf');
		}

		@font-face {
			font-family: Roboto;
			src: url('$lib/fonts/Roboto-Regular.ttf');
		}

		@font-face {
			font-family: RC;
			src: url('$lib/fonts/Roboto Condensed.ttf');
		}
	}
</style>

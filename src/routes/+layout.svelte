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
			--bg: #0b0e14;
			--panel: #0f1420;
			--lead: #1e2a1e;
			--lead-lt: #2e4030;
			--gold: #c8a84a;
			--gold-lt: #e8cc80;
			--gold-dim: #6a5820;
			--blue: #4a9fd4;
			--blue-lt: #8ecfee;
			--blue-dim: #1a3a50;
			--amber: #c87820;
			--amber-lt: #f0b050;
			--amber-dim: #5a3008;
			--door: #50d090;
			--door-dim: #1a4a30;
			--text: #c0b090;
			/* --text-dim: #4a4030; */
			--text-dim: #c0b09080;
			background: var(--bg);
			color: var(--text);
			font-family: EBG;
			place-content: center;
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
			font-family: Cinzel;
			src: url('$lib/fonts/Cinzel.ttf');
		}

		@font-face {
			font-family: CD;
			src: url('$lib/fonts/Cinzel Decorative.ttf');
		}

		@font-face {
			font-family: EBG;
			src: url('$lib/fonts/EB Garamond.ttf');
		}
	}
</style>

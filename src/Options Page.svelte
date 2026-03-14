<script>
	import { NO_SLIDE, SLIDE_DOWN, SLIDE_UP } from './const';
	import SoundOps from './Sound Ops.svelte';
	import { ss } from './state.svelte';

	const hidden = $derived(!ss.opsPage);

	const onClose = () => {
		delete ss.opsPage;
		ss.home = true;
	};

	const selected = (slide) => {
		return ss.slide === slide ? 'selected' : '';
	};
</script>

<div class="ops_page {hidden ? 'hidden' : ''}">
	<div class="title" onpointerdown={onClose}>DOOR</div>
	<div class="subtitle">How does the door behave on side walls?</div>
	<div class="door-op {selected(SLIDE_UP)}" onpointerdown={() => (ss.slide = SLIDE_UP)}>
		<div class="door-op-title">Slides Up</div>
		<div class="door-op-desc">Panel rises — gap stays at the bottom</div>
	</div>
	<div class="door-op {selected(SLIDE_DOWN)}" onpointerdown={() => (ss.slide = SLIDE_DOWN)}>
		<div class="door-op-title">Slides Down</div>
		<div class="door-op-desc">Panel falls — gap stays at the top</div>
	</div>
	<div class="door-op {selected(NO_SLIDE)}" onpointerdown={() => (ss.slide = NO_SLIDE)}>
		<div class="door-op-title">Fixed</div>
		<div class="door-op-desc">Door stays where it lands</div>
	</div>
	<div class='divider'></div>
	<div class="title" onpointerdown={onClose}>SOUND</div>
	<SoundOps/>
</div>

<style>
	.ops_page {
		grid-area: 1/1;
		display: grid;
		place-content: center;
		place-items: center;
		width: 100%;
		transition: opacity 0.2s;
		user-select: none;
		z-index: 1;
	}

	.hidden {
		opacity: 0;
		pointer-events: none;
	}

	.title {
		color: var(--gold-dim);
		font-size: 22px;
	}

	.subtitle {
		font-family: EBG;
		font-size: 18px;
		font-style: italic;
		color: var(--text);
		margin: 20px 0;
	}

	.door-op {
		display: grid;
		width: 300px;
		background: #ffffff05;
		border: 1px solid var(--lead-lt);
		color: var(--text);
		margin-top: 15px;
		padding: 16px 20px;
		text-align: left;
		cursor: pointer;
		transition:
			border-color 0.3s,
			background-color 0.3s;
	}

	.door-op:hover {
		background: #ffffff0d;
	}

	.door-op.selected {
		border-color: #50d090b3;
		background: #50d09012;
		pointer-events: none;
	}

	.door-op-title {
		font-family: Cinzel;
		font-size: 16px;
		letter-spacing: 0.1em;
		color: var(--text);
		margin-bottom: 4px;
		transition: color 0.3s;
	}

	.door-op.selected .door-op-title {
		color: var(--door);
	}

	.door-op-desc {
		font-family: EBG;
		font-size: 18px;
		font-style: italic;
		color: var(--text);
		opacity: 0.55;
	}

	.divider {
		width: 200px;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--gold-dim), transparent);
		margin: 50px 0;
	}

	.divider {
		/* height: 60px; */
	}
</style>

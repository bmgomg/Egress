<script>
	import { isAnimated, isInitial, isSolved, persist, playSolution, goHome } from './shared.svelte';
	import { _sound } from './sound.svelte';
	import { _stats, ss } from './state.svelte';
	import TextButton from './Text Button.svelte';
	import { post } from './utils';

	const onHome = () => {
		goHome(true);
	};

	const onResetStats = () => {
		//
	};

	const onSurrender = () => {
		ss.surrender = true;
		ss.moves = 0;

		if (!ss.over) {
			ss.over = 'fail';
		}

		persist();

		if (isInitial()) {
			post(playSolution, 200);
		} else {
			ss.flip = 'surrender';
		}
	};

	const onSound = () => {
		_sound.sfx = !_sound.sfx;

		if (_sound.sfx) {
			_sound.play('won', { rate: 4 });
		}

		persist();
	};

	const onMusic = () => {
		_sound.music = !_sound.music;

		if (_sound.music) {
			_sound.playMusic();
		} else {
			_sound.stopMusic();
		}

		persist();
	};

	const canHome = $derived(!isAnimated() && !ss.surrender);
	const canSurrender = $derived(!isSolved() && !ss.surrender);
	const canResetStats = _stats.wins > 0;
</script>

<div class="toolbar">
	<TextButton id="tb-home" text={['Home']} disabled={!canHome} onClick={onHome} />
	<TextButton id="tb-stats" text={['Reset', 'Stats']} disabled={canResetStats} onClick={onResetStats} />
	<TextButton id="tb-surrender" text={['Give', 'Up']} disabled={!canSurrender} onClick={onSurrender} />
	<TextButton id="tb-sfx" text={['Sfx', _sound.sfx ? 'On' : 'Off']} onClick={onSound} />
	<TextButton id="tb-music" text={['Music', _sound.music ? 'On' : 'Off']} onClick={onMusic} />
</div>

<style>
	.toolbar {
		display: grid;
		grid-auto-flow: column;
		place-content: center;
		align-items: center;
		gap: 25px;
	}
</style>

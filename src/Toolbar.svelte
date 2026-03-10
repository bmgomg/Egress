<script>
	import { PROMPT_RESET_STATS } from './const';
	import { isAnimated, isInitial, isSolved, setToInitial, persist, showIntro } from './shared.svelte';
	import { _sound } from './sound.svelte';
	import { _prompt, _stats, ss } from './state.svelte';
	import TextButton from './Text Button.svelte';
	import { post } from './utils';

	const onHome = () => {
		showIntro(true);
		_prompt.id = null;
	};

	const onResetStats = () => {
		if (_prompt.id == PROMPT_RESET_STATS) {
			_prompt.opacity = 0;
			return;
		}

		_sound.play('plop');
		_prompt.set(PROMPT_RESET_STATS);
	};

	const onSurrender = () => {
		ss.surrender = true;

		setToInitial();

		post(
			() => {
				for (let i = 0; i < ss.solution.length; i++) {
					const spin = ss.solution[i] === 'CW' ? 1 : -1;

					post(() => {
						_sound.play('click');
						ss.spin = spin;

						if (i === ss.solution.length - 1) {
							post(() => delete ss.surrender, 1000);
						}
					}, i * 1500);
				}
			},
			isInitial() ? 200 : 1500
		);
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
</script>

<div class="toolbar">
	<TextButton id="tb-home" text={['Home']} disabled={!canHome} onClick={onHome} />
	<TextButton id="tb-stats" text={['Reset', 'Stats']} onClick={onResetStats} disabled={_stats.plays === 0} />
	<TextButton id="tb-surrender" text={['Solve']} disabled={!canSurrender} onClick={onSurrender} />
	<TextButton id="tb-sfx" text={['Sound', _sound.sfx ? 'On' : 'Off']} onClick={onSound} />
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

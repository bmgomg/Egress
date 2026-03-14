<script>
	import { persist } from './shared.svelte';
	import { _sound } from './sound.svelte';

	const onSound = () => {
		_sound.sfx = !_sound.sfx;

		if (_sound.sfx) {
			_sound.play('won', { rate: 4 });
		}

		persist(true);
	};

	const onMusic = () => {
		_sound.music = !_sound.music;

		if (_sound.music) {
			_sound.playMusic();
		} else {
			_sound.stopMusic();
		}

		persist(true);
	};
</script>

<div class="sound-ops no-highlight">
	<div class="op" onpointerdown={onSound}>
		SFX <div class="onoff {_sound.sfx ? 'on' : ''}">{_sound.sfx ? 'On' : 'Off'}</div>
	</div>
	•
	<div class="op" onpointerdown={onMusic}>
		Music <div class="onoff {_sound.music ? 'on' : ''}">{_sound.music ? 'On' : 'Off'}</div>
	</div>
</div>

<style>
	.sound-ops {
		margin: 25px 0;
		display: grid;
		grid-auto-flow: column;
		font-size: 18px;
		gap: 30px;
		cursor: pointer;
        color: var(--text);
	}

	.op {
		display: grid;
		grid-auto-flow: column;
	}

	.onoff {
		width: 35px;
        margin-left: 10px;
        color: var(--gold-dim);
	}

	.on {
		color: var(--door);
	}
</style>

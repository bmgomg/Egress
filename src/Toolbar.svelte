<script>
	import { goHome, isAnimated, isInitial, isSolved, persist, playSolution } from './shared.svelte';
	import { _stats, ss } from './state.svelte';
	import TextButton from './Text Button.svelte';
	import { post } from './utils';

	const onHome = () => {
		goHome(true);
	};

	const onResetStats = () => {
		_stats.plays = 0;
		_stats.wins = 0;
		_stats.total = 0;
	};

	const onSurrender = () => {
		ss.surrender = true;
		ss.moves = 0;

		if (!ss.over) {
			ss.over = 'fail';
			_stats.plays++;
		}

		persist();

		if (isInitial()) {
			post(playSolution, 200);
		} else {
			ss.flip = 'surrender';
		}
	};

	const canHome = $derived(!isAnimated() && !ss.surrender);
	const canSurrender = $derived(!isSolved() && !ss.surrender);
	const canResetStats = $derived(_stats.plays > 0);
</script>

<div class="toolbar">
	<TextButton id="tb-home" text={['Home']} disabled={!canHome} onClick={onHome} />
	<TextButton id="tb-surrender" text={['Give', 'Up']} disabled={!canSurrender} onClick={onSurrender} />
	<TextButton id="tb-stats" text={['Reset', 'Stats']} disabled={!canResetStats} onClick={onResetStats} />
</div>

<style>
	.toolbar {
		display: grid;
		grid-auto-flow: column;
		place-content: center;
		align-items: center;
		gap: 35px;
		font-size: 15px;
	}
</style>

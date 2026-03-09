<script>
	import BoxB from '$lib/images/Box B.webp';
	import BoxBL from '$lib/images/Box BL.webp';
	import BoxBR from '$lib/images/Box BR.webp';
	import BoxL from '$lib/images/Box L.webp';
	import BoxR from '$lib/images/Box R.webp';
	import BoxT from '$lib/images/Box T.webp';
	import BoxTL from '$lib/images/Box TL.webp';
	import BoxTR from '$lib/images/Box TR.webp';
	import { CELL_MARGIN, CELL_SIZE } from './const';
	import { ss } from './state.svelte';

	const { sz, th } = $props();
	const dsz = $derived(CELL_SIZE + CELL_MARGIN * 6);
	const wsz = $derived(sz - dsz);
	const off = $derived(dsz / 2);

	const topStyle = $derived.by(() => {
		const width = ss.door.startsWith('t') ? wsz : sz;
		const dx = width < sz ? ss.door.endsWith('1') ? -off : off : 0;

		return `width: ${width}px; height: ${th}px; translate: ${dx}px 0;`;
	});

	const bottomStyle = $derived.by(() => {
		const width = ss.door.startsWith('b') ? wsz : sz;
		const dx = width < sz ? ss.door.endsWith('1') ? -off : off : 0;

		return `width: ${width}px; height: ${th}px; translate: ${dx}px 0;`;
	});

	const leftStyle = $derived.by(() => {
		const height = ss.door.startsWith('l') ? wsz : sz;
		const dy = height < sz ? ss.door.endsWith('0') ? off : -off : 0;

		return `width: ${th}px; height: ${height}px; translate: 0 ${dy}px;`;
	});

	const rightStyle = $derived.by(() => {
		const height = ss.door.startsWith('r') ? wsz : sz;
		const dy = height < sz ? ss.door.endsWith('0') ? off : -off : 0;

		return `width: ${th}px; height: ${height}px; translate: 0 ${dy}px;`;
	});
</script>

<img class="box-tl" src={BoxTL} alt="" style="width: {th}px;" />
<img class="box-top" src={BoxT} alt="" style={topStyle} />
<img class="box-tr" src={BoxTR} alt="" style="width: {th}px;" />
<img class="box-right" src={BoxR} alt="" style={rightStyle} />
<img class="box-br" src={BoxBR} alt="" style="width: {th}px;" />
<img class="box-bottom" src={BoxB} alt="" style={bottomStyle} />
<img class="box-bl" src={BoxBL} alt="" style="width: {th}px;" />
<img class="box-left" src={BoxL} alt="" style={leftStyle} />

<style>
	.box-tl {
		grid-area: 1/1;
		aspect-ratio: 1;
		place-self: start;
	}

	.box-top {
		grid-area: 1/1;
		place-self: start center;
	}

	.box-tr {
		grid-area: 1/1;
		aspect-ratio: 1;
		place-self: start end;
	}

	.box-right {
		grid-area: 1/1;
		place-self: center end;
	}

	.box-br {
		grid-area: 1/1;
		aspect-ratio: 1;
		place-self: end;
	}

	.box-bottom {
		grid-area: 1/1;
		place-self: end center;
	}

	.box-bl {
		grid-area: 1/1;
		aspect-ratio: 1;
		place-self: end start;
	}

	.box-left {
		grid-area: 1/1;
		place-self: center start;
	}
</style>

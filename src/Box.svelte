<script>
	import BoxTL from '$lib/images/Box TL.webp';
	import BoxT from '$lib/images/Box T.webp';
	import BoxTR from '$lib/images/Box TR.webp';
	import BoxR from '$lib/images/Box R.webp';
	import BoxBR from '$lib/images/Box BR.webp';
	import BoxB from '$lib/images/Box B.webp';
	import BoxBL from '$lib/images/Box BL.webp';
	import BoxL from '$lib/images/Box L.webp';

    const { sz, th } = $props();
</script>

<img class="box-tl" src={BoxTL} alt="" style="width: {th}px;" />
<img class="box-top" src={BoxT} alt="" style="width: {sz}px; height: {th}px;" />
<img class="box-tr" src={BoxTR} alt="" style="width: {th}px;" />
<img class="box-right" src={BoxR} alt="" style="height: {sz}px; width: {th}px;" />
<img class="box-br" src={BoxBR} alt="" style="width: {th}px;" />
<img class="box-bottom" src={BoxB} alt="" style="width: {sz}px; height: {th}px;" />
<img class="box-bl" src={BoxBL} alt="" style="width: {th}px;" />
<img class="box-left" src={BoxL} alt="" style="height: {sz}px; width: {th}px;" />

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
